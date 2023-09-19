interface MqttYaml {
  base_topic: string
  server: string
}

interface AdvancedOptions {
  legacy_availability_payload: boolean
}

interface DeviceDetails {
  friendly_name: string
  description?: string
  display_name?: string
  debounce?: number
  advanced?: AdvancedOptions
}

interface DevicesYaml {
  [ieeAddress: string]: DeviceDetails
}

export interface Z2mConfigYaml {
  homeassistant: boolean
  mqtt: MqttYaml
  devices: DevicesYaml
}
