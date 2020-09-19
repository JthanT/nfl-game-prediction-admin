import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { 
    makeStyles, 
    DialogTitle, 
    DialogContent, 
    Typography, 
    Button, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl 
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { timeSelections, currentLeagueTimes } from '../utils/time';
import { GAME_SCHEDULE_INSERT } from '../graphql/mutations/game.mutations';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.queries';

const useStyles = makeStyles({
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectors: {
        display: 'inline',
    },
    selectionBlocks: {
        padding: '25px',
    },
    teamSelectors: {
        width: '220px'
    },
    buttons: {
        textTransform: 'none',
        marginLeft: '8px',
    },
    buttonRow: {
        display: 'flex', 
        justifyContent: 'flex-end',
    },
    content: {
        display: 'flex', 
        flexDirection: 'column',
    },
    datePicker: {
        width: '150px'
    }
});

function GameInsert(props: {refetchGames?: () => void, closeMenu?: () => void}) {

    const classes = useStyles();

    const { data } = useQuery(TEAM_DETAILS_QUERY);

    const [insertGame] = useMutation(GAME_SCHEDULE_INSERT);

    const [awayTeam, setAwayTeam] = useState<string>();
    const [homeTeam, setHomeTeam] = useState<string>();
    const [leagueYear, setLeagueYear] = useState<number>(currentLeagueTimes.currentLeagueYear);
    const [gameTime, setGameTime] = useState<string>(currentLeagueTimes.usualGameTime);
    const [gameWeek, setGameWeek] = useState<number>(currentLeagueTimes.currentLeagueWeek);
    const [gameDate, setGameDate] = useState<Date>(new Date());

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

        if (props.closeMenu) {
            props.closeMenu()
        };
    };

    return (
        <div>
            <DialogTitle>
                Create Game
            </DialogTitle>
            <DialogContent dividers>
                <div className={classes.content}>
                    <div className={classes.inputRow}>
                        <div className={classes.selectionBlocks}>
                            <FormControl className={classes.teamSelectors}>
                                <Typography>Away Team</Typography>
                                <Select
                                    value={awayTeam}
                                    onChange={(fieldValue) => setAwayTeam(fieldValue.target.value as string)}
                                >
                                    {data && (
                                        teamOptions.map((name) => {
                                            return <MenuItem value={name}>{name}</MenuItem>
                                        })
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={classes.selectionBlocks}>
                            <FormControl className={classes.teamSelectors}>
                                <Typography>Home Team</Typography>
                                <Select
                                    value={homeTeam}
                                    onChange={(fieldValue) => setHomeTeam(fieldValue.target.value as string)}
                                >
                                    {data && (
                                        teamOptions.map((name) => {
                                            return <MenuItem value={name}>{name}</MenuItem>
                                        })
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className={classes.inputRow}>
                        <div className={classes.selectionBlocks}>
                            <Typography>
                                Date
                            </Typography>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <div> 
                                    <KeyboardDatePicker
                                        disableToolbar
                                        margin="none"
                                        format="yyyy-MM-dd"
                                        value={gameDate}
                                        onChange={(date) => setGameDate(date as Date)}
                                    />
                                </div>
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className={classes.selectionBlocks}>
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
                        </div>
                        <div className={classes.selectionBlocks}>
                            <div className={classes.selectors}>
                                <Typography>Week</Typography>
                                <Select
                                    value={gameWeek}
                                    onChange={(fieldValue) => setGameWeek(fieldValue.target.value as number)}
                                >
                                    {
                                        timeSelections.leagueWeeks.map((week) => {
                                            return <MenuItem value={week}>{week}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className={classes.selectionBlocks}>
                            <div className={classes.selectors}>
                                <Typography>Year</Typography>
                                <Select
                                    value={leagueYear}
                                    onChange={(fieldValue) => setLeagueYear(fieldValue.target.value as number)}
                                >
                                    {
                                        timeSelections.leagueYears.map((year) => {
                                            return <MenuItem value={year}>{year}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className={classes.buttonRow}>
                        <Button variant="outlined" onClick={handleGameInsert} className={classes.buttons}>
                            Add Game
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </div>
    );
}

export default GameInsert;
