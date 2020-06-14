import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { TEAM_DETAILS_BY_ID_QUERY } from '../graphql/queries/team.queries';
import { TEAM_DETAILS_UPDATE_BY_ID } from '../graphql/mutations/team.mutations';

function AdminTeamDetails(props: {teamId: number, refetchTeamDetails?: () => void}) {

    const { data } = useQuery(
        TEAM_DETAILS_BY_ID_QUERY,
        {
            variables: {
                id: props.teamId
            },
        }
    );

    const [updateTeamDetails] = useMutation(TEAM_DETAILS_UPDATE_BY_ID);

    const [offenceRank, setOffenceRank] = useState<number>();
    const [defenceRank, setDefenceRank] = useState<number>();
    const [specialTeamsRank, setSpecialTeamsRank] = useState<number>();
    const [coachingFactor, setCoachingFactor] = useState<number>();
    const [injurySeverity, setInjurySeverity] = useState<number>();
    const [talentFactor, setTalentFactor] = useState<number>();

    const handleUpdate = () => {
        updateTeamDetails(
            {
                variables: {
                    id: data?.team_details[0].team_id, 
                    coaching_factor: (!coachingFactor || coachingFactor == 0) ? 
                        data?.team_details[0].coaching_factor : 
                        coachingFactor, 
                    defence_ranking: (!defenceRank || defenceRank == 0) ? 
                        data?.team_details[0].defence_ranking :
                        defenceRank,
                    injury_severity: injurySeverity ?? data?.team_details[0].injury_severity, 
                    offence_ranking: (!offenceRank || offenceRank == 0) ? 
                        data?.team_details[0].offence_ranking :
                        offenceRank, 
                    special_teams_ranking: (!specialTeamsRank || specialTeamsRank == 0) ? 
                        data?.team_details[0].special_teams_ranking :
                        specialTeamsRank, 
                    talent_factor: (!talentFactor || talentFactor == 0) ? 
                        data?.team_details[0].talent_factor :
                        talentFactor
                }
            }
        )

        if (props.refetchTeamDetails) {
            props.refetchTeamDetails()
        };
    };

    const classes = useStyles();

    return (
        <div>
            <DialogTitle>
                Edit Team Data: {data?.team_details[0].name}
            </DialogTitle>
            <DialogContent dividers>
                <DialogContent className={classes.inputRow}>    
                    <DialogContent>
                        <Typography>
                            Offence Rank
                        </Typography>
                        <TextField
                            value={offenceRank ?? data?.team_details[0].offence_ranking}
                            onChange={(fieldValue) => setOffenceRank(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </DialogContent>

                    <DialogContent>
                        <Typography>
                            Defence Rank
                        </Typography>
                        <TextField
                            value={defenceRank ?? data?.team_details[0].defence_ranking}
                            onChange={(fieldValue) => setDefenceRank(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </DialogContent>

                    <DialogContent>
                        <Typography>
                            Special Teams Rank
                        </Typography>
                        <TextField
                            value={specialTeamsRank ?? data?.team_details[0].special_teams_ranking}
                            onChange={(fieldValue) => setSpecialTeamsRank(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </DialogContent>
                </DialogContent>

                <DialogContent className={classes.inputRow}>
                    <DialogContent>
                        <Typography>
                            Coaching Factor
                        </Typography>
                        <TextField
                            value={coachingFactor ?? data?.team_details[0].coaching_factor}
                            onChange={(fieldValue) => setCoachingFactor(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </DialogContent>
                    
                    <DialogContent>
                        <Typography>
                            Injury Severity
                        </Typography>
                        <TextField
                            value={injurySeverity ?? data?.team_details[0].injury_severity}
                            onChange={(fieldValue) => setInjurySeverity(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </DialogContent>

                    <DialogContent>
                        <Typography>
                            Talent Factor
                        </Typography>
                        <TextField
                            value={talentFactor ?? data?.team_details[0].talent_factor}
                            onChange={(fieldValue) => setTalentFactor(fieldValue.target.value ? parseInt(fieldValue.target.value) : 0)}
                        />
                    </DialogContent>
                </DialogContent>

                <DialogContent className={classes.buttonRow}>
                    <Button onClick={handleUpdate} variant="outlined" className={classes.updateButton}>
                        Update
                    </Button>
                </DialogContent>
            </DialogContent>
        </div>
    );
}

export default AdminTeamDetails;

const useStyles = makeStyles({
    inputRow: {
        display: 'flex',
    },
    teamSelectors: {
        display: 'flex',
    },
    updateButton: {
        textTransform: 'none',
    },
    buttonRow: {
        display: 'flex', 
        justifyContent: 'flex-end',
    },
});
