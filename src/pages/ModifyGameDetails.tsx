import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { 
    Button, 
    Typography, 
    Select, 
    DialogContent, 
    DialogTitle, 
    Dialog, 
    makeStyles, 
    MenuItem, 
    TextField
} from '@material-ui/core';
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
    content: {
        display: 'flex', 
        flexDirection: 'column',
    },
    datePicker: {
        width: '150px'
    }
});

function ModifyGameDetails(
    props: {
        gameId: number, 
        refetchGameDetails?: () => void, 
        closeDetailsMenu?: () => void,
    }
) {

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

    const winnerOptions = teamData?.data ? (
            ['Tie'].concat(
                teamOptions
                    .filter((name) => (
                        name === gameData?.data?.game_schedule[0].team_1_name ||
                        name === gameData?.data?.game_schedule[0].team_2_name)
                    )
            )
        ) : (
            []
        );
   
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
                <div className={classes.content}>
                    <div className={classes.inputRow}>
                        <div className={classes.selectionBlocks}>
                            <div className={classes.selectors}>
                                <Typography>Away Team</Typography>
                                <Select
                                    className={classes.teamSelectors}
                                    value={awayTeam ?? gameData?.data?.game_schedule[0].team_1_name ?? ''}
                                    onChange={(fieldValue) => setAwayTeam(fieldValue.target.value as string)}
                                >
                                    {teamData?.data && (
                                        teamOptions.map((name) => {
                                            return <MenuItem key={name} value={name}>{name}</MenuItem>
                                        })
                                    )}
                                </Select>
                            </div>
                        </div>
                        <div className={classes.selectionBlocks}>
                            <div className={classes.selectors}>
                                <Typography>Home Team</Typography>
                                <Select
                                    className={classes.teamSelectors}
                                    value={homeTeam ?? gameData?.data?.game_schedule[0].team_2_name ?? ''}
                                    onChange={(fieldValue) => setHomeTeam(fieldValue.target.value as string)}
                                >
                                    {teamData?.data && (
                                        teamOptions.map((name) => {
                                            return <MenuItem key={name} value={name}>{name}</MenuItem>
                                        })
                                    )}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className={classes.inputRow}>
                        <div className={classes.selectionBlocks}>
                            <Typography>
                                Date
                            </Typography>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    className={classes.datePicker}
                                    disableToolbar
                                    margin="none"
                                    format="yyyy-MM-dd"
                                    value={gameDate ?? new Date(gameData?.data?.game_schedule[0].date + 'CST')}
                                    onChange={(date) => setGameDate(date as Date)}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className={classes.selectionBlocks}>
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
                        </div>
                        <div className={classes.selectionBlocks}>
                            <div className={classes.selectors}>
                                <Typography>Week</Typography>
                                <Select
                                    value={gameWeek ?? gameData?.data?.game_schedule[0].week ?? ''}
                                    onChange={(fieldValue) => setGameWeek(fieldValue.target.value as number)}
                                >
                                    {
                                        timeSelections.leagueWeeks.map((week) => {
                                            return <MenuItem key={week} value={week}>{week}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className={classes.selectionBlocks}>
                            <div className={classes.selectors}>
                                <Typography>Year</Typography>
                                <Select
                                    value={leagueYear ?? gameData?.data?.game_schedule[0].league_year ?? ''}
                                    onChange={(fieldValue) => setLeagueYear(fieldValue.target.value as number)}
                                >
                                    {
                                        timeSelections.leagueYears.map((year) => {
                                            return <MenuItem key={year} value={year}>{year}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={classes.selectionBlocks}>
                            <div className={classes.selectors}>
                                <Typography>Winning Team</Typography>
                                <Select
                                    className={classes.teamSelectors}
                                    value={winningTeam ?? gameData?.data?.game_schedule[0].winning_team ?? ''}
                                    onChange={(fieldValue) => setWinningTeam(fieldValue.target.value as string)}
                                >
                                    {winnerOptions
                                        .map((name) => {
                                            return <MenuItem key={name} value={name}>{name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.buttonRow}>
                    <Button variant="outlined" onClick={handleOpenGameDelete} className={classes.dataButtons}>
                        Delete
                    </Button>
                    <Button variant="outlined" onClick={handleGameUpdate} className={classes.dataButtons}>
                        Update
                    </Button>
                </div>
            </DialogContent>
        </div>
    );
}

export default ModifyGameDetails;
