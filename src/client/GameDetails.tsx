import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { GAME_SCHEDULE_BY_ID_QUERY } from '../graphql/queries/game.queries';

function GameDetails(props: {gameId: number}) {
    
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
            <DialogTitle>
                {data?.game_schedule[0].team_1_name} @ {data?.game_schedule[0].team_2_name}
            </DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Predicted Winner
                </Typography>
                <Typography>
                    {data?.game_schedule[0].predicted_winner}
                </Typography>
            </DialogContent>

            <DialogContent dividers>
                <Typography>
                    {data?.game_schedule[0].team_1_name} Grade
                </Typography>
                <Typography>
                    {data?.game_schedule[0].team_1_grade}
                </Typography>
            </DialogContent>
            
            <DialogContent dividers>
                <Typography>
                    {data?.game_schedule[0].team_2_name} Grade
                </Typography>
                <Typography>
                    {data?.game_schedule[0].team_2_grade}
                </Typography>
            </DialogContent>
        </div>
    );
}

export default GameDetails;
