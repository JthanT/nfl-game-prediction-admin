import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { timeSelections } from '../utils/time';
import { GAME_SCHEDULE_BY_ID_QUERY } from '../graphql/queries/game.queries';
import { GAME_SCHEDULE_UPDATE_BY_ID, GAME_SCHEDULE_UPDATE_WINNER_BY_ID } from '../graphql/mutations/game.mutations';
import { GAME_SCHEDULE_DELETE_BY_ID } from '../graphql/mutations/game.mutations';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.queries';

const ModifyGameDetails = (
    props: {
        gameId: number, 
        refetchGameDetails?: () => void, 
        closeDetailsMenu?: () => void,
    }
) => {

    const teamData: { data } = useQuery(TEAM_DETAILS_QUERY);
    
    const gameData: { data } = useQuery(
        GAME_SCHEDULE_BY_ID_QUERY,
        {
            variables: {
                id: props.gameId
            },
        }
    );

    const [updateGameDetails] = useMutation(GAME_SCHEDULE_UPDATE_BY_ID);
    const [updateGameWinner] = useMutation(GAME_SCHEDULE_UPDATE_WINNER_BY_ID);
    const [deleteGameDetails] = useMutation(GAME_SCHEDULE_DELETE_BY_ID);

    const [awayTeam, setAwayTeam] = useState<string>();
    const [homeTeam, setHomeTeam] = useState<string>();
    const [winningTeam, setWinningTeam] = useState<string>();
    const [leagueYear, setLeagueYear] = useState<number>();
    const [gameTime, setGameTime] = useState<string>();
    const [gameWeek, setGameWeek] = useState<number>();
    const [gameDate, setGameDate] = useState<Date>();
    const [openDeletionConfirmation, setOpenDeletionConfirmation] = useState<boolean>(false);

    const teamOptions = teamData?.data?.team_details.map((team) => team.name);
   
    const handleGameUpdate = () => {
        updateGameDetails({
            variables: {
                id: gameData?.data?.game_schedule[0].game_id,
                team_1_name: (!awayTeam || awayTeam === "") ?
                    gameData?.data?.game_schedule[0].team_1_name :
                    awayTeam, 
                team_2_name: (!homeTeam || homeTeam === "") ?
                    gameData?.data?.game_schedule[0].team_2_name :
                    homeTeam, 
                league_year: (!leagueYear || leagueYear === 0) ?
                    gameData?.data?.game_schedule[0].league_year :
                    leagueYear, 
                time: (!gameTime || gameTime === "") ?
                    gameData?.data?.game_schedule[0].time :
                    gameTime + ':00', 
                week: (!gameWeek || gameWeek === 0) ?
                    gameData?.data?.game_schedule[0].week :
                    gameWeek, 
                date: !gameDate ? 
                    new Date(gameData?.data?.game_schedule[0].date + 'CST') : 
                    gameDate, 
            }
        });
        
        if (winningTeam) {
            updateGameWinner({
                variables: {
                    id: props.gameId,
                    team_name: winningTeam
                }
            })
        };
        
        if (props.refetchGameDetails) {
            props.refetchGameDetails()
        };
    };

    const handleGameDelete = () => {
        deleteGameDetails(
            {
                variables: {
                    id: gameData?.data?.game_schedule[0].game_id,
                }
            }
        )

        if (props.refetchGameDetails) {
            props.refetchGameDetails()
        };

        if (props.closeDetailsMenu) {
            props.closeDetailsMenu()
        };
    }; 

    const handleOpenGameDelete = () => {
        setOpenDeletionConfirmation(true);
    };

    const handleCloseGameDelete = () => {
        setOpenDeletionConfirmation(false);
    };

    const classes = useStyles();

    return (
        <div>
            <Dialog onClose={handleCloseGameDelete} open={openDeletionConfirmation} fullWidth={true} maxWidth={'sm'}>
                <DialogTitle>
                    Deletion Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContent className={classes.confirmationText}>
                        Delete the selected game?
                    </DialogContent>
                    <DialogContent className={classes.buttonRow}>
                        <Button variant="outlined" onClick={handleCloseGameDelete} className={classes.dataButtons}>
                            Cancel
                        </Button>
                        <Button variant="outlined" onClick={handleGameDelete} className={classes.dataButtons}>
                            Delete
                        </Button>
                    </DialogContent>
                </DialogContent>
                
            </Dialog>
            <DialogTitle>
                {gameData?.data?.game_schedule[0].team_1_name} @ {gameData?.data?.game_schedule[0].team_2_name}
            </DialogTitle>
            <DialogContent dividers>
                <DialogContent className={classes.inputRow}>
                    <DialogContent>
                        <FormControl className={classes.teamSelectors}>
                            <InputLabel htmlFor="away-team-id">Away Team</InputLabel>
                            <Select
                                value={awayTeam ?? gameData?.data?.game_schedule[0].team_1_name ?? ''}
                                labelId="away-team-id"
                                onChange={(fieldValue) => setAwayTeam(fieldValue.target.value as string)}
                            >
                                {teamData?.data && (
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
                                value={homeTeam ?? gameData?.data?.game_schedule[0].team_2_name ?? ''}
                                labelId="home-team-id"
                                onChange={(fieldValue) => setHomeTeam(fieldValue.target.value as string)}
                            >
                                {teamData?.data && (
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
                                    disableToolbar
                                    margin="normal"
                                    format="yyyy-MM-dd"
                                    value={gameDate ?? new Date(gameData?.data?.game_schedule[0].date + 'CST')}
                                    onChange={(date) => setGameDate(date as Date)}
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
                            value={gameTime ?? gameData?.data?.game_schedule[0].time ?? ''}
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
                                value={gameWeek ?? gameData?.data?.game_schedule[0].week ?? ''}
                                labelId="week-id"
                                onChange={(fieldValue) => setGameWeek(fieldValue.target.value as number)}
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
                                value={leagueYear ?? gameData?.data?.game_schedule[0].league_year ?? ''}
                                labelId="year-id"
                                onChange={(fieldValue) => setLeagueYear(fieldValue.target.value as number)}
                            >
                                {
                                    timeSelections.leagueYears.map((year) => {
                                        return <MenuItem value={year}>{year}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </DialogContent>

                    <DialogContent>
                        <FormControl className={classes.teamSelectors}>
                            <InputLabel htmlFor="winner-team-id">Winning Team</InputLabel>
                            <Select
                                value={winningTeam ?? gameData?.data?.game_schedule[0].winning_team ?? ''}
                                labelId="winner-team-id"
                                onChange={(fieldValue) => setWinningTeam(fieldValue.target.value as string)}
                            >
                                {teamData?.data && (
                                    teamOptions
                                        .filter((name) => (
                                            name === gameData?.data?.game_schedule[0].team_1_name ||
                                            name === gameData?.data?.game_schedule[0].team_2_name )
                                        )
                                        .map((name) => {
                                            return <MenuItem value={name}>{name}</MenuItem>
                                        })
                                )}
                            </Select>
                        </FormControl>
                    </DialogContent>
                </DialogContent>

                <DialogContent className={classes.buttonRow}>
                    <Button variant="outlined" onClick={handleOpenGameDelete} className={classes.dataButtons}>
                        Delete
                    </Button>
                    <Button variant="outlined" onClick={handleGameUpdate} className={classes.dataButtons}>
                        Update
                    </Button>
                </DialogContent>
            </DialogContent>
        </div>
    );
}

export default ModifyGameDetails;

const useStyles = makeStyles({
    inputRow: {
        display: 'flex',
    },
    teamSelectors: {
        display: 'flex',
    },
    dataButtons: {
        textTransform: 'none',
        marginLeft: '8px',
    },
    buttonRow: {
        display: 'flex', 
        justifyContent: 'flex-end',
    },
    confirmationText: {
        display: 'flex', 
        justifyContent: 'flex-start',
    },
});
