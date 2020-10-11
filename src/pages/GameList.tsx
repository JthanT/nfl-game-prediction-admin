import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { 
    makeStyles, 
    Button, 
    Select, 
    MenuItem, 
    FormControl, 
    Typography, 
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import { format } from 'date-fns';
import { timeSelections, currentLeagueTimes } from '../utils/time';
import GameInsert from './GameInsert';
import ModifyGameDetails from './ModifyGameDetails';
import { GAME_SCHEDULE_BY_YEAR_QUERY } from '../graphql/queries/game.queries';
import DialogBox from '../components/DialogBox';
import PageLoading from '../components/PageLoading';
import RightPredictionIcon from '../components/icons/RightPredictionIcon';
import WrongPredictionIcon from '../components/icons/WrongPredictionIcon';

const useStyles = makeStyles({
    rightRoot: {
        backgroundColor: '#ECFFE9'
    },
    wrongRoot: {
        backgroundColor: '#FFEDE9'
    },
    undeterminedRoot: {
        backgroundColor: 'white'
    },
    tableContent: {
        padding: '10px',
    },
    button: {
        textTransform: 'none',
    },
    selectors: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: '10px'
    },
    addGameButton: {
        paddingRight: '20px',
    },
    timeSelector: {
        display: 'flex',
        width: '100px',
        paddingRight: '30px',
    },
    winnerRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
});

function GameList() {
    const { data, refetch, loading } = useQuery(
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

    const predictionCorrectness = (predicted?: string, winner?: string) => {
        if (predicted && winner) { 
            if (predicted === winner) {
                return 'right';
            } else {
                return 'wrong';
            }
        } else {
            return 'undetermined';
        }
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
                {!loading ? (
                    <MUIDataTable
                        data={data?.game_schedule ?? []}
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
                                options: {
                                    customBodyRender: (value, tableMeta) => {
                                        const accuracy = predictionCorrectness(tableMeta.rowData[3], tableMeta.rowData[4]);
                                        return (
                                            <div className={classes.winnerRow}>
                                                <Typography>
                                                    {value}
                                                </Typography>
                                                {accuracy === 'right' && <RightPredictionIcon />}
                                                {accuracy === 'wrong' && <WrongPredictionIcon />}
                                            </div>
                                        );
                                    }
                                }
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
                                                return <MenuItem key={year} value={year}>{year}</MenuItem>
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
                                                return <MenuItem key={week} value={week}>{week}</MenuItem>
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
                ) : (
                    <PageLoading />
                )}
            </div>
        </div>
    );
}

export default GameList;
