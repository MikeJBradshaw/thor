export const APP_INIT = 'APP_INIT'
export const MASTER_BATH_INIT = 'MASTER_BATH_INIT'

export const MASTER_BATH_UPDATE_PROFILE_MANUAL = 'MASTER_BATH_UPDATE_PROFILE_MANUAL'
export const MASTER_BATH_UPDATE_PROFILE_NORMAL = 'MASTER_BATH_UPDATE_PROFILE_NORMAL'
export const MASTER_BATH_UPDATE_PROFILE_SHOWER = 'MASTER_BATH_UPDATE_PROFILE_SHOWER'

export interface Entity { id: number, name: string, key: string }
export const UPDATE_ENTITIES = 'WS_EVENT_UPDATE_ENTITIES'
export interface UpdateEntitiesEvent { type: typeof UPDATE_ENTITIES, payload: Entity[] }
export const updateEntities = (data: Entity[]): UpdateEntitiesEvent => ({ type: UPDATE_ENTITIES, payload: data })

export const WS_NOOP = 'WS_NOOP'
export interface WSNoopAction { type: typeof WS_NOOP }
export const wsNoop = (): WSNoopAction => ({ type: WS_NOOP })
