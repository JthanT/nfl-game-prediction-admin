
import gql from 'graphql-tag'
import { GAME_SCHEDULE_FRAGMENT } from '../fragments/game.fragments'

export const GAME_SCHEDULE_QUERY = gql`
    query GameScheduleQuery {
        game_schedule(order_by: {date: asc, time: asc}){
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

export const GAME_SCHEDULE_INSERT = gql`
    mutation GameScheduleInsert(
        $team_1_name: String!, 
        $team_2_name: String!, 
        $league_year: Int!, 
        $time: time, 
        $week: Int, 
        $date: date
    ) {
        insert_game_schedule(
            objects: {
                team_1_name: $team_1_name, 
                team_2_name: $team_2_name, 
                league_year: $league_year, 
                time: $time, 
                week: $week, 
                date: $date
            }
        ) {
            affected_rows
        }
    }
`
export const GAME_SCHEDULE_UPDATE_BY_ID = gql`
    mutation GameScheduleUpdateById(
        $id: Int!, 
        $team_1_name: String, 
        $team_2_name: String, 
        $league_year: Int, 
        $time: time, 
        $week: Int, 
        $date: date
    ) {
        update_game_schedule(
            where: {game_id: {_eq: $id}}, 
            _set: {
                team_1_name: $team_1_name, 
                team_2_name: $team_2_name, 
                league_year: $league_year, 
                time: $time, 
                week: $week, 
                date: $date
            }
        ) {
            affected_rows
        }
    }
`
