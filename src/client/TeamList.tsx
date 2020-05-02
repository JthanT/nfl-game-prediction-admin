import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.query';
import MUIDataTable from "mui-datatables";
import { useHistory } from 'react-router-dom';

function TeamList() {
    const { data } = useQuery(TEAM_DETAILS_QUERY);

    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <MUIDataTable
                data={data ? data.team_details : []}
                columns={[
                    {
                        label: ' ',
                        name: 'name',
                    },
                ]}
                title="Select a Team"
                options={{
                    print: false,
                    download: false,
                    viewColumns: false,
                    serverSide: true,
                    selectableRows: 'none',
                    sort: true,
                    filter: false,
                    onRowClick: (teamName) => history.push('/details', teamName),
                }}
            />
        </div>
    );
}

export default TeamList;

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