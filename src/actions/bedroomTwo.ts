export const LIGHTS_GROUP = 'z2m/bedroom-one-lights'

export const UPDATE_BRIGHTNESS = 'BEDROOM_TWO_UPDATE_BRIGHTNESS'
export interface UpdateBrightnessEvent { type: typeof UPDATE_BRIGHTNESS, brightness: number }
export const updateBrightness = (brightness: number): UpdateBrightnessEvent => ({ type: UPDATE_BRIGHTNESS, brightness })

export const UPDATE_PROFILE_BRIGHT = 'BEDROOM_TWO_UPDATE_PROFILE_BRIGHT'
export interface UpdateProfileBrightEvent { type: typeof UPDATE_PROFILE_BRIGHT }
export const updateProfileBright = (): UpdateProfileBrightEvent => ({ type: UPDATE_PROFILE_BRIGHT })

export const UPDATE_PROFILE_RAINBOW = 'BEDROOM_TWO_UPDATE_PROFILE_RAINBOW'
export interface UpdateProfileRainbowEvent { type: typeof UPDATE_PROFILE_RAINBOW }
export const updateProfileRainbow = (): UpdateProfileRainbowEvent => ({ type: UPDATE_PROFILE_RAINBOW })

export const UPDATE_PROFILE_SLEEP = 'BEDROOM_TWO_UPDATE_PROFILE_SLEEP'
export interface UpdateProfileSleepEvent { type: typeof UPDATE_PROFILE_SLEEP }
export const updateProfileSleep = (): UpdateProfileSleepEvent => ({ type: UPDATE_PROFILE_SLEEP })

export type BedroomTwoEvent = UpdateBrightnessEvent
| UpdateProfileBrightEvent
| UpdateProfileRainbowEvent
| UpdateProfileSleepEvent
