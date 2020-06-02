import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { GAME_SCHEDULE_BY_ID_QUERY } from '../graphql/queries/game.query';
import { GAME_SCHEDULE_UPDATE_BY_ID } from '../graphql/queries/game.query';

function AdminGameDetails(props: {gameId: number}) {

    const [awayTeam, setAwayTeam] = useState<string>();
    const [homeTeam, setHomeTeam] = useState<string>();
    const [leagueYear, setLeagueYear] = useState<number>();
    const [time, setTime] = useState<string>();
    const [week, setWeek] = useState<number>();
    const [date, setDate] = useState<string>();

    const [updateGameDetails] = useMutation(GAME_SCHEDULE_UPDATE_BY_ID);
    
    const { data } = useQuery(
        GAME_SCHEDULE_BY_ID_QUERY,
        {
            variables: {
                id: props.gameId
            },
        }
    );

    const handleGameUpdate = () => {
        updateGameDetails(
            {
                variables: {
                    id: props.gameId,
                    team_1_name: awayTeam, 
                    team_2_name: homeTeam, 
                    league_year: leagueYear, 
                    time: time, 
                    week: week, 
                    date: date
                }
            }
        )
    };

    return (
        <div>
            <DialogContent>
                <Typography>
                    Away Team
                </Typography>
                <TextField
                    value={data?.game_schedule[0].team_1_name}
                    onChange={(fieldValue) => setAwayTeam(fieldValue.target.value)}
                />

                <Typography>
                    Home Team
                </Typography>
                <TextField
                    value={data?.game_schedule[0].team_2_name}
                    onChange={(fieldValue) => setHomeTeam(fieldValue.target.value)}
                />

                <Typography>
                    Date
                </Typography>
                <TextField
                    value={data?.game_schedule[0].date}
                    onChange={(fieldValue) => setDate(fieldValue.target.value)}
                />

                <Typography>
                    Time
                </Typography>
                <TextField
                    value={data?.game_schedule[0].time}
                    onChange={(fieldValue) => setTime(fieldValue.target.value)}
                />
                
                <Typography>
                    Week
                </Typography>
                <TextField
                    value={data?.game_schedule[0].week}
                    onChange={(fieldValue) => setWeek(parseInt(fieldValue.target.value))}
                />

                <Typography>
                    Year
                </Typography>
                <TextField
                    value={data?.game_schedule[0].league_year}
                    onChange={(fieldValue) => setLeagueYear(parseInt(fieldValue.target.value))}
                />

                <Button onClick={handleGameUpdate}>
                    Update
                </Button>
            </DialogContent>
        </div>
    );
}

export default AdminGameDetails;
