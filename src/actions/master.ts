import type { ButtonPayload, MotionSensorPayload } from 'payloads'

export const LIGHTS_GROUP = 'z2m/master_bath_lights'
export const MASTER_BATH_LIGHT_1 = 'z2m/sink/master_bath/light/light_1'
export const MASTER_BATH_LIGHT_2 = 'z2m/sink/master_bath/light/light_2'

export const MASTER_BATH_BUTTON_CLICK = 'MASTER_BATH_BUTTON_CLICK'
export interface MasterBathButtonClickAction { type: typeof MASTER_BATH_BUTTON_CLICK, payload: ButtonPayload }
export const masterBathButtonClick = (
  payload: ButtonPayload
): MasterBathButtonClickAction => ({ type: MASTER_BATH_BUTTON_CLICK, payload })

export const MASTER_BATH_BUTTON_HOLD = 'MASTER_BATH_BUTTON_HOLD'
export interface MasterBathButtonHoldAction { type: typeof MASTER_BATH_BUTTON_HOLD, payload: ButtonPayload }
export const masterBathButtonHold = (
  payload: ButtonPayload
): MasterBathButtonHoldAction => ({ type: MASTER_BATH_BUTTON_HOLD, payload })

export const MASTER_BATH_BUTTON_RELEASE = 'MASTER_BATH_BUTTON_RELEASE'
export interface MasterBathButtonReleaseAction { type: typeof MASTER_BATH_BUTTON_RELEASE, payload: ButtonPayload }
export const masterBathButtonRelease = (
  payload: ButtonPayload
): MasterBathButtonReleaseAction => ({ type: MASTER_BATH_BUTTON_RELEASE, payload })

export const MASTER_BATH_MOTION_SENSOR = 'MASTER_BATH_MOTION_SENSOR'
export interface MasterBathMotionSensorAction { type: typeof MASTER_BATH_MOTION_SENSOR, payload: MotionSensorPayload }
export const masterBathMotionSensor = (
  payload: MotionSensorPayload
): MasterBathMotionSensorAction => ({ type: MASTER_BATH_MOTION_SENSOR, payload })

export const MASTER_BATH_TIMER = 'MASTER_BATH_TIMER'
export interface MasterBathTimerAction { type: typeof MASTER_BATH_TIMER }
export const masterBathTimer = (): MasterBathTimerAction => ({ type: MASTER_BATH_TIMER })

export const MASTER_BATH_TIMER_EXPIRE = 'MASTER_BATH_TIMER_EXPIRE'
export interface MasterBathTimerExpireAction { type: typeof MASTER_BATH_TIMER_EXPIRE }
export const masterBathTimerExpire = (): MasterBathTimerExpireAction => ({ type: MASTER_BATH_TIMER_EXPIRE })

export type MasterAction = MasterBathButtonClickAction
| MasterBathButtonHoldAction
| MasterBathButtonReleaseAction
| MasterBathMotionSensorAction
| MasterBathTimerAction
| MasterBathTimerExpireAction
