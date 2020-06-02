import gql from 'graphql-tag'

export const GAME_SCHEDULE_FRAGMENT = gql`
    fragment game_schedule on game_schedule {
        date
        game_id
        league_year
        predicted_winner
        team_1_grade
        team_1_name
        team_2_grade
        team_2_name
        time
        week
        winning_team
    }
`
