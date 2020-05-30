import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import { GAME_SCHEDULE_QUERY } from '../graphql/queries/game.query';

function GameList() {
    const { data } = useQuery(GAME_SCHEDULE_QUERY);

    const classes = useStyles();

    console.log(data ? data : 'hi');

    return (
        <div className={classes.root}>
            <MUIDataTable
                data={data ? data.game_schedule : []}
                columns={[
                    {
                        label: ' ',
                        name: 'team_1_name',
                    },
                    {
                        label: ' ',
                        name: 'team_2_name',
                    },
                    {
                        label: 'Date',
                        name: 'date',
                    },
                    {
                        label: 'Time',
                        name: 'time',
                    },
                ]}
                title="Schedule"
                options={{
                    print: false,
                    download: false,
                    viewColumns: false,
                    serverSide: true,
                    selectableRows: 'none',
                    filter: false,
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