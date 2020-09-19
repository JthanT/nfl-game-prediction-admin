import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { format } from 'date-fns';
import { timeSelections, currentLeagueTimes } from '../utils/time';
import GameInsert from './GameInsert';
import ModifyGameDetails from './GameDetails';
import { GAME_SCHEDULE_BY_YEAR_QUERY } from '../graphql/queries/game.queries';

function GameList() {

    const { data, refetch } = useQuery(
        GAME_SCHEDULE_BY_YEAR_QUERY,
        {
            variables: {
                leagueYear: currentLeagueTimes.currentLeagueYear,
                leagueWeek: currentLeagueTimes.currentLeagueWeek,
            },
        }
    );

    const [openDetails, setOpenDetails] = useState(false);
    const [openGameInsert, setOpenGameInsert] = useState(false);
    const [id, setId] = useState<number>(0);
    const [leagueYear, setLeagueYear] = useState<number>(currentLeagueTimes.currentLeagueYear);
    const [leagueWeek, setLeagueWeek] = useState<number>(currentLeagueTimes.currentLeagueWeek);

    const handleOpenDetails = (gameId: number) => {
        setId(gameId);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
    };

    const handleOpenGameInsert = () => {
        setOpenGameInsert(true);
    };

    const handleCloseGameInsert = () => {
        setOpenGameInsert(false);
    };

    const handleLeagueYearSelect = (year: number) => {
        setLeagueYear(year);
        refetch({
            leagueYear: year,
            leagueWeek: 1
        });
    };

    const handleWeekSelect = (week: number) => {
        setLeagueWeek(week);
        refetch({
            leagueYear: leagueYear,
            leagueWeek: week,
        });
    };

    const classes = useStyles();

    return (
        <div>
            <Dialog 
                onClose={handleCloseDetails} 
                open={openDetails} 
                fullWidth={true} 
                maxWidth={'lg'}
            >
                <DialogActions>
                    <IconButton 
                        size="small" 
                        onClick={handleCloseDetails} 
                        className={classes.closeDialogButton}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <ModifyGameDetails 
                    gameId={id} 
                    refetchGameDetails={() => refetch({
                        leagueYear: leagueYear,
                        leagueWeek: leagueWeek,
                    })} 
                    closeDetailsMenu={handleCloseDetails} 
                />
            </Dialog>
            <Dialog 
                onClose={handleCloseGameInsert} 
                open={openGameInsert} 
                fullWidth={true} 
                maxWidth={'lg'}
            >
                <DialogActions>
                    <IconButton 
                        size="small" 
                        onClick={handleCloseGameInsert} 
                        className={classes.closeDialogButton}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <GameInsert 
                    refetchGames={() => refetch({
                        leagueYear: leagueYear,
                        leagueWeek: leagueWeek,
                    })}
                    closeMenu={handleCloseGameInsert}
                />
            </Dialog>
            <div className={classes.tableContent}>
                <MUIDataTable
                    data={data ? data.game_schedule : []}
                    columns={[
                        {
                            label: ' ',
                            name: 'game_id',
                            options: {
                                display: "excluded",
                            },
                        },
                        {
                            label: 'Away Team',
                            name: 'team_1_name',
                        },
                        {
                            label: 'Home Team',
                            name: 'team_2_name',
                        },
                        {
                            label: 'Predicted Winner',
                            name: 'predicted_winner',
                        },
                        {
                            label: 'Date',
                            name: 'date',
                            options: {
                                customBodyRender: (value, tableMeta) => {
                                    const timeStamp = value + 'T' + tableMeta.rowData[5];
                                    return format(new Date(timeStamp), 'MMM d');
                                }
                            }
                        },
                        {
                            label: 'Time (CST)',
                            name: 'time',
                            options: {
                                customBodyRender: (value, tableMeta) => {
                                    const timeStamp = tableMeta.rowData[4] + 'T' + value;
                                    return format(new Date(timeStamp), 'h:mm a');
                                }
                            }
                        },
                    ]}
                    title={(
                        <div className={classes.selectors}>
                            <div className={classes.addGameButton}>
                                <Button 
                                    className={classes.button} 
                                    variant="outlined" 
                                    onClick={handleOpenGameInsert}
                                >
                                    Add Game
                                </Button>
                            </div>
                            <FormControl className={classes.yearSelector}>
                                <InputLabel htmlFor="year-id">League Year</InputLabel>
                                <Select
                                    value={leagueYear}
                                    labelId="year-id"
                                    onChange={
                                        (fieldValue) => 
                                            handleLeagueYearSelect(fieldValue.target.value as number)
                                    }
                                >
                                    {(
                                        timeSelections.leagueYears.map((year) => {
                                            return <MenuItem value={year}>{year}</MenuItem>
                                        })
                                    )}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.weekSelector}>
                                <InputLabel htmlFor="week-id">Week</InputLabel>
                                <Select
                                    value={leagueWeek}
                                    labelId="week-id"
                                    onChange={
                                        (fieldValue) => 
                                            handleWeekSelect(fieldValue.target.value as number)
                                    }
                                >
                                    {(
                                        timeSelections.leagueWeeks.map((week) => {
                                            return <MenuItem value={week}>{week}</MenuItem>
                                        })
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    )}
                    options={{
                        print: false,
                        download: false,
                        viewColumns: false,
                        selectableRows: 'none',
                        filter: false,
                        rowsPerPage: 16,
                        rowsPerPageOptions: [],
                        onRowClick: (rowName) => handleOpenDetails(parseInt(rowName[0])),
                    }}
                />
            </div>
        </div>
    );
}

export default GameList;

const useStyles = makeStyles({
    tableContent: {
        padding: '10px',
    },
    closeDialogButton: {
        position: 'absolute',
        left: '95%',
        top: '2%',
        backgroundColor: 'lightgray',
        color: 'gray',
    },
    button: {
        textTransform: 'none',
    },
    selectors: {
        display: 'flex',
    },
    addGameButton: {
        paddingRight: '10px',
    },
    yearSelector: {
        display: 'flex',
        width: '25%',
        paddingRight: '10px',
    },
    weekSelector: {
        display: 'flex',
        width: '20%',
    },
});
