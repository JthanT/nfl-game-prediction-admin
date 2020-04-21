
import gql from 'graphql-tag'
import TEAM_DETAILS_FRAGMENT from '../fragments/team.fragments'

const TeamDetailsQuery = gql`
    query TeamDetails {
        ...team_details
    }
    ${TEAM_DETAILS_FRAGMENT}
`

const TeamDetailsInsert = gql`
    insert_team_details(objects: {
        name: String!, 
        injury_severity: Int, 
        id: Int!, 
        defence_ranking: Int, 
        coaching_factor: Int, 
        offence_ranking: Int, 
        special_teams_ranking: Int, 
        talent_factor: Int
    }) {
        returning {
            affected_rows
        }
    }
`;
