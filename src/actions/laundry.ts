import type { MotionSensorPayload } from 'payloads'

export const LAUNDRY_LIGHTS = [
  'z2m/home/laundry/light/light_1',
  'z2m/home/laundry/light/light_2'
]

export const MOTION_SENSOR = 'LAUNDRY_MOTION_SENSOR'
export interface MotionSensorAction { type: typeof MOTION_SENSOR, payload: MotionSensorPayload}
export const motionSensor = (payload: MotionSensorPayload): MotionSensorAction => ({ type: MOTION_SENSOR, payload })

export type LaundryAction = MotionSensorAction
