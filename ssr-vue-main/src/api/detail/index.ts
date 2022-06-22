import {http} from '@/utils/http.ts'
import { IResultOr as IResult, IRoomDetailParams } from '../interface'

export function fetchRoomDetail(params:IRoomDetailParams):Promise<IResult> {
    return http.httpGet('/api/room/room/getRoomDetail',params)
}
