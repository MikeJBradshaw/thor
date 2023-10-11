import type { ButtonPayload, MotionSensorPayload } from 'types/payloads'

export const LIGHTS_GROUP = 'z2m/master_bath_lights'
export const MASTER_BATH_LIGHT_1 = 'z2m/sink/master_bath/light/light_1'
export const MASTER_BATH_LIGHT_2 = 'z2m/sink/master_bath/light/light_2'
export const MASTER_BEDROOM_POWER_ROUTER = 'z2m/sink/master_bedroom/power/router'
export const MASTER_BEDROOM_POWER_MODEM = 'z2m/sink/master_bedroom/power/internet'

export const MASTER_BATH_CHANGE_GROUP_RED_LIGHT = 'MASTER_BATH_CHANGE_GROUP_RED_LIGHT' // WS
export interface MasterBathChangeGroupRedLightAction { type: typeof MASTER_BATH_CHANGE_GROUP_RED_LIGHT }
export const masterBathChangeGroupRedLight = (): MasterBathChangeGroupRedLightAction => ({
  type: MASTER_BATH_CHANGE_GROUP_RED_LIGHT
})

export const MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT = 'MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT' // WS
export interface MasterBathChangeGroupWhiteLightAction { type: typeof MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT }
export const masterBathChangeGroupWhiteLight = (): MasterBathChangeGroupWhiteLightAction => ({
  type: MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT
})

export const MASTER_BATH_DISABLE_MANUAL = 'MASTER_BATH_DISABLE_MANUAL' // WS
export interface MasterBathDisableManualAction { type: typeof MASTER_BATH_DISABLE_MANUAL }
export const masterBathDisableManual = (): MasterBathDisableManualAction => ({ type: MASTER_BATH_DISABLE_MANUAL })

export const MASTER_BATH_MOTION_SENSOR = 'MASTER_BATH_MOTION_SENSOR'
export interface MasterBathMotionSensorAction { type: typeof MASTER_BATH_MOTION_SENSOR, payload: MotionSensorPayload }
export const masterBathMotionSensor = (
  payload: MotionSensorPayload
): MasterBathMotionSensorAction => ({ type: MASTER_BATH_MOTION_SENSOR, payload })

export const MASTER_BATH_OVERRIDE_SENSOR = 'MASTER_BATH_OVERRIDE_SENSOR' // WS
export interface MasterBathOverrideSensorAction { type: typeof MASTER_BATH_OVERRIDE_SENSOR }
export const masterBathOverrideSensor = (): MasterBathOverrideSensorAction => ({ type: MASTER_BATH_OVERRIDE_SENSOR })

export const MASTER_BATH_SHOWER_TIMER = 'MASTER_BATH_SHOWER_TIMER'
export interface MasterBathShowerTimerAction { type: typeof MASTER_BATH_SHOWER_TIMER }
export const masterBathShowerTimer = (): MasterBathShowerTimerAction => ({ type: MASTER_BATH_SHOWER_TIMER })

export const MASTER_BATH_TIMER_EXPIRE = 'MASTER_BATH_TIMER_EXPIRE'
export interface MasterBathTimerExpireAction { type: typeof MASTER_BATH_TIMER_EXPIRE }
export const masterBathTimerExpire = (): MasterBathTimerExpireAction => ({ type: MASTER_BATH_TIMER_EXPIRE })

export const MASTER_BATH_UPDATE_STATE = 'MASTER_BATH_UPDATE_STATE'
export interface MasterBathUpdateStateAction { type: typeof MASTER_BATH_UPDATE_STATE }
export const masterBathUpdateState = (): MasterBathUpdateStateAction => ({ type: MASTER_BATH_UPDATE_STATE })

export type MasterAction = MasterBathChangeGroupRedLightAction
| MasterBathChangeGroupWhiteLightAction
| MasterBathDisableManualAction
| MasterBathMotionSensorAction
| MasterBathOverrideSensorAction
| MasterBathShowerTimerAction
| MasterBathTimerExpireAction
| MasterBathUpdateStateAction
