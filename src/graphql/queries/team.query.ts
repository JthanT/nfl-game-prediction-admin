
import gql from 'graphql-tag'
import { TEAM_DETAILS_FRAGMENT } from '../fragments/team.fragments'

export const TEAM_DETAILS_QUERY = gql`
    query TeamDetailsQuery {
        team_details{
            ...team_details
        }
    }
    ${TEAM_DETAILS_FRAGMENT}
`

export const TEAM_DETAILS_UPDATE = gql`
    mutation TeamDetailsUpdate (
        $injury_severity: Int, 
        $id: Int!, 
        $defence_ranking: Int, 
        $coaching_factor: Int, 
        $offence_ranking: Int, 
        $special_teams_ranking: Int, 
        $talent_factor: Int
    ) {
        update_team_details (
            _set: {
                coaching_factor: $coaching_factor, 
                defence_ranking: $defence_ranking,
                injury_severity: $injury_severity,
                offence_ranking: $offence_ranking, 
                special_teams_ranking: $special_teams_ranking, 
                talent_factor: $talent_factor
            },
            where: {id: { _eq: $id }}
            ) {
                affected_rows
            }
    }
`;
