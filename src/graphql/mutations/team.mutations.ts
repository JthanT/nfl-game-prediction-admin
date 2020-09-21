import gql from 'graphql-tag'

export const TEAM_DETAILS_UPDATE_BY_ID = gql`
    mutation TeamDetailsUpdateById(
        $id: Int!,
        $defence_ranking: Int,
        $injury_severity: Int, 
        $offence_ranking: Int, 
        $special_teams_ranking: Int,
        $bye_week: Int
    ) {
        update_team_details(
            where: {team_id: {_eq: $id}}, 
            _set: {
                defence_ranking: $defence_ranking,
                injury_severity: $injury_severity, 
                offence_ranking: $offence_ranking, 
                special_teams_ranking: $special_teams_ranking,
                bye_week: $bye_week
            }
        ) {
            affected_rows
        }
    }
`
