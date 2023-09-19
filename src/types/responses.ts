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
