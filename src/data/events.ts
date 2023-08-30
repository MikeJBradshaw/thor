export interface BridgeMessageDevicesEvent {
  ieee_address: string
  friendly_name: string
  description: string
}

export interface MqttSubscriptionEvent {
  topic: string
  entity: string
  device: string
  payload: any
}

interface TemperatureAndHumdity {
  battery: number
  humidity: number
  linkQuality: number
  temperature: number
}

export interface TemperatureHumidityEvent extends MqttSubscriptionEvent {
  payload: TemperatureAndHumdity
}

interface SoilMoistureAndTemperature {
  battery: number
  batteryState: string
  linkQuality: number
  soilMoisture: number
  temperature: number
}

export interface SoilMoistureAndTemperatureEvent extends MqttSubscriptionEvent {
  payload: SoilMoistureAndTemperature
}

interface MotionSensor {
  occupancy: boolean
  batteryLow: boolean
  battery: number
}

export interface MotionSensorEvent extends MqttSubscriptionEvent {
  payload: MotionSensor
}
