interface Action {
  type: string
  topics: string[]
  payload: any
}

interface PlugPowerPayload { state: 'on' | 'off', powerOnBehavior?: 'on' | 'off' | 'previous' }
export const PLUG_POWER_ACTION = 'PLUG_POWER_ACTION'
export interface PlugPowerAction extends Action { payload: PlugPowerPayload}
export const plugPower = (
  topics: string[],
  payload: PlugPowerPayload
): PlugPowerAction => ({ type: PLUG_POWER_ACTION, topics, payload })

interface LightOnPayload { brightness: number, color?: { hex: string }, color_temp?: string }
export const LIGHT_ON = 'LIGHT_ON'
export interface LightOnAction extends Action { payload: LightOnPayload }
export const lightOn = (
  topics: string[],
  payload: LightOnPayload
): LightOnAction => ({ type: LIGHT_ON, topics, payload })

interface LightOffPayload { state: 'ON' | 'OFF' }
export const LIGHT_OFF = 'LIGHT_OFF'
export interface LightOffAction extends Action { payload: LightOffPayload }
export const lightOff = (
  topics: string[],
  payload: LightOffPayload
): LightOffAction => ({ type: LIGHT_OFF, topics, payload })

// TODO: this is internal stuff
// export interface BatteryWarningAction {
//   type: typeof BATTERY_WARNING
//   batteryLevel: number
//   entity: string
//   device: string
// }
// export const batteryWarning = (
//   batteryLevel: number,
//   entity: string,
//   device: string
// ): BatteryWarningAction => ({ type: BATTERY_WARNING, batteryLevel, entity, device })

// export const BATTERY_CRITICAL = 'BATTERY_CRITICAL'
// export interface BatteryCriticalAction {
//   type: typeof BATTERY_CRITICAL
//   batteryLevel: number
//   entity: string
//   device: string
// }
// export const batteryCritical = (
//   batteryLevel: number,
//   entity: string,
//   device: string
// ): BatteryCriticalAction => ({ type: BATTERY_CRITICAL, batteryLevel, entity, device })

// export const WATER_ON = 'WATER_ON'
// export interface WaterOnAction { type: typeof WATER_ON, devices: string[] }
// export const waterOn = (devices: string[]): WaterOnAction => ({ type: WATER_ON, devices })

// export const WATER_OFF = 'WATER_OFF'
// export interface WaterOffAction { type: typeof WATER_OFF, devices: string[] }
// export const waterOff = (devices: string[]): WaterOffAction => ({ type: WATER_OFF, devices })

