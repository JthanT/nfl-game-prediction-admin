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
