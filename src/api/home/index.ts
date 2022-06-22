import {http} from '@/utils/http.ts'
import { IResultOr as IResult, IRoomListParams } from '../interface'

export function fetchRoomList(params:IRoomListParams):Promise<IResult> {
    return http.httpGet('/api/room/room/getRoomList',params)
}
