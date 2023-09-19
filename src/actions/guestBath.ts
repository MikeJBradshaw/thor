import type { ButtonPayload, MotionSensorPayload } from 'types/payloads'

export const GUEST_BATH_LIGHTS_GROUP = 'z2m/guest_bath_lights'
export const GUEST_BATH_LIGHT_1 = 'z2m/sink/guest_bath/light/light_1'
export const GUEST_BATH_LIGHT_2 = 'z2m/sink/guest_bath/light/light_2'

export const GUEST_BATH_BUTTON_CLICK = 'GUEST_BATH_BUTTON_CLICK'
export interface GuestBathButtonClickAction { type: typeof GUEST_BATH_BUTTON_CLICK, payload: ButtonPayload }
export const guestBathButtonClick = (
  payload: ButtonPayload
): GuestBathButtonClickAction => ({ type: GUEST_BATH_BUTTON_CLICK, payload })

export const GUEST_BATH_BUTTON_HOLD = 'GUEST_BATH_BUTTON_CLICK'
export interface GuestBathButtonHoldAction { type: typeof GUEST_BATH_BUTTON_CLICK, payload: ButtonPayload }
export const guestBathButtonHold = (
  payload: ButtonPayload
): GuestBathButtonHoldAction => ({ type: GUEST_BATH_BUTTON_CLICK, payload })

export const GUEST_BATH_BUTTON_RELEASE = 'GUEST_BATH_BUTTON_RELEASE'
export interface GuestBathButtonReleaseAction { type: typeof GUEST_BATH_BUTTON_RELEASE, payload: ButtonPayload }
export const guestBathButtonRelease = (
  payload: ButtonPayload
): GuestBathButtonReleaseAction => ({ type: GUEST_BATH_BUTTON_RELEASE, payload })

export const GUEST_BATH_MOTION_SENSOR = 'GUEST_BATH_MOTION_SENSOR'
export interface GuestBathMotionSensorAction { type: typeof GUEST_BATH_MOTION_SENSOR, payload: MotionSensorPayload }
export const guestBathMotionSensor = (
  payload: MotionSensorPayload
): GuestBathMotionSensorAction => ({ type: GUEST_BATH_MOTION_SENSOR, payload })

export type GuestBathAction = GuestBathButtonClickAction
| GuestBathButtonHoldAction
| GuestBathButtonReleaseAction
| GuestBathMotionSensorAction
