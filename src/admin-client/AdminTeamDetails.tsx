import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { TEAM_DETAILS_BY_ID_QUERY } from '../graphql/queries/team.query';
import { TEAM_DETAILS_UPDATE_BY_ID } from '../graphql/queries/team.query';

function AdminTeamDetails(props: {teamId: number}) {

    const [offenceRank, setOffenceRank] = useState<number>();
    const [defenceRank, setDefenceRank] = useState<number>();
    const [specialTeamsRank, setSpecialTeamsRank] = useState<number>();
    const [coachingFactor, setCoachingFactor] = useState<number>();
    const [injurySeverity, setInjurySeverity] = useState<number>();
    const [talentFactor, setTalentFactor] = useState<number>();

    const [updateTeamDetails] = useMutation(TEAM_DETAILS_UPDATE_BY_ID);
    
    const { data } = useQuery(
        TEAM_DETAILS_BY_ID_QUERY,
        {
            variables: {
                id: props.teamId
            },
        }
    );

    const handleUpdate = () => {
        updateTeamDetails(
            {
                variables: {
                    id: data?.team_details[0].team_id, 
                    coaching_factor: coachingFactor ?? data?.team_details[0].coaching_factor, 
                    defence_ranking: defenceRank ?? data?.team_details[0].defence_ranking,
                    injury_severity: injurySeverity ?? data?.team_details[0].injury_severity, 
                    offence_ranking: offenceRank ?? data?.team_details[0].offence_ranking, 
                    special_teams_ranking: specialTeamsRank ?? data?.team_details[0].special_teams_ranking, 
                    talent_factor: talentFactor ?? data?.team_details[0].talent_factor
                }
            }
        )
    };

    return (
        <div>
            <DialogContent>
                <Typography>
                    Offence Rank
                </Typography>
                <TextField
                    value={offenceRank ?? data?.team_details[0].offence_ranking}
                    onChange={(fieldValue) => setOffenceRank(parseInt(fieldValue.target.value))}
                />

                <Typography>
                    Defence Rank
                </Typography>
                <TextField
                    value={defenceRank ?? data?.team_details[0].defence_ranking}
                    onChange={(fieldValue) => setDefenceRank(parseInt(fieldValue.target.value))}
                />

                <Typography>
                    Special Teams Rank
                </Typography>
                <TextField
                    value={specialTeamsRank ?? data?.team_details[0].special_teams_ranking}
                    onChange={(fieldValue) => setSpecialTeamsRank(parseInt(fieldValue.target.value))}
                />

                <Typography>
                    Coaching Factor
                </Typography>
                <TextField
                    value={coachingFactor ?? data?.team_details[0].coaching_factor}
                    onChange={(fieldValue) => setCoachingFactor(parseInt(fieldValue.target.value))}
                />
                
                <Typography>
                    Injury Severity
                </Typography>
                <TextField
                    value={injurySeverity ?? data?.team_details[0].injury_severity}
                    onChange={(fieldValue) => setInjurySeverity(parseInt(fieldValue.target.value))}
                />

                <Typography>
                    Talent Factor
                </Typography>
                <TextField
                    value={talentFactor ?? data?.team_details[0].talent_factor}
                    onChange={(fieldValue) => setTalentFactor(parseInt(fieldValue.target.value))}
                />

                <Button onClick={handleUpdate}>
                    Update
                </Button>
            </DialogContent>
        </div>
    );
}

export default AdminTeamDetails;
