import type { MotionSensorPayload } from 'types/payloads'

export const LIGHTS_GROUP = 'z2m/master_bath_lights'
export const MASTER_BATH_LIGHT_1 = 'z2m/sink/master_bath/light/light_1'
export const MASTER_BATH_LIGHT_2 = 'z2m/sink/master_bath/light/light_2'
export const MASTER_BEDROOM_POWER_ROUTER = 'z2m/sink/master_bedroom/power/router'
export const MASTER_BEDROOM_POWER_MODEM = 'z2m/sink/master_bedroom/power/internet'

export const CHANGE_GROUP_RED_LIGHT = 'MASTER_BATH_CHANGE_GROUP_RED_LIGHT' // WS
export interface ChangeGroupRedLightAction { type: typeof CHANGE_GROUP_RED_LIGHT }
export const changeGroupRedLight = (): ChangeGroupRedLightAction => ({ type: CHANGE_GROUP_RED_LIGHT })

export const CHANGE_GROUP_WHITE_LIGHT = 'MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT' // WS
export interface ChangeGroupWhiteLightAction { type: typeof CHANGE_GROUP_WHITE_LIGHT }
export const changeGroupWhiteLight = (): ChangeGroupWhiteLightAction => ({ type: CHANGE_GROUP_WHITE_LIGHT })

export const MASTER_BATH_MOTION_SENSOR = 'MASTER_BATH_MOTION_SENSOR'
export interface MasterBathMotionSensorAction { type: typeof MASTER_BATH_MOTION_SENSOR, payload: MotionSensorPayload }
export const masterBathMotionSensor = (
  payload: MotionSensorPayload
): MasterBathMotionSensorAction => ({ type: MASTER_BATH_MOTION_SENSOR, payload })

export const UPDATE_BRIGHTNESS = 'MASTER_BATH_UPDATE_BRIGHTNESS'
export interface UpdateBrightnessAction { type: typeof UPDATE_BRIGHTNESS, brightness: number }
export const updateBrightness = (brightness: number): UpdateBrightnessAction => ({ type: UPDATE_BRIGHTNESS, brightness })

export const UPDATE_MANUAL_PROFILE = 'MASTER_BATH_UPDATE_PROFILE_MANUAL'
export interface UpdateManualProfileAction { type: typeof UPDATE_MANUAL_PROFILE }
export const updateManualProfile = (): UpdateManualProfileAction => ({ type: UPDATE_MANUAL_PROFILE })

export const UPDATE_SENSOR_PROFILE = 'MASTER_BATH_SENSOR_PROFILE'
export interface UpdateSensorProfileAction { type: typeof UPDATE_SENSOR_PROFILE }
export const updateSensorProfile = (): UpdateSensorProfileAction => ({ type: UPDATE_SENSOR_PROFILE })

export const UPDATE_SHOWER_TIMER = 'MASTER_BATH_SHOWER_TIMER'
export interface UpdateShowerTimerAction { type: typeof UPDATE_SHOWER_TIMER }
export const updateShowerTimer = (): UpdateShowerTimerAction => ({ type: UPDATE_SHOWER_TIMER })

export const UPDATE_STATE = 'MASTER_BATH_UPDATE_STATE'
export interface UpdateStateAction { type: typeof UPDATE_STATE }
export const updateState = (): UpdateStateAction => ({ type: UPDATE_STATE })

export const UPDATE_TIMER_EXPIRE = 'MASTER_BATH_TIMER_EXPIRE'
export interface UpdateTimerExpireAction { type: typeof UPDATE_TIMER_EXPIRE }
export const updateTimerExpire = (): UpdateTimerExpireAction => ({ type: UPDATE_TIMER_EXPIRE })

export type MasterAction = ChangeGroupRedLightAction
| ChangeGroupWhiteLightAction
| MasterBathMotionSensorAction
| UpdateBrightnessAction
| UpdateManualProfileAction
| UpdateSensorProfileAction
| UpdateShowerTimerAction
| UpdateStateAction
| UpdateTimerExpireAction
