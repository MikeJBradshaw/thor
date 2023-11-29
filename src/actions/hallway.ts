export const HALLWAY_NORTH_LIGHTS_GROUP = 'hallway-north-lights'
export const HALLWAY_SOUTH_LIGHTS_GROUP = 'hallway-south-lights'
export const HALLWAY_ALL_LIGHTS_GROUP = 'hallway-all-lights'

export const WS_NORTH_LIGHTS_OFF = 'HALLWAY_WS_NORTH_LIGHTS_OFF'
export interface WSNorthLightsOff { type: typeof WS_NORTH_LIGHTS_OFF }
export const wsNorthLightsOff = (): WSNorthLightsOff => ({ type: WS_NORTH_LIGHTS_OFF })

export const WS_NORTH_LIGHTS_ON = 'HALLWAY_WS_NORTH_LIGHTS_ON'
export interface WSNorthLightsOn { type: typeof WS_NORTH_LIGHTS_ON }
export const wsNorthLightsOn = (): WSNorthLightsOn => ({ type: WS_NORTH_LIGHTS_ON })

export const WS_SOUTH_LIGHTS_OFF = 'HALLWAY_WS_SOUTH_LIGHTS_OFF'
export interface WSSouthLightsOff { type: typeof WS_SOUTH_LIGHTS_OFF }
export const wsSouthLightsOff = (): WSSouthLightsOff => ({ type: WS_SOUTH_LIGHTS_OFF })

export const WS_SOUTH_LIGHTS_ON = 'HALLWAY_WS_SOUTH_LIGHTS_ON'
export interface WSSouthLightsOn { type: typeof WS_SOUTH_LIGHTS_ON }
export const wsSouthLightsOn = (): WSSouthLightsOn => ({ type: WS_SOUTH_LIGHTS_ON })

export type HallwayActions = WSNorthLightsOff
| WSNorthLightsOn
| WSSouthLightsOff
| WSSouthLightsOn
