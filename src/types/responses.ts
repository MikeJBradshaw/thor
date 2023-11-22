interface MeteoCurrentUnits {
  time: string
  interval: string
  apparent_temperature: string
  precipitation: string
  weather_code: string
}

interface MeteoCurrent {
  time: number
  interval: number
  apparent_temperature: number
  precipitation: number
  weather_code: number
}

interface MeteoDailyUnits {
  time: string
  weather_code: string
  apparent_temperature_max: string
  apparent_temperature_min: string
  precipitation_probability_max: string
}

export interface MeteoDaily {
  time: number[]
  weather_code: number[]
  apparent_temperature_max: number[]
  apparent_temperature_min: number[]
  precipitation_probability_max: number[]
}

interface MeteoHourlyUnits {
  time: string
  apparent_temperature: string
  precipitation_probability: string
  precipitation: string
  weather_code: string
}

export interface MeteoHourly {
  time: number[]
  apparent_temperature: number[]
  precipitation_probability: number[]
  precipitation: number[]
  weather_code: number[]
}

export interface MeteoForecastResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: MeteoCurrentUnits
  current: MeteoCurrent
  hourly_units: MeteoHourlyUnits
  hourly: MeteoHourly
  daily_units: MeteoDailyUnits
  daily: MeteoDaily
}

interface SunDataResults {
  sunrise: string
  sunset: string
  solar_noon: string
  civil_twilight_begin: string
  civil_twilight_end: string
}

export interface SunriseSunsetResponse {
  status: string
  results: SunDataResults
}
