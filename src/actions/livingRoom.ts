import type { ButtonPayload } from 'types/payloads'

export const LIVING_ROOM_LIGHT_ONE = 'z2m/sink/living_room/light/light_1'
export const LIVING_ROOM_LIGHT_TWO = 'z2m/sink/living_room/light/light_2'
export const LIVING_ROOM_LIGHTS_GROUP = 'z2m/living_room_lights'
export const LIVING_ROOM_TV_POWER = 'z2m/sink/living_room/power/tv'

export const LIVING_ROOM_BUTTON_CLICK = 'LIVING_ROOM_BUTTON_CLICK'
export interface LivingRoomButtonClickAction { type: typeof LIVING_ROOM_BUTTON_CLICK, payload: ButtonPayload }
export const livingRoomButtonClick = (
  payload: ButtonPayload
): LivingRoomButtonClickAction => ({ type: LIVING_ROOM_BUTTON_CLICK, payload })

export const LIVING_ROOM_BUTTON_HOLD = 'LIVING_ROOM_BUTTON_HOLD'
export interface LivingRoomButtonHoldEvent { type: typeof LIVING_ROOM_BUTTON_HOLD }
export const livingRoomButtonHold = (): LivingRoomButtonHoldEvent => ({ type: LIVING_ROOM_BUTTON_HOLD })

export const LIVING_ROOM_BUTTON_RELEASE = 'LIVING_ROOM_BUTTON_RELEASE'
export interface LivingRoomButtonReleaseEvent { type: typeof LIVING_ROOM_BUTTON_RELEASE }
export const livingRoomButtonRelease = (): LivingRoomButtonReleaseEvent => ({ type: LIVING_ROOM_BUTTON_RELEASE })

export const UPDATE_PROFILE_DEFAULT = 'LIVING_ROOM_UPDATE_PROFILE_DEFAULT'
export interface UpdateProfileDefaultEvent { type: typeof UPDATE_PROFILE_DEFAULT }
export const updateProfileDefault = (): UpdateProfileDefaultEvent => ({ type: UPDATE_PROFILE_DEFAULT })

export const UPDATE_PROFILE_RAINBOW = 'LIVING_ROOM_UPDATE_PROFILE_RAINBOW'
export interface UpdateProfileRainbowEvent { type: typeof UPDATE_PROFILE_RAINBOW }
export const updateProfileRainbow = (): UpdateProfileRainbowEvent => ({ type: UPDATE_PROFILE_RAINBOW })

export const UPDATE_STATE = 'LIVING_ROOM_UPDATE_STATE'
export interface UpdateStateAction { type: typeof UPDATE_STATE }
export const updateState = (): UpdateStateAction => ({ type: UPDATE_STATE })

export type LivingRoomAction = LivingRoomButtonClickAction
| LivingRoomButtonHoldEvent
| LivingRoomButtonReleaseEvent
| UpdateProfileDefaultEvent
| UpdateProfileRainbowEvent
| UpdateStateAction

export type LivingRoomUpdatable = UpdateProfileDefaultEvent
| UpdateProfileRainbowEvent
