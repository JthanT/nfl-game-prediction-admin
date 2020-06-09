import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import { TEAM_DETAILS_BY_ID_QUERY } from '../graphql/queries/team.queries';

function TeamDetails(props: {teamId: number}) {
    const { data } = useQuery(
        TEAM_DETAILS_BY_ID_QUERY,
        {
            variables: {
                id: props.teamId
            },
        }
    );

    return (
        <div>
            <DialogTitle>
                {data?.team_details[0].name}
            </DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Offence Rank
                </Typography>
                <Typography>
                    {data?.team_details[0].offence_ranking}
                </Typography>
            </DialogContent>
            <DialogContent dividers>
                <Typography>
                    Defence Rank
                </Typography>
                <Typography>
                    {data?.team_details[0].defence_ranking}
                </Typography>
            </DialogContent>
            <DialogContent dividers>
                <Typography>
                    Special Teams Rank
                </Typography>
                <Typography>
                    {data?.team_details[0].special_teams_ranking}
                </Typography>
            </DialogContent>
        </div>
    );
}

export default TeamDetails;
