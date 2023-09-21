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

export type LivingRoomAction = LivingRoomButtonClickAction
