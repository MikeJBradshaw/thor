import { ButtonPayload } from 'payloads'

/***************
 * DEVICES
 * ************/
export const BEDROOM_ONE_LIGHTS_GROUP = 'z2m/bedroom_1_lights'
export const BEDROOM_ONE_LIGHT_1 = 'z2m/home/bedroom_1/light/light_1'
export const BEDROOM_ONE_LIGHT_2 = 'z2m/home/bedroom_1/light/light_2'

export const BEDROOM_ONE_POWER_ONE = 'z2m/home/lola/power/sound_machine'

export const BEDROOM_ONE_BUTTON_CLICK = 'BEDROOM_ONE_BUTTON_CLICK'
export interface BedroomOneButtonClickAction { type: typeof BEDROOM_ONE_BUTTON_CLICK, payload: ButtonPayload }
export const bedroomOneButtonClick = (
  payload: ButtonPayload
): BedroomOneButtonClickAction => ({ type: BEDROOM_ONE_BUTTON_CLICK, payload })

export const BEDROOM_ONE_BUTTON_HOLD = 'BEDROOM_ONE_BUTTON_HOLD'
export interface BedroomOneButtonHoldAction { type: typeof BEDROOM_ONE_BUTTON_HOLD, payload: ButtonPayload }
export const bedroomOneButtonHold = (
  payload: ButtonPayload
): BedroomOneButtonHoldAction => ({ type: BEDROOM_ONE_BUTTON_HOLD, payload })

export const BEDROOM_ONE_BUTTON_RELEASE = 'BEDROOM_ONE_BUTTON_RELEASE'
export interface BedroomOneButtonReleaseAction { type: typeof BEDROOM_ONE_BUTTON_RELEASE, payload: ButtonPayload }
export const bedroomOneButtonRelease = (
  payload: ButtonPayload
): BedroomOneButtonReleaseAction => ({ type: BEDROOM_ONE_BUTTON_RELEASE, payload })

export type BedroomOneAction = BedroomOneButtonClickAction
| BedroomOneButtonHoldAction
| BedroomOneButtonReleaseAction
