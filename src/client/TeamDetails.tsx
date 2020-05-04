import React from 'react';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

function TeamDetails(props: {teamName: string}) {

    return (
        <div>
            <MuiDialogTitle>
                { props.teamName }
            </MuiDialogTitle>
            <MuiDialogContent dividers>
               hi
            </MuiDialogContent>
        </div>
    );
}

export default TeamDetails;
