interface Action {
  path: string
  payload: any
}

interface Color {
  hex: string
}

interface LightPayload {
  brightness: number
  color?: Color
  color_temp?: 'warmest' | 'warm' | 'neutral' | 'cool' | 'coolest'
}
export const LIGHT_ON_PUBLISH = 'CLIENT_LIGHT_ON'
export interface LightOnPublish extends Action { type: typeof LIGHT_ON_PUBLISH, payload: LightPayload }
export const lightOnPublish = (
  path: string,
  payload: LightPayload
): LightOnPublish => ({ type: LIGHT_ON_PUBLISH, path, payload })

export const NOOP = 'CLIENT_NOOP'
export interface Noop { type: typeof NOOP }
export const noop = (): Noop => ({ type: NOOP })

export type MqttClientAction = LightOnPublish
| Noop
