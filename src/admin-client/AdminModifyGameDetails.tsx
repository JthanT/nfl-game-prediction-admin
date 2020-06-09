import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { GAME_SCHEDULE_BY_ID_QUERY } from '../graphql/queries/game.query';
import { GAME_SCHEDULE_UPDATE_BY_ID } from '../graphql/queries/game.query';

function AdminModifyGameDetails(props: {gameId: number, refetchGameDetails?: () => void}) {

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
                    id: data?.game_schedule[0].game_id,
                    team_1_name: (!awayTeam || awayTeam === "") ?
                        data?.game_schedule[0].team_1_name :
                        awayTeam, 
                    team_2_name: (!homeTeam || homeTeam === "") ?
                        data?.game_schedule[0].team_2_name :
                        homeTeam, 
                    league_year: (!leagueYear || leagueYear == 0) ?
                        data?.game_schedule[0].league_year :
                        leagueYear, 
                    time: (!time || time === "") ?
                        data?.game_schedule[0].time :
                        time, 
                    week: (!week || week == 0) ?
                        data?.game_schedule[0].week :
                        week, 
                    date: (!date || date === "") ?
                        data?.game_schedule[0].date :
                        date, 
                }
            }
        )

        if (props.refetchGameDetails) {
            props.refetchGameDetails()
        };
    };

    return (
        <div>
            <DialogTitle>
                {data?.game_schedule[0].team_1_name} @ {data?.game_schedule[0].team_2_name}
            </DialogTitle>
            
            <DialogContent>
                <Typography>
                    Away Team
                </Typography>
                <TextField
                    value={awayTeam ?? data?.game_schedule[0].team_1_name}
                    onChange={(fieldValue) => setAwayTeam(fieldValue.target.value ? fieldValue.target.value : "")}
                />
            </DialogContent>

            <DialogContent>
                <Typography>
                    Home Team
                </Typography>
                <TextField
                    value={homeTeam ?? data?.game_schedule[0].team_2_name}
                    onChange={(fieldValue) => setHomeTeam(fieldValue.target.value ? fieldValue.target.value : "")}
                />
            </DialogContent>
                
            <DialogContent>
                <Typography>
                    Date
                </Typography>
                <TextField
                    value={date ?? data?.game_schedule[0].date}
                    onChange={(fieldValue) => setDate(fieldValue.target.value ? fieldValue.target.value : "")}
                />
            </DialogContent>
                
            <DialogContent>
                <Typography>
                    Time
                </Typography>
                <TextField
                    value={time ?? data?.game_schedule[0].time}
                    onChange={(fieldValue) => setTime(fieldValue.target.value ? fieldValue.target.value : "")}
                />
            </DialogContent>
                
            <DialogContent>
                <Typography>
                    Week
                </Typography>
                <TextField
                    value={week ?? data?.game_schedule[0].week}
                    onChange={(fieldValue) => setWeek(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                />
            </DialogContent>

            <DialogContent>
                <Typography>
                    Year
                </Typography>
                <TextField
                    value={leagueYear ?? data?.game_schedule[0].league_year}
                    onChange={(fieldValue) => setLeagueYear(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                />
            </DialogContent>

            <DialogContent dividers>
                <Button onClick={handleGameUpdate}>
                    Update
                </Button>
            </DialogContent>
        </div>
    );
}

export default AdminModifyGameDetails;
