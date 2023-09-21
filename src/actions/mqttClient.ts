import { BRIGHTNESS_OFF } from 'consts'
import type { Action, LightPayload, PowerPayload } from 'types/payloads'

export const LIGHT_ON = 'CLIENT_LIGHT_ON'
export interface LightOn extends Action { type: typeof LIGHT_ON, payload: LightPayload }
export const lightOn = (
  path: string,
  payload: LightPayload
): LightOn => ({ type: LIGHT_ON, path, payload })

export const LIGHT_OFF = 'CLIENT_LIGHT_OFF'
export interface LightOff extends Action { type: typeof LIGHT_OFF, payload: LightPayload }
export const lightOff = (
  path: string,
  transition = 0
): LightOff => ({ type: LIGHT_OFF, path, payload: { brightness: BRIGHTNESS_OFF, transition } })

export const POWER_ON = 'POWER_ON'
export interface PowerOn { type: typeof POWER_ON, path: string, payload: PowerPayload }
export const powerOn = (path: string): PowerOn => ({ type: POWER_ON, path, payload: { state: 'ON' } })

export const POWER_OFF = 'POWER_OFF'
export interface PowerOff { type: typeof POWER_OFF, path: string, payload: PowerPayload }
export const powerOff = (path: string): PowerOff => ({ type: POWER_OFF, path, payload: { state: 'OFF', power_on_behavior: 'on' } })

export const NOOP = 'CLIENT_NOOP'
export interface Noop { type: typeof NOOP }
export const noop = (): Noop => ({ type: NOOP })

export type MqttClientAction = LightOn
| LightOff
| Noop
| PowerOn
| PowerOff
