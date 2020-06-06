import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import AdminGameInsert from '../admin-client/AdminGameInsert';
import AdminModifyGameDetails from '../admin-client/AdminModifyGameDetails';
import { GAME_SCHEDULE_QUERY } from '../graphql/queries/game.query';

function AdminGameList() {

    const [openDetails, setOpenDetails] = useState(false);
    const [openGameInsert, setOpenGameInsert] = useState(false);
    const [id, setId] = useState<number>(0);
    
    const { data, refetch } = useQuery(GAME_SCHEDULE_QUERY);

    const handleOpenDetails = (gameId: number) => {
        setId(gameId);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
    };

    const handleOpenGameInsert = () => {
        setOpenGameInsert(true);
    };

    const handleCloseGameInsert = () => {
        setOpenGameInsert(false);
    };

    const classes = useStyles();

    return (
        <div>
            <Dialog onClose={handleCloseDetails} open={openDetails}>
                <AdminModifyGameDetails gameId={id} refetchGameDetails={refetch} />
            </Dialog>
            <Dialog onClose={handleCloseGameInsert} open={openGameInsert}>
                <AdminGameInsert refetchGames={refetch} />
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
                        label: 'Time',
                        name: 'time',
                    },
                ]}
                title={<Button variant="outlined" onClick={handleOpenGameInsert}>Add Game</Button>}
                options={{
                    print: false,
                    download: false,
                    viewColumns: false,
                    selectableRows: 'none',
                    filter: false,
                    rowsPerPage: 16,
                    rowsPerPageOptions: [],
                    onRowClick: (rowName) => handleOpenDetails(parseInt(rowName[0])),
                }}
            />
        </div>
    );
}

export default AdminGameList;

const useStyles = makeStyles({
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
