
import gql from 'graphql-tag'
import { GAME_SCHEDULE_FRAGMENT } from '../fragments/game.fragments'

export const GAME_SCHEDULE_BY_YEAR_QUERY = gql`
    query GameScheduleQuery($leagueYear: Int!, $leagueWeek: Int) {
        game_schedule(
            order_by: {date: asc, time: asc}, 
            where: {league_year: {_eq: $leagueYear}, week: {_eq: $leagueWeek}}
        ){
            ...game_schedule
        }
    }
    ${GAME_SCHEDULE_FRAGMENT}
`

export const GAME_SCHEDULE_BY_ID_QUERY = gql`
    query GameScheduleByIdQuery($id: Int!) {
        game_schedule(where: {game_id: {_eq: $id}}) {
            ...game_schedule
        }
    }
    ${GAME_SCHEDULE_FRAGMENT}
`
