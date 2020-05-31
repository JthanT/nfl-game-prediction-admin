
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

export const TEAM_DETAILS_BY_NAME_QUERY = gql`
    query TeamDetailsByNameQuery($name: String!) {
        team_details(where: {name: {_eq: $name}}) {
            ...team_details
        }
    }
    ${TEAM_DETAILS_FRAGMENT}
`

export const TEAM_DETAILS_UPDATE_BY_ID = gql`
    mutation TeamDetailsUpdateById(
        $id: Int!, 
        $coaching_factor: smallint, 
        $defence_ranking: smallint,
        $injury_severity: smallint, 
        $offence_ranking: smallint, 
        $special_teams_ranking: smallint, 
        $talent_factor: smallint
    ) {
        update_team_details(
            where: {team_id: {_eq: $id}}, 
            _set: {
                coaching_factor: $coaching_factor, 
                defence_ranking: $defence_ranking,
                injury_severity: $injury_severity, 
                offence_ranking: $offence_ranking, 
                special_teams_ranking: $special_teams_ranking, 
                talent_factor: $talent_factor
            }
        ) {
            affected_rows
        }
    }
`