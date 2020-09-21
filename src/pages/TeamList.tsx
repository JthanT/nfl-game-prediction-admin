import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import MUIDataTable from "mui-datatables";
import { IconButton, DialogActions, Dialog, makeStyles } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import TeamDetails from './TeamDetails';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.queries';

const useStyles = makeStyles({
    tableContent: {
        padding: '10px',
    },
    closeDialogButton: {
        position: 'absolute',
        left: '94%',
        top: '2%',
        backgroundColor: 'lightgray',
        color: 'gray',
    },
    teamSelectors: {
        display: 'flex',
    },
});

function TeamList() {

    const { data, refetch } = useQuery(TEAM_DETAILS_QUERY);

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number>(0);

    const handleOpen = (id: number) => {
        setId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth = {'sm'}>
                <DialogActions>
                    <IconButton size="small" onClick={handleClose} className={classes.closeDialogButton}>
                        <Close />
                    </IconButton>
                </DialogActions>
                <TeamDetails teamId={id} refetchTeamDetails={refetch} />
            </Dialog>
            <div className={classes.tableContent}>
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
                            label: 'Injury Severity',
                            name: 'injury_severity'
                        },
                        {
                            label: 'Team Grade',
                            name: 'grade',
                        },
                        {
                            label: 'Bye Week',
                            name: 'bye_week',
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
                        onRowClick: (rowData) => handleOpen(parseInt(rowData[0])),
                    }}
                />
            </div>
        </div>
    );
}

export default TeamList;
