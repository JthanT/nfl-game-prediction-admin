import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';
import TeamDetails from './TeamDetails';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.queries';
import DialogBox from '../components/DialogBox';
import PageLoading from '../components/PageLoading';
import DataTable from '../components/DataTable';

const useStyles = makeStyles({
    tableContent: {
        padding: '10px',
    },
});

function TeamList() {

    const { data, refetch, loading } = useQuery(TEAM_DETAILS_QUERY);

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
            <DialogBox 
                handleClose={handleClose} 
                open={open} 
                components={
                    <TeamDetails teamId={id} refetchTeamDetails={refetch} />
                }
            />
            <div className={classes.tableContent}>
                {!loading ? (
                    <DataTable
                        data={data?.team_details ?? []}
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
                        options={{
                            onRowClick: (rowData) => handleOpen(parseInt(rowData[0])),
                        }}
                    />
                ) : (
                    <PageLoading />
                )}
            </div>
        </div>
    );
}

export default TeamList;
