
import gql from 'graphql-tag'
import { TEAM_DETAILS_FRAGMENT } from '../fragments/team.fragments'

export const TEAM_DETAILS_QUERY = gql`
    query TeamDetailsQuery {
        team_details(order_by: {name: asc}){
            ...team_details
        }
    }
    ${TEAM_DETAILS_FRAGMENT}
`

export const TEAM_DETAILS_BY_ID_QUERY = gql`
    query TeamDetailsByNameQuery($id: Int!) {
        team_details(where: {team_id: {_eq: $id}}) {
            ...team_details
        }
    }
    ${TEAM_DETAILS_FRAGMENT}
`

export const TEAM_DETAILS_UPDATE_BY_ID = gql`
    mutation TeamDetailsUpdateById(
        $id: Int!, 
        $coaching_factor: Int, 
        $defence_ranking: Int,
        $injury_severity: Int, 
        $offence_ranking: Int, 
        $special_teams_ranking: Int, 
        $talent_factor: Int
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