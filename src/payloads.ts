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

export enum ButtonState {
  Default = 'default',
  Single = 'single',
  Double = 'double',
  Hold = 'hold',
  Release = 'release'
}

