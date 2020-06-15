import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import GameDetails from './GameDetails';
import { GAME_SCHEDULE_BY_YEAR_QUERY } from '../graphql/queries/game.queries';

function PastSeasonGameList() {

    const { data, refetch } = useQuery(
        GAME_SCHEDULE_BY_YEAR_QUERY,
        {
            variables: {
                leagueYear: 2020,
            },
        }
    );

    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number>(0);
    const [year, setYear] = useState<number>(2020);
    const [openYearSelector, setOpenYearSelector] = useState<boolean>(false);

    const leagueYear = ["2020", "2021"];

    const handleOpenGameDetails = (gameId: string) => {
        setId(parseInt(gameId));
        setOpen(true);
    };

    const handleCloseGameDetails = () => {
        setOpen(false);
    };

    const handleOpenYearSelector = () => {
        setOpenYearSelector(true);
    };

    const handleCloseYearSelector = () => {
        setOpenYearSelector(false);
    };

    const handleLeagueYearSelect = (year: number) => {
        setYear(year);
        refetch({
            leagueYear: year
        });
    };

    const classes = useStyles();

    return (
        <div>
            <Dialog onClose={handleCloseGameDetails} open={open} fullWidth={true} maxWidth={'md'}>
                <DialogActions>
                    <IconButton size="small" onClick={handleCloseGameDetails} className={classes.closeDialogButton}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <GameDetails gameId={id} />
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
                            label: 'Winner',
                            name: 'winning_team',
                        },
                        {
                            label: 'Predicted Winner',
                            name: 'predicted_winner',
                        },
                    ]}
                    title={(
                        <FormControl className={classes.yearSelector}>
                            <InputLabel htmlFor="year-id">League Year</InputLabel>
                            <Select
                                value={year}
                                labelId="year-id"
                                onChange={
                                    (fieldValue) => 
                                        handleLeagueYearSelect(fieldValue.target.value as number)
                                }
                                onClose={handleCloseYearSelector}
                                onOpen={handleOpenYearSelector}
                            >
                                {(
                                    leagueYear.map((year) => {
                                        return <MenuItem value={year}>{year}</MenuItem>
                                    })
                                )}
                            </Select>
                        </FormControl>
                    )}
                    options={{
                        print: false,
                        download: false,
                        viewColumns: false,
                        selectableRows: 'none',
                        filter: false,
                        rowsPerPage: 16,
                        rowsPerPageOptions: [],
                        onRowClick: (rowName) => handleOpenGameDetails(rowName[0]),
                    }}
                />
            </div>
        </div>
    );
}

export default PastSeasonGameList;

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
    yearSelector: {
        display: 'flex',
        width: '25%',
    },

});
