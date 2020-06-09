import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TeamDetails from './TeamDetails';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.queries';

function TeamList() {

    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number>(0);
    
    const { data } = useQuery(TEAM_DETAILS_QUERY);

    const handleOpen = (id: number) => {
        setId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const classes = useStyles();

    return (
        <div>
            <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth={'md'}>
                <DialogActions>
                    <IconButton size="small" onClick={handleClose} className={classes.closeDialogButton}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <TeamDetails teamId={id} />
            </Dialog>
            <MUIDataTable
                data={data ? data.team_details : []}
                columns={[
                    {
                        label: ' ',
                        name: 'team_id',
                        options: {
                            display: "excluded",
                        },
                    },
                    {
                        label: 'Team',
                        name: 'name',
                    },
                    {
                        label: 'Offence Rank',
                        name: 'offence_ranking',
                    },
                    {
                        label: 'Defence Rank',
                        name: 'defence_ranking',
                    },
                    {
                        label: 'Special Teams Rank',
                        name: 'special_teams_ranking',
                    },
                    {
                        label: 'Team Grade',
                        name: 'grade',
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
                    onRowClick: (rowName) => handleOpen(parseInt(rowName[0])),
                }}
            />
        </div>
    );
}

export default TeamList;

const useStyles = makeStyles({
    table: {
        backgroundColor: 'black',
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