import { connect } from 'mqtt'

const client = connect('mqtt://localhost:1883')

const RED = '#ff0000'
const WHITE = '#FFFFFF'
const YELLOW = '#FFFF00'
const HOT_PINK = '#FF69B4'

const LOLA = 'z2m/home/lola/light/overhead_light'
const MASTER_LIGHT_1 = 'z2m/home/master_bath/light/light_1'
const MASTER_LIGHT_2 = 'z2m/home/master_bath/light/light_2'

client.on('connect', () => {
  client.publish(
    `${'z2m/0xb0ce18140015ae57'}/set`,
    JSON.stringify({
      color: { hex: `${HOT_PINK}` },
      // color_temp: 'neutral',
      brightness: 255,
      state: 'on'
    }),
    () => {
      console.log('complete')
      client.end()
    }
  )
})
