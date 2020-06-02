import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Dialog from '@material-ui/core/Dialog';
import AdminTeamDetails from '../admin-client/AdminTeamDetails';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.query';

function AdminTeamList() {
    const { data } = useQuery(TEAM_DETAILS_QUERY);

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    const handleOpen = (teamName: string) => {
        setName(teamName);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth = {'md'}>
                <AdminTeamDetails teamName={name} />
            </Dialog>
            <MUIDataTable
                data={data ? data.team_details : []}
                columns={[
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
                ]}
                title="Select a Team"
                options={{
                    print: false,
                    download: false,
                    viewColumns: false,
                    serverSide: true,
                    selectableRows: 'none',
                    filter: false,
                    onRowClick: (rowName) => handleOpen(rowName[0]),
                }}
            />
        </div>
    );
}

export default AdminTeamList;

const useStyles = makeStyles({
    root: {
        backgroundColor: 'black',
        height: '100vh'
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