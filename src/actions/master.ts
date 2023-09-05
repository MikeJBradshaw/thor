import type { ButtonPayload, MotionSensorPayload } from 'payloads'

export const MASTER_BATH_LIGHTS = [
  'z2m/home/master_bath/light/light_1',
  'z2m/home/master_bath/light/light_2'
]

export const MASTER_BATH_MOTION_SENSOR = 'MASTER_BATH_MOTION_SENSOR'
export interface MasterBathMotionSensorAction { type: typeof MASTER_BATH_MOTION_SENSOR, payload: MotionSensorPayload }
export const masterBathMotionSensor = (
  payload: MotionSensorPayload
): MasterBathMotionSensorAction => ({ type: MASTER_BATH_MOTION_SENSOR, payload })

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

export type MasterAction = MasterBathMotionSensorAction
| MasterBathButtonHoldAction
| MasterBathButtonReleaseAction
