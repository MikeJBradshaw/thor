export interface ButtonPayload {
  action: string
  battery: number
  linkquality: number
}

export interface MotionSensorPayload {
  occupancy: boolean
  batteryLow: boolean
  battery: number
}

export interface SoilMoistureAndTemperaturePayload {
  battery: number
  batteryState: string
  linkQuality: number
  soilMoisture: number
  temperature: number
}

export interface TemperatureAndHumdityPayload {
  battery: number
  humidity: number
  linkQuality: number
  temperature: number
}

export interface Action {
  path: string
  payload: any
}

interface Color {
  hex: string
}

export interface LightPayload {
  brightness: number
  color?: Color
  color_temp?: 'warmest' | 'warm' | 'neutral' | 'cool' | 'coolest',
  transition?: number
}

export interface PowerPayload {
  state: 'ON' | 'OFF'
  power_on_behavior?: 'off' | 'on' | 'toggle'
}
