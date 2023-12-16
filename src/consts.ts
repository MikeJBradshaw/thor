/********************************
 * app - routing
 * *****************************/
// entities
export const BED_TWO = 'bed_2'
export const BED_FOUR = 'bed_4'
export const BED_FIVE = 'bed_5'
export const BEDROOM_ONE = 'bedroom_1'
export const CHICKEN_COOP = 'chicken_coop'
export const GUEST_BATH = 'guest_bath'
export const KITCHEN = 'kitchen'
export const LAUNDRY = 'laundry'
export const LIVING_ROOM = 'living_room'
export const MASTER_BATH = 'master_bath'

export const ENTITIES = [
  BED_TWO,
  BED_FOUR,
  BED_FIVE,
  BEDROOM_ONE,
  CHICKEN_COOP,
  GUEST_BATH,
  KITCHEN,
  LAUNDRY,
  LIVING_ROOM,
  MASTER_BATH
]

export const FRONT_END_SUPPORTED_ENTITIES = [
  'master-bath',
  'bedroom-one',
  'guest-bath'
]

// devices
export const BUTTON = 'button'
export const MOTION_SENSOR = 'motion_sensor'
export const TEMP_HUMIDITY = 'temp_humidity'

/******************************
 * app - env
 * ***************************/
export const PRODUCTION = 'production'
export const TEST = 'test'

/*****************************
* time
* ***************************/
export const DAY_END = '19:30:00'
export const DAY_START = '06:45:00'
export const HOURS_24_IN_MSEC = 86400000
export const MINUTES_1_IN_MSEC = 60000
export const MINUTES_2_IN_MSEC = 120000
export const MINUTES_5_IN_MSEC = 300000
export const MINUTES_10_IN_MSEC = 600000
export const MINUTES_20_IN_MSEC = 1200000
export const MINUTES_60_IN_MSEC = 3600000
export const MINUTES_15_IN_SEC = 900
export const MINUTES_30_IN_SEC = 1800
export const MINUTES_60_IN_SEC = 3600
export const SECONDS_1_POINT_5 = 1.5
export const SECONDS_2 = 2
export const SECONDS_5 = 5
export const SECONDS_6_IN_MSEC = 6000
export const SECONDS_2_IN_MSEC = 12000
export const NETWORK_NO_RESPONSE_TIMEOUT = 1000 * 60 * 6

/*****************************
* external APIs
*****************************/
export const SUNRISE_SUNSET_API = 'https://api.sunrise-sunset.org'
export const METEO_URL = 'https://api.open-meteo.com/v1/forecast?latitude=39.1097&longitude=-95.0877&current=apparent_temperature,precipitation,weather_code&hourly=apparent_temperature,precipitation_probability,precipitation,weather_code&daily=weather_code,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FChicago&forecast_days=3'

/*****************************
 * general
 * **************************/
export const BUTTON_STATE_SINGLE = 'single'
export const BUTTON_STATE_DOUBLE = 'double'
export const BUTTON_STATE_HOLD = 'hold'
export const BUTTON_STATE_RELEASE = 'release'

export const ROOM_STATE_DEFAULT = 'default'
export const ROOM_STATE_SINGLE = 'single'
export const ROOM_STATE_DOUBLE = 'double'

/*****************************
 * weather
 * **************************/
export const WARNING_WEATHER_CODES = [65, 66, 67, 73, 75, 82, 95]
export const PING_NOAA_WEATHER_CODES = [56, 57, 66, 67, 73, 75, 81, 82, 95]

/*****************************
 * light colors
 * **************************/
export const BRIGHTNESS_HIGH = 255
export const BRIGHTNESS_LOW = 15
export const BRIGHTNESS_VERY_LOW = 5
export const BRIGHTNESS_1 = 1
export const BRIGHTNESS_OFF = 0

export const COLOR_TEMP_COOLEST = 'coolest'
export const COLOR_TEMP_COOL = 'cool'
export const COLOR_TEMP_NEUTRAL = 'neutral'
export const COLOR_TEMP_WARM = 'warm'
export const COLOR_TEMP_WARMEST = 'warmest'
export const COLOR_HOT_PINK = '#FF69B4'
export const COLOR_RED_HEX = '#FF0000'
export const COLOR_ORANGE_HEX = '#FFA500'
export const COLOR_YELLOW_HEX = '#FFFF00'
export const COLOR_GREEN_HEX = '#008000'
export const COLOR_BLUE_HEX = '#0000FF'
export const COLOR_INDIGO_HEX = '#4B0082'
export const COLOR_VIOLET_HEX = '#7F00FF'

export const RAINBOW_COLORS = [
  COLOR_RED_HEX,
  COLOR_ORANGE_HEX,
  COLOR_YELLOW_HEX,
  COLOR_GREEN_HEX,
  COLOR_BLUE_HEX,
  COLOR_INDIGO_HEX,
  COLOR_VIOLET_HEX
]
