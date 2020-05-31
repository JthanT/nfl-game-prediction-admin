import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { GAME_SCHEDULE_BY_ID_QUERY } from '../graphql/queries/game.query';

function AdminGameDetails(props: {gameId: number}) {
    const { data } = useQuery(
        GAME_SCHEDULE_BY_ID_QUERY,
        {
            variables: {
                id: props.gameId
            },
        }
    );

    return (
        <div>
            <DialogContent dividers>
                <DialogContentText>
                    Predicted Winner
                </DialogContentText>
                <DialogContentText>
                    {data?.game_schedule[0].predicted_winner}
                </DialogContentText>
            </DialogContent>
        </div>
    );
}

export default AdminGameDetails;
