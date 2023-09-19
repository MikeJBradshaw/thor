import type { Action, LightPayload, PowerPayload } from 'types/payloads'

export const LIGHT_ON_PUBLISH = 'CLIENT_LIGHT_ON'
export interface LightOnPublish extends Action { type: typeof LIGHT_ON_PUBLISH, payload: LightPayload }
export const lightOnPublish = (
  path: string,
  payload: LightPayload
): LightOnPublish => ({ type: LIGHT_ON_PUBLISH, path, payload })

export const POWER_ON = 'POWER_ON'
export interface PowerOn { type: typeof POWER_ON, path: string, payload: PowerPayload }
export const powerOn = (path: string, payload: PowerPayload): PowerOn => ({ type: POWER_ON, path, payload })

export const POWER_OFF = 'POWER_OFF'
export interface PowerOff { type: typeof POWER_OFF, path: string, payload: PowerPayload }
export const powerOff = (path: string, payload: PowerPayload): PowerOff => ({ type: POWER_OFF, path, payload })

export const NOOP = 'CLIENT_NOOP'
export interface Noop { type: typeof NOOP }
export const noop = (): Noop => ({ type: NOOP })

export type MqttClientAction = LightOnPublish
| Noop
| PowerOn
| PowerOff
