import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { 
    makeStyles, 
    Button, 
    Select, 
    MenuItem, 
    FormControl, 
    Typography 
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import { format } from 'date-fns';
import { timeSelections, currentLeagueTimes } from '../utils/time';
import GameInsert from './GameInsert';
import ModifyGameDetails from './ModifyGameDetails';
import { GAME_SCHEDULE_BY_YEAR_QUERY } from '../graphql/queries/game.queries';
import DialogBox from '../components/DialogBox';

const useStyles = makeStyles({
    tableContent: {
        padding: '10px',
    },
    button: {
        textTransform: 'none',
    },
    selectors: {
        display: 'flex',
        alignItems: 'center'
    },
    addGameButton: {
        paddingRight: '10px',
    },
    timeSelector: {
        display: 'flex',
        width: '100px',
        paddingRight: '20px',
    },
});

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

    const classes = useStyles();

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

    return (
        <div>
            <DialogBox
                handleClose={handleCloseDetails} 
                open={openDetails} 
                components={
                    <ModifyGameDetails 
                        gameId={id} 
                        refetchGameDetails={() => refetch({
                            leagueYear: leagueYear,
                            leagueWeek: leagueWeek,
                        })} 
                        closeDetailsMenu={handleCloseDetails} 
                    />
                }
            />
            <DialogBox 
                handleClose={handleCloseGameInsert} 
                open={openGameInsert} 
                components={
                    <GameInsert 
                        refetchGames={() => refetch({
                            leagueYear: leagueYear,
                            leagueWeek: leagueWeek,
                        })}
                        closeMenu={handleCloseGameInsert}
                        week={leagueWeek}
                    />
                }
            />
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
                            label: 'Winner',
                            name: 'winning_team',
                        },
                        {
                            label: 'Date',
                            name: 'date',
                            options: {
                                customBodyRender: (value, tableMeta) => {
                                    const timeStamp = value + 'T' + tableMeta.rowData[6];
                                    return format(new Date(timeStamp), 'MMM d');
                                }
                            }
                        },
                        {
                            label: 'Time (CST)',
                            name: 'time',
                            options: {
                                customBodyRender: (value, tableMeta) => {
                                    const timeStamp = tableMeta.rowData[5] + 'T' + value;
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
                            <FormControl className={classes.timeSelector}>
                                <Typography>League Year</Typography>
                                <Select
                                    value={leagueYear}
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
                            <FormControl className={classes.timeSelector}>
                                <Typography>Week</Typography>
                                <Select
                                    value={leagueWeek}
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
