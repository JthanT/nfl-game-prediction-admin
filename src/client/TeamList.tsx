import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.query'
import MaterialTable from 'material-table';

function TeamList() {
    const { loading, error, data } = useQuery(TEAM_DETAILS_QUERY);

    const classes = useStyles();

    return (
        <MaterialTable 
            data={data}
            columns={[
                name
            ]}
        />
    );
}

export default TeamList;

const useStyles = makeStyles({
    root: {
        backgroundColor: '#BED6AC',
        height: '100vh'
    },
    center: {
        backgroundColor: 'white',
        position: 'absolute', 
        left: '50%', 
        top: '50%',
        transform: 'translate(-50%, -50%)'
    }
});