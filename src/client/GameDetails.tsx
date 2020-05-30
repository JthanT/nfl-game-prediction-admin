import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { GAME_SCHEDULE_BY_ID_QUERY } from '../graphql/queries/game.query';

function GameDetails(props: {gameId: number}) {
    const { data } = useQuery(
        GAME_SCHEDULE_BY_ID_QUERY,
        {
            variables: {
                game_id: props.gameId
            },
        }
    );

    return (
        <div>
            <DialogTitle>
                {data?.game_schedule[0].name}
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Offence Rank
                </DialogContentText>
                <DialogContentText>
                    {data?.game_schedule[0].team_1_grade}
                </DialogContentText>
            </DialogContent>
            <DialogContent dividers>
                <DialogContentText>
                    Defence Rank
                </DialogContentText>
                <DialogContentText>
                    {data?.game_schedule[0].team_2_grade}
                </DialogContentText>
            </DialogContent>
        </div>
    );
}

export default GameDetails;
