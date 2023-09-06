import { ButtonState } from 'payloads'

/***************
 * DEVICES
 * ************/
export const BEDROOM_ONE_LIGHTS_GROUP = 'z2m/bedroom_1_lights'
export const BEDROOM_ONE_LIGHT_1 = 'z2m/home/bedroom_1/light/light_1'
export const BEDROOM_ONE_LIGHT_2 = 'z2m/home/bedroom_1/light/light_2'

export const BEDROOM_ONE_POWER_ONE = 'z2m/home/lola/power/sound_machine'

type ButtonStandardStates = ButtonState.Default | ButtonState.Double | ButtonState.Single
export const BUTTON_CLICK = 'BEDROOM_ONE_BUTTON_CLICK'
export interface ButtonClickAction { type: typeof BUTTON_CLICK, state: ButtonStandardStates }
export const buttonClick = (
  state: ButtonStandardStates
): ButtonClickAction => ({ type: BUTTON_CLICK, state })

export const BUTTON_HOLD = 'BEDROOM_ONE_BUTTON_HOLD'
export interface ButtonHoldAction { type: typeof BUTTON_HOLD }
export const buttonHold = (): ButtonHoldAction => ({ type: BUTTON_HOLD })

export const BUTTON_RELEASE = 'BEDROOM_ONE_BUTTON_RELEASE'
export interface ButtonReleaseAction { type: typeof BUTTON_RELEASE }
export const buttonRelease = (): ButtonReleaseAction => ({ type: BUTTON_RELEASE })

export type BedroomOneAction = ButtonClickAction
| ButtonHoldAction
| ButtonReleaseAction
