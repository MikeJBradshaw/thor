export const ALL_KITCHEN_POWER = 'z2m/kitchen-power'
export const KITCHEN_NIGHT_LIGHT = 'z2m/kitchen-night-light'

export const BRIGHT_PROFILE = 'KITCHEN_BRIGHT_PROFILE'
export interface BrightProfileAction { type: typeof BRIGHT_PROFILE }
export const brightProfile = (): BrightProfileAction => ({ type: BRIGHT_PROFILE })

export const LOW_LIGHT_PROFILE = 'KITCHEN_LOW_LIGHT_PROFILE'
export interface LowLightProfileAction { type: typeof LOW_LIGHT_PROFILE }
export const lowLightProfile = (): LowLightProfileAction => ({ type: LOW_LIGHT_PROFILE })

export type KitchenAction = BrightProfileAction
| LowLightProfileAction
