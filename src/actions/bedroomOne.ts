import type { MotionSensorPayload } from 'types/payloads'

export const BEDROOM_ONE_LIGHTS_GROUP = 'z2m/bedroom_1_lights'
export const BEDROOM_ONE_LIGHT_1 = 'z2m/sink/bedroom_1/light/light_1'
export const BEDROOM_ONE_LIGHT_2 = 'z2m/sink/bedroom_1/light/light_2'
export const BEDROOM_ONE_POWER_ONE = 'z2m/sink/bedroom_1/power/sound_machine'

export const UPDATE_BRIGHTNESS = 'BEDROOM_ONE_UPDATE_BRIGHTNESS'
export interface UpdateBrightnessEvent { type: typeof UPDATE_BRIGHTNESS, payload: number }
export const updateBrightness = (payload: number): UpdateBrightnessEvent => ({ type: UPDATE_BRIGHTNESS, payload })

export const UPDATE_OCCUPANCY = 'BEDROOM_ONE_UPDATE_OCCUPANCY'
export interface UpdateOccupancyAction { type: typeof UPDATE_OCCUPANCY, payload: MotionSensorPayload }
export const updateOccupancy = (
  payload: MotionSensorPayload
): UpdateOccupancyAction => ({ type: UPDATE_OCCUPANCY, payload })

export const UPDATE_PROFILE_BRIGHT = 'BEDROOM_ONE_UPDATE_PROFILE_BRIGHT'
export interface UpdateProfileBrightEvent { type: typeof UPDATE_PROFILE_BRIGHT }
export const updateProfileBright = (): UpdateProfileBrightEvent => ({ type: UPDATE_PROFILE_BRIGHT })

export const UPDATE_PROFILE_COLORS = 'BEDROOM_ONE_UPDATE_PROFILE_COLORS'
export interface UpdateProfileColorsEvent { type: typeof UPDATE_PROFILE_COLORS }
export const updateProfileColors = (): UpdateProfileColorsEvent => ({ type: UPDATE_PROFILE_COLORS })

export const UPDATE_PROFILE_DEFAULT = 'BEDROOM_ONE_UPDATE_PROFILE_DEFAULT'
export interface UpdateProfileDefaultEvent { type: typeof UPDATE_PROFILE_DEFAULT }
export const updateProfileDefault = (): UpdateProfileDefaultEvent => ({ type: UPDATE_PROFILE_DEFAULT })

export const UPDATE_PROFILE_RED = 'BEDROOM_ONE_UPDATE_PROFILE_RED'
export interface UpdateProfileRedEvent { type: typeof UPDATE_PROFILE_RED }
export const updateProfileRed = (): UpdateProfileRedEvent => ({ type: UPDATE_PROFILE_RED })

export const UPDATE_PROFILE_SLEEP = 'BEDROOM_ONE_UPDATE_PROFILE_SLEEP'
export interface UpdateProfileSleepEvent { type: typeof UPDATE_PROFILE_SLEEP }
export const updateProfileSleep = (): UpdateProfileSleepEvent => ({ type: UPDATE_PROFILE_SLEEP })

export const UPDATE_RED_LIGHT_ON = 'BEDROOM_ONE_UPDATE_RED_LIGHT_ON'
export interface UpdateRedLightOnEvent { type: typeof UPDATE_RED_LIGHT_ON }
export const updateRedLightOn = (): UpdateRedLightOnEvent => ({ type: UPDATE_RED_LIGHT_ON })

export const UPDATE_STATE = 'BEDROOM_ONE_UPDATE_STATE'
export interface UpdateStateAction { type: typeof UPDATE_STATE }
export const updateState = (): UpdateStateAction => ({ type: UPDATE_STATE })

export const UPDATE_WHITE_LIGHT_ON = 'BEDROOM_ONE_UPDATE_WHITE_LIGHT_ON'
export interface UpdateWhiteLightOnEvent { type: typeof UPDATE_WHITE_LIGHT_ON }
export const updateWhiteLightOn = (): UpdateWhiteLightOnEvent => ({ type: UPDATE_WHITE_LIGHT_ON })

export type BedroomOneAction = UpdateBrightnessEvent
| UpdateOccupancyAction
| UpdateProfileBrightEvent
| UpdateProfileColorsEvent
| UpdateProfileDefaultEvent
| UpdateProfileRedEvent
| UpdateProfileSleepEvent
| UpdateRedLightOnEvent
| UpdateStateAction
| UpdateWhiteLightOnEvent
