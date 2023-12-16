import type { BedroomOneState } from 'reducers/bedroomOne'
import type { MasterState } from 'reducers/master'
import type { LivingRoomState } from 'reducers/livingRoom'
import type { WeatherState } from 'reducers/weather'

export const APP_INIT = 'APP_INIT'
export const BEDROOM_ONE_INIT = 'BEDROOM_ONE_INIT'
export const CLIENT_HEARTBEAT = 'CLIENT_HEARTBEAT'
export const LIVING_ROOM_INIT = 'LIVING_ROOM_INIT'
export const MASTER_BATH_INIT = 'MASTER_BATH_INIT'
export const WEATHER_INIT = 'WEATHER_INIT'
export const MASTER_BATH_UPDATE_PROFILE_MANUAL = 'MASTER_BATH_UPDATE_PROFILE_MANUAL'
export const MASTER_BATH_UPDATE_PROFILE_SENSOR = 'MASTER_BATH_UPDATE_PROFILE_SENSOR'
export const MASTER_BATH_UPDATE_PROFILE_SHOWER = 'MASTER_BATH_UPDATE_PROFILE_SHOWER'

export const WS_ACK = 'WS_ACK'
export interface WSAck { type: typeof WS_ACK }
export const wsAck = (): WSAck => ({ type: WS_ACK })

export const WS_HEARTBEAT = 'WS_HEARTBEAT'
export interface WSHeartbeatEvent { type: typeof WS_HEARTBEAT }
export const wsHeartbeat = (): WSHeartbeatEvent => ({ type: WS_HEARTBEAT })

export const WS_PAYLOAD_REJECTION = 'WS_PAYLOAD_REJECTION'
export interface WSPayloadRejectionEvent { type: typeof WS_PAYLOAD_REJECTION }
export const wsPayloadRejection = (): WSPayloadRejectionEvent => ({ type: WS_PAYLOAD_REJECTION })

export const WS_UPDATE_BEDROOM_ONE_STATE = 'WS_UPDATE_BEDROOM_ONE_STATE'
export interface WSUpdateBedroomOneStateEvent { type: typeof WS_UPDATE_BEDROOM_ONE_STATE, payload: BedroomOneState }
export const wsUpdateBedroomOneState = (payload: BedroomOneState): WSUpdateBedroomOneStateEvent => ({
  type: WS_UPDATE_BEDROOM_ONE_STATE,
  payload
})

export interface Entity { id: number, name: string, key: string }
export const WS_UPDATE_ENTITIES = 'WS_UPDATE_ENTITIES'
export interface WSUpdateEntitiesEvent { type: typeof WS_UPDATE_ENTITIES, payload: Entity[] }
export const wsUpdateEntities = (data: Entity[]): WSUpdateEntitiesEvent => ({ type: WS_UPDATE_ENTITIES, payload: data })

export const WS_UPDATE_LIVING_ROOM_STATE = 'WS_UPDATE_LIVING_ROOM_STATE'
export interface WSUpdateLivingRoomOneState { type: typeof WS_UPDATE_LIVING_ROOM_STATE, payload: LivingRoomState }
export const wsUpdateLivingRoomState = (payload: LivingRoomState): WSUpdateLivingRoomOneState => ({ 
  type: WS_UPDATE_LIVING_ROOM_STATE,
  payload
})

export const WS_UPDATE_MASTER_BATH_STATE = 'WS_UPDATE_MASTER_BATH_STATE'
export interface WSUpdateStateEvent { type: typeof WS_UPDATE_MASTER_BATH_STATE, payload: MasterState }
export const wsUpdateMasterBathState = (
  payload: MasterState
): WSUpdateStateEvent => ({ type: WS_UPDATE_MASTER_BATH_STATE, payload })

export const WS_UPDATE_WEATHER_STATE = 'WS_UPDATE_WEATHER_STATE'
export interface WSUpdateWeatherStateEvent { type: typeof WS_UPDATE_WEATHER_STATE, payload: WeatherState }
export const wsUpdateWeatherState = (
  payload: WeatherState
): WSUpdateWeatherStateEvent => ({ type: WS_UPDATE_WEATHER_STATE, payload })
