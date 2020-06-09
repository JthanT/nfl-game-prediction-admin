import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { GAME_SCHEDULE_BY_ID_QUERY } from '../graphql/queries/game.query';
import { GAME_SCHEDULE_UPDATE_BY_ID } from '../graphql/queries/game.query';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.query';

function AdminModifyGameDetails(props: {gameId: number, refetchGameDetails?: () => void}) {

    const [awayTeam, setAwayTeam] = useState<string>();
    const [homeTeam, setHomeTeam] = useState<string>();
    const [leagueYear, setLeagueYear] = useState<number>();
    const [time, setTime] = useState<string>();
    const [week, setWeek] = useState<number>();
    const [date, setDate] = useState<string>();
    const [openAwayTeamSelector, setOpenAwayTeamSelector] = useState<boolean>(false);
    const [openHomeTeamSelector, setOpenHomeTeamSelector] = useState<boolean>(false);

    const [updateGameDetails] = useMutation(GAME_SCHEDULE_UPDATE_BY_ID);

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
                                onChange={(fieldValue) => setAwayTeam(fieldValue.target.name)}
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
                                onChange={(fieldValue) => setHomeTeam(fieldValue.target.name)}
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
                    <Button onClick={handleGameUpdate}>
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
    addButton: {
        textTransform: 'none',
    },
    buttonRow: {
        display: 'flex', 
        justifyContent: 'flex-end',
    },
});
