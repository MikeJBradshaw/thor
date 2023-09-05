import type { MotionSensor } from 'payloads'

const BRIGHTNESS_HIGH = 255 // TODO: pull to constants

export const LAUNDRY_LIGHTS = [
  'z2m/home/laundry/light/light_1',
  'z2m/home/laundry/light/light_2'
]

export const MOTION_SENSOR = 'LAUNDRY_MOTION_SENSOR'
export interface MotionSensorAction { type: typeof MOTION_SENSOR, payload: MotionSensor}
export const motionSensor = (payload: MotionSensor): MotionSensorAction => ({ type: MOTION_SENSOR, payload })

export type LaundryAction = MotionSensorAction
