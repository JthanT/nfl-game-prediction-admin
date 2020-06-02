import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { GAME_SCHEDULE_INSERT } from '../graphql/queries/game.query';

function AdminGameInsert() {

    const [awayTeam, setAwayTeam] = useState<string>();
    const [homeTeam, setHomeTeam] = useState<string>();
    const [leagueYear, setLeagueYear] = useState<number>();
    const [time, setTime] = useState<string>();
    const [week, setWeek] = useState<number>();
    const [date, setDate] = useState<string>();

    const [insertGame] = useMutation(GAME_SCHEDULE_INSERT);

    const handleGameInsert = () => {
        insertGame(
            {
                variables: {
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
                    onChange={(fieldValue) => setAwayTeam(fieldValue.target.value)}
                />

                <Typography>
                    Home Team
                </Typography>
                <TextField
                    onChange={(fieldValue) => setHomeTeam(fieldValue.target.value)}
                />

                <Typography>
                    Date
                </Typography>
                <TextField
                    onChange={(fieldValue) => setDate(fieldValue.target.value)}
                />

                <Typography>
                    Time
                </Typography>
                <TextField
                    onChange={(fieldValue) => setTime(fieldValue.target.value)}
                />
                
                <Typography>
                    Week
                </Typography>
                <TextField
                    onChange={(fieldValue) => setWeek(parseInt(fieldValue.target.value))}
                />

                <Typography>
                    Year
                </Typography>
                <TextField
                    onChange={(fieldValue) => setLeagueYear(parseInt(fieldValue.target.value))}
                />

                <Button onClick={handleGameInsert}>
                    Insert
                </Button>
            </DialogContent>
        </div>
    );
}

export default AdminGameInsert;
