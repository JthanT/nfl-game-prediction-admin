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
import DateFnsUtils from '@date-io/date-fns';
import format from 'date-fns/format';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { timeSelections, currentLeagueTimes } from '../utils/time';
import { GAME_SCHEDULE_INSERT } from '../graphql/mutations/game.mutations';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.queries';

function AdminGameInsert(props: {refetchGames?: () => void}) {

    const { data } = useQuery(TEAM_DETAILS_QUERY);

    const [insertGame] = useMutation(GAME_SCHEDULE_INSERT);

    const [awayTeam, setAwayTeam] = useState<string>();
    const [homeTeam, setHomeTeam] = useState<string>();
    const [leagueYear, setLeagueYear] = useState<number>(currentLeagueTimes.currentLeagueYear);
    const [gameTime, setGameTime] = useState<string>(currentLeagueTimes.usualGameTime);
    const [gameWeek, setGameWeek] = useState<number>(currentLeagueTimes.currentLeagueWeek);
    const [gameDate, setGameDate] = useState<string>();
    const [openAwayTeamSelector, setOpenAwayTeamSelector] = useState<boolean>(false);
    const [openHomeTeamSelector, setOpenHomeTeamSelector] = useState<boolean>(false);
    const [openWeekSelector, setOpenWeekSelector] = useState<boolean>(false);
    const [openYearSelector, setOpenYearSelector] = useState<boolean>(false);

    const teamOptions = data?.team_details.map((team) => team.name);

    const handleGameInsert = () => {
        insertGame(
            {
                variables: {
                    team_1_name: awayTeam, 
                    team_2_name: homeTeam, 
                    league_year: leagueYear, 
                    time: gameTime + ':00', 
                    week: gameWeek , 
                    date: gameDate
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

    const handleCloseWeekSelector = () => {
        setOpenWeekSelector(false);
    };

    const handleOpenWeekSelector = () => {
        setOpenWeekSelector(true);
    };

    const handleCloseYearSelector = () => {
        setOpenYearSelector(false);
    };

    const handleOpenYearSelector = () => {
        setOpenYearSelector(true);
    };

    const classes = useStyles();

    return (
        <div>
            <DialogTitle>
                Create Game
            </DialogTitle>
            <DialogContent dividers>
                <DialogContent className={classes.inputRow}>
                    <DialogContent>
                        <FormControl className={classes.teamSelectors}>
                            <InputLabel htmlFor="away-team-id">Away Team</InputLabel>
                            <Select
                                value={awayTeam}
                                labelId="away-team-id"
                                onChange={(fieldValue) => setAwayTeam(fieldValue.target.value as string)}
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
                                onChange={(fieldValue) => setHomeTeam(fieldValue.target.value as string)}
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
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <div> 
                                <KeyboardDatePicker
                                    margin="normal"
                                    format="yyyy-MM-dd"
                                    value={gameDate}
                                    onChange={(date) => setGameDate(format(date as Date, "yyyy-MM-dd"))}
                                />
                            </div>
                        </MuiPickersUtilsProvider>
                    </DialogContent>

                    <DialogContent>
                        <Typography>
                            Time (CST)
                        </Typography>
                        <TextField
                            type="time"
                            onChange={(fieldValue) => setGameTime(fieldValue.target.value)}
                            inputProps={{
                                step: 300,
                            }}
                        />
                    </DialogContent>
                </DialogContent>
                
                <DialogContent className={classes.inputRow}>
                    <DialogContent>
                        <FormControl className={classes.teamSelectors}>
                            <InputLabel htmlFor="week-id">Week</InputLabel>
                            <Select
                                value={gameWeek}
                                labelId="week-id"
                                onChange={(fieldValue) => setGameWeek(fieldValue.target.value as number)}
                                onClose={handleCloseWeekSelector}
                                onOpen={handleOpenWeekSelector}
                            >
                                {
                                    timeSelections.leagueWeeks.map((week) => {
                                        return <MenuItem value={week}>{week}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </DialogContent>

                    <DialogContent>
                        <FormControl className={classes.teamSelectors}>
                            <InputLabel htmlFor="year-id">Year</InputLabel>
                            <Select
                                value={leagueYear}
                                labelId="year-id"
                                onChange={(fieldValue) => setLeagueYear(fieldValue.target.value as number)}
                                onClose={handleCloseYearSelector}
                                onOpen={handleOpenYearSelector}
                            >
                                {
                                    timeSelections.leagueYears.map((year) => {
                                        return <MenuItem value={year}>{year}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
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
