import type { MotionSensor } from 'payloads'

export const MASTER_BATH_LIGHTS = [
  'z2m/home/master_bath/light/light_1',
  'z2m/home/master_bath/light/light_2'
]

export const MASTER_BATH_MOTION_SENSOR = 'MASTER_BATH_MOTION_SENSOR'
export interface MasterBathMotionSensorAction { type: typeof MASTER_BATH_MOTION_SENSOR, payload: MotionSensor }
export const masterBathMotionSensor = (
  payload: MotionSensor
): MasterBathMotionSensorAction => ({ type: MASTER_BATH_MOTION_SENSOR, payload })

export type MasterAction = MasterBathMotionSensorAction
