import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { TEAM_DETAILS_QUERY } from '../graphql/queries/team.query'
import MUIDataTable from "mui-datatables";

function TeamList() {
    const { data } = useQuery(TEAM_DETAILS_QUERY);

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <MUIDataTable
                data={data?.team_details}
                columns={[
                    {
                        label: 'Teams',
                        name: 'name',
                    },
                ]}
                title=""
                options={{
                    print: false,
                    download: false,
                    viewColumns: false,
                    serverSide: true,
                    selectableRows: 'none',
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