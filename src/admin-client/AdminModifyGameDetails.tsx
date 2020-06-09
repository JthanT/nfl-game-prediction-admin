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
import { GAME_SCHEDULE_BY_ID_QUERY } from '../graphql/queries/game.queries';
import { GAME_SCHEDULE_UPDATE_BY_ID } from '../graphql/mutations/game.mutations';
import { GAME_SCHEDULE_DELETE_BY_ID } from '../graphql/mutations/game.mutations';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.queries';

function AdminModifyGameDetails(
    props: {
        gameId: number, 
        refetchGameDetails?: () => void, 
        closeDetailsMenu?: () => void,
    }
) {

    const [awayTeam, setAwayTeam] = useState<string>();
    const [homeTeam, setHomeTeam] = useState<string>();
    const [leagueYear, setLeagueYear] = useState<number>();
    const [time, setTime] = useState<string>();
    const [week, setWeek] = useState<number>();
    const [date, setDate] = useState<string>();
    const [openAwayTeamSelector, setOpenAwayTeamSelector] = useState<boolean>(false);
    const [openHomeTeamSelector, setOpenHomeTeamSelector] = useState<boolean>(false);
    const [openDeletionConfirmation, setOpenDeletionConfirmation] = useState<boolean>(false);

    const [updateGameDetails] = useMutation(GAME_SCHEDULE_UPDATE_BY_ID);

    const [deleteGameDetails] = useMutation(GAME_SCHEDULE_DELETE_BY_ID);

    const teamData: { data } = useQuery(TEAM_DETAILS_QUERY);
    
    const gameData: { data } = useQuery(
        GAME_SCHEDULE_BY_ID_QUERY,
        {
            variables: {
                id: props.gameId
            },
        }
    );

    const teamOptions = teamData?.data?.team_details.map((team) => team.name);

    const handleGameUpdate = () => {
        updateGameDetails(
            {
                variables: {
                    id: gameData?.data?.game_schedule[0].game_id,
                    team_1_name: (!awayTeam || awayTeam === "") ?
                        gameData?.data?.game_schedule[0].team_1_name :
                        awayTeam, 
                    team_2_name: (!homeTeam || homeTeam === "") ?
                        gameData?.data?.game_schedule[0].team_2_name :
                        homeTeam, 
                    league_year: (!leagueYear || leagueYear == 0) ?
                        gameData?.data?.game_schedule[0].league_year :
                        leagueYear, 
                    time: (!time || time === "") ?
                        gameData?.data?.game_schedule[0].time :
                        time, 
                    week: (!week || week == 0) ?
                        gameData?.data?.game_schedule[0].week :
                        week, 
                    date: (!date || date === "") ?
                        gameData?.data?.game_schedule[0].date :
                        date, 
                }
            }
        )

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
                                value={awayTeam}
                                labelId="away-team-id"
                                onChange={(fieldValue) => setAwayTeam(fieldValue.target.value as string)}
                                onClose={handleCloseAwayTeamSelector}
                                onOpen={handleOpenAwayTeamSelector}
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
                                value={awayTeam}
                                labelId="home-team-id"
                                onChange={(fieldValue) => setHomeTeam(fieldValue.target.value as string)}
                                onClose={handleCloseHomeTeamSelector}
                                onOpen={handleOpenHomeTeamSelector}
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
                        <TextField
                            value={date ?? gameData?.data?.game_schedule[0].date}
                            onChange={(fieldValue) => setDate(fieldValue.target.value ? fieldValue.target.value : "")}
                        />
                    </DialogContent>
                        
                    <DialogContent>
                        <Typography>
                            Time
                        </Typography>
                        <TextField
                            value={time ?? gameData?.data?.game_schedule[0].time}
                            onChange={(fieldValue) => setTime(fieldValue.target.value ? fieldValue.target.value : "")}
                        />
                    </DialogContent>
                </DialogContent>
                
                <DialogContent className={classes.inputRow}>
                    <DialogContent>
                        <Typography>
                            Week
                        </Typography>
                        <TextField
                            value={week ?? gameData?.data?.game_schedule[0].week}
                            onChange={(fieldValue) => setWeek(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </DialogContent>

                    <DialogContent>
                        <Typography>
                            Year
                        </Typography>
                        <TextField
                            value={leagueYear ?? gameData?.data?.game_schedule[0].league_year}
                            onChange={(fieldValue) => setLeagueYear(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
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

export default AdminModifyGameDetails;

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
