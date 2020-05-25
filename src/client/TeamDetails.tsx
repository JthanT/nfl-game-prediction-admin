import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { TEAM_DETAILS_BY_NAME_QUERY } from '../graphql/queries/team.query';

function TeamDetails(props: {teamName: string}) {
    const { data } = useQuery(
        TEAM_DETAILS_BY_NAME_QUERY,
        {
            variables: {
                name: props.teamName
            },
        }
    );

    return (
        <div>
            <DialogTitle>
                {data?.team_details[0].name}
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Offence Rank
                </DialogContentText>
                <DialogContentText>
                    {data?.team_details[0].offence_ranking}
                </DialogContentText>
            </DialogContent>
            <DialogContent dividers>
                <DialogContentText>
                    Defence Rank
                </DialogContentText>
                <DialogContentText>
                    {data?.team_details[0].defence_ranking}
                </DialogContentText>
            </DialogContent>
            <DialogContent dividers>
                <DialogContentText>
                    Special Teams Rank
                </DialogContentText>
                <DialogContentText>
                    {data?.team_details[0].special_teams_ranking}
                </DialogContentText>
            </DialogContent>
        </div>
    );
}

export default TeamDetails;
