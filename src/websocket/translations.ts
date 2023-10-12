import type { MasterState } from 'reducers/master'
export const APP_INIT = 'APP_INIT'
export const MASTER_BATH_INIT = 'MASTER_BATH_INIT'

export const MASTER_BATH_UPDATE_PROFILE_MANUAL = 'MASTER_BATH_UPDATE_PROFILE_MANUAL'
export const MASTER_BATH_UPDATE_PROFILE_SENSOR = 'MASTER_BATH_UPDATE_PROFILE_SENSOR'
export const MASTER_BATH_UPDATE_PROFILE_SHOWER = 'MASTER_BATH_UPDATE_PROFILE_SHOWER'

export const WS_UPDATE_MASTER_BATH_STATE = 'WS_UPDATE_MASTER_BATH_STATE'
export interface WSUpdateStateEvent { type: typeof WS_UPDATE_MASTER_BATH_STATE, payload: MasterState }
export const wsUpdateMasterBathState = (
  payload: MasterState
): WSUpdateStateEvent => ({ type: WS_UPDATE_MASTER_BATH_STATE, payload })

export interface Entity { id: number, name: string, key: string }
export const WS_UPDATE_ENTITIES = 'WS_UPDATE_ENTITIES'
export interface WSUpdateEntitiesEvent { type: typeof WS_UPDATE_ENTITIES, payload: Entity[] }
export const wsUpdateEntities = (data: Entity[]): WSUpdateEntitiesEvent => ({ type: WS_UPDATE_ENTITIES, payload: data })

export const WS_ACK = 'WS_ACK'
export interface WSAck { type: typeof WS_ACK }
export const wsAck = (): WSAck => ({ type: WS_ACK })
