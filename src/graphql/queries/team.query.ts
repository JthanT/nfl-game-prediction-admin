
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
