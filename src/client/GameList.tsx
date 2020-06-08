import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import GameDetails from './GameDetails';
import { GAME_SCHEDULE_QUERY } from '../graphql/queries/game.query';


function GameList() {
    const { data } = useQuery(GAME_SCHEDULE_QUERY);

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number>(0);

    const handleOpen = (gameId: string) => {
        setId(parseInt(gameId));
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth={'md'}>
                <DialogActions>
                    <IconButton size="small" onClick={handleClose} className={classes.closeDialogButton}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <GameDetails gameId={id} />
            </Dialog>
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
                    },
                    {
                        label: 'Time (CST)',
                        name: 'time',
                    },
                ]}
                title=""
                options={{
                    print: false,
                    download: false,
                    viewColumns: false,
                    selectableRows: 'none',
                    filter: false,
                    rowsPerPage: 16,
                    rowsPerPageOptions: [],
                    onRowClick: (rowName) => handleOpen(rowName[0]),
                }}
            />
        </div>
    );
}

export default GameList;

const useStyles = makeStyles({
    root: {
        backgroundColor: 'black',
        height: '100vh'
    },
    closeDialogButton: {
        position: 'absolute',
        left: '95%',
        top: '2%',
        backgroundColor: 'lightgray',
        color: 'gray',
    },
    center: {
        backgroundColor: 'white',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    cell: {
        width: '100%',
    }
});
