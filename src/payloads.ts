export interface Button {
  action: 'single' | 'double' | 'hold' | 'release' | 'init'
  battery: number
  linkquality: number
}

export interface MotionSensor {
  occupancy: boolean
  batteryLow: boolean
  battery: number
}

export interface SoilMoistureAndTemperature {
  battery: number
  batteryState: string
  linkQuality: number
  soilMoisture: number
  temperature: number
}

export interface TemperatureAndHumdity {
  battery: number
  humidity: number
  linkQuality: number
  temperature: number
}


