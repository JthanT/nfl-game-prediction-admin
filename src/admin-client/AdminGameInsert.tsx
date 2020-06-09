import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { GAME_SCHEDULE_INSERT } from '../graphql/queries/game.query';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.query';

function AdminGameInsert(props: {refetchGames?: () => void}) {

    const [awayTeam, setAwayTeam] = useState<string>();
    const [homeTeam, setHomeTeam] = useState<string>();
    const [leagueYear, setLeagueYear] = useState<number>();
    const [time, setTime] = useState<string>();
    const [week, setWeek] = useState<number>();
    const [date, setDate] = useState<string>();
    const [openAwayTeamSelector, setOpenAwayTeamSelector] = useState<boolean>(false);
    const [openHomeTeamSelector, setOpenHomeTeamSelector] = useState<boolean>(false);

    const [insertGame] = useMutation(GAME_SCHEDULE_INSERT);

    const { data } = useQuery(TEAM_DETAILS_QUERY);

    const teamOptions = data?.team_details.map((team) => team.name);

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

        if (props.refetchGames) {
            props.refetchGames()
        };
    };

    const handleCloseAwayTeamSelector = () => {
        setOpenAwayTeamSelector(false);
    };
    
    const handleOpenAwayTeamSelector = () => {
        setOpenAwayTeamSelector(true);
    };

    const handleCloseHomeTeamSelector = () => {
        setOpenHomeTeamSelector(false);
    };

    const handleOpenHomeTeamSelector = () => {
        setOpenHomeTeamSelector(true);
    };

    const classes = useStyles();

    return (
        <div>
            <DialogTitle>
                Create Game
            </DialogTitle>
            <DialogContent>
                <DialogContent className={classes.inputRow} dividers>
                    <DialogContent>
                        <FormControl className={classes.teamSelectors}>
                            <InputLabel htmlFor="away-team-id">Away Team</InputLabel>
                            <Select
                                value={awayTeam}
                                labelId="away-team-id"
                                onChange={(fieldValue) => setAwayTeam(fieldValue.target.name)}
                                onClose={handleCloseAwayTeamSelector}
                                onOpen={handleOpenAwayTeamSelector}
                            >
                                {data && (
                                    teamOptions.map((name) => {
                                        return <MenuItem value={name}>{name}</MenuItem>
                                    })
                                )}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogContent>
                        <FormControl className={classes.teamSelectors}>
                            <InputLabel htmlFor="home-team-id">Home Team</InputLabel>
                            <Select
                                value={homeTeam}
                                labelId="home-team-id"
                                onChange={(fieldValue) => setHomeTeam(fieldValue.target.name)}
                                onClose={handleCloseHomeTeamSelector}
                                onOpen={handleOpenHomeTeamSelector}
                            >
                                {data && (
                                    teamOptions.map((name) => {
                                        return <MenuItem value={name}>{name}</MenuItem>
                                    })
                                )}
                            </Select>
                        </FormControl>
                    </DialogContent>
                </DialogContent>

                <DialogContent className={classes.inputRow}>
                    <DialogContent>
                        <Typography>
                            Date
                        </Typography>
                        <TextField
                            onChange={(fieldValue) => setDate(fieldValue.target.value)}
                        />
                    </DialogContent>

                    <DialogContent>
                        <Typography>
                            Time (CST)
                        </Typography>
                        <TextField
                            onChange={(fieldValue) => setTime(fieldValue.target.value)}
                        />
                    </DialogContent>
                </DialogContent>
                
                <DialogContent className={classes.inputRow} dividers>
                    <DialogContent>
                        <Typography>
                            Week
                        </Typography>
                        <TextField
                            onChange={(fieldValue) => setWeek(parseInt(fieldValue.target.value))}
                        />
                    </DialogContent>

                    <DialogContent>
                        <Typography>
                            League Year
                        </Typography>
                        <TextField
                            onChange={(fieldValue) => setLeagueYear(parseInt(fieldValue.target.value))}
                        />
                    </DialogContent>
                </DialogContent>

                <DialogContent className={classes.buttonRow}>
                    <Button variant="outlined" onClick={handleGameInsert} className={classes.addButton}>
                        Add Game
                    </Button>
                </DialogContent>
            </DialogContent>
        </div>
    );
}

export default AdminGameInsert;

const useStyles = makeStyles({
    inputRow: {
        display: 'flex',
    },
    teamSelectors: {
        display: 'flex',
    },
    addButton: {
        textTransform: 'none',
    },
    buttonRow: {
        display: 'flex', 
        justifyContent: 'flex-end',
    },
});
