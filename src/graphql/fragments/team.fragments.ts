import gql from 'graphql-tag'

export const TEAM_DETAILS_FRAGMENT = gql`
    fragment team_details on team_details {
        team_id
        name
        offence_ranking
        defence_ranking
        special_teams_ranking
        coaching_factor
        injury_severity
        talent_factor
        grade
    }
`
