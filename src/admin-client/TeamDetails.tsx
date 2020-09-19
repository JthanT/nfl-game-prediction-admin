import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { makeStyles, DialogContent, DialogTitle, Typography, TextField, Button } from '@material-ui/core';
import { TEAM_DETAILS_BY_ID_QUERY } from '../graphql/queries/team.queries';
import { TEAM_DETAILS_UPDATE_BY_ID } from '../graphql/mutations/team.mutations';

const useStyles = makeStyles({
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: '10px',
        paddingBottom: '40px'
    },
    updateButton: {
        textTransform: 'none',
    },
    buttonRow: {
        display: 'flex', 
        justifyContent: 'flex-end',
    },
});

function TeamDetails(props: {teamId: number, refetchTeamDetails?: () => void}) {

    const { data } = useQuery(
        TEAM_DETAILS_BY_ID_QUERY,
        {
            variables: {
                id: props.teamId
            },
        }
    );

    const [updateTeamDetails] = useMutation(
        TEAM_DETAILS_UPDATE_BY_ID,
        {
            onError(error) {
              console.error("error :>>", error.message);
            },
        }
    );

    const classes = useStyles();

    const [offenceRank, setOffenceRank] = useState<number>();
    const [defenceRank, setDefenceRank] = useState<number>();
    const [specialTeamsRank, setSpecialTeamsRank] = useState<number>();
    const [injurySeverity, setInjurySeverity] = useState<number>();

    const handleUpdate = () => {
        updateTeamDetails(
            {
                variables: {
                    id: data?.team_details[0].team_id,
                    defence_ranking: (!defenceRank || defenceRank === 0) ? 
                        data?.team_details[0].defence_ranking :
                        defenceRank,
                    injury_severity: injurySeverity ?? data?.team_details[0].injury_severity, 
                    offence_ranking: (!offenceRank || offenceRank === 0) ? 
                        data?.team_details[0].offence_ranking :
                        offenceRank, 
                    special_teams_ranking: (!specialTeamsRank || specialTeamsRank === 0) ? 
                        data?.team_details[0].special_teams_ranking :
                        specialTeamsRank,
                }
            }
        )

        if (props.refetchTeamDetails) {
            props.refetchTeamDetails()
        };
    };

    return (
        <div>
            <DialogTitle>
                Edit Team Data: {data?.team_details[0].name}
            </DialogTitle>
            <DialogContent dividers>
                <div className={classes.inputRow}>    
                    <div>
                        <Typography>
                            Offence Rank
                        </Typography>
                        <TextField
                            value={offenceRank ?? data?.team_details[0].offence_ranking}
                            onChange={(fieldValue) => setOffenceRank(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </div>
                    <div>
                        <Typography>
                            Defence Rank
                        </Typography>
                        <TextField
                            value={defenceRank ?? data?.team_details[0].defence_ranking}
                            onChange={(fieldValue) => setDefenceRank(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </div>
                    <div>
                        <Typography>
                            Special Teams Rank
                        </Typography>
                        <TextField
                            value={specialTeamsRank ?? data?.team_details[0].special_teams_ranking}
                            onChange={(fieldValue) => setSpecialTeamsRank(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </div>
                    <div>
                        <Typography>
                            Injury Severity
                        </Typography>
                        <TextField
                            value={injurySeverity ?? data?.team_details[0].injury_severity}
                            onChange={(fieldValue) => setInjurySeverity(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </div>
                </div>
                <div className={classes.buttonRow}>
                    <Button onClick={handleUpdate} variant="outlined" className={classes.updateButton}>
                        Update
                    </Button>
                </div>
            </DialogContent>
        </div>
    );
}

export default TeamDetails;


