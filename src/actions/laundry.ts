import type { MotionSensorPayload } from 'types/payloads'

export const LAUNDRY_LIGHTS_GROUP = 'z2m/laundry_lights'

export const MOTION_SENSOR = 'LAUNDRY_MOTION_SENSOR'
export interface MotionSensorAction { type: typeof MOTION_SENSOR, payload: MotionSensorPayload}
export const motionSensor = (payload: MotionSensorPayload): MotionSensorAction => ({ type: MOTION_SENSOR, payload })

export type LaundryAction = MotionSensorAction
