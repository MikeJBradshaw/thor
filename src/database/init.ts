import { Database } from 'sqlite3'
import fs from 'fs'

import config from 'configuration.json'

const logError = (err: Error) => console.error(`ERROR LOGGING DEVICE: ${err.message}\n${err.stack}`)

/**
 * Drops all tables and creates new ones
 *
 * @remarks used to init a database. WARNING: it drops all tables
 *
 * @returns void
 */
const initDatabase = (): void => {
  const { database: { type, fileName } } = config
  console.log(`Detected database type: ${type} database location: ${type === 'file' ? fileName : 'memory'}`)
  const db = new Database(type === 'file' ? fileName : ':memory:')

  console.log('DROPPING TABLES...')
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS device')
    db.run('DROP TABLE IF EXISTS event_audit')
    db.run('DROP TABLE IF EXISTS action_audit')
  })

  db.serialize(() => {
    console.log('CREATING TABLES...')
    console.log('CREATING TABLE "device"')
    db.run(
      'CREATE TABLE device (id INTEGER, friendly_name TEXT, display_name TEXT, location TEXT, type TEXT, description TEXT, ieee_address TEXT, PRIMARY KEY(id))'
    )

    console.log('CREATING TABLE "event_audit"')
    db.run('CREATE TABLE event_audit (id INTEGER, date_time TEXT, uuid TEXT, entity, TEXT, device TEXT, payload TEXT, PRIMARY KEY(id))')

    console.log('CREATING TABLE "action_audit"')
    db.run('CREATE TABLE action_audit (id INTEGER, date_time TEXT, uuid TEXT, topic TEXT, payload TEXT, PRIMARY KEY(id))')
  })

  db.serialize(() => {
    console.log('ADDING DEVICES...')
    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['property/bed_4/soil_mositure/sensor_1', 'Bed 4 Soil Moisture', 'bed 4', 'soil_moisture', 'Soil moisture sensor for bed 4', '0xa4c12866ec52b2ac'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['property/chicken_coop/temp_humidity/sensor_1', 'Chicken coop temp and humidity', 'chicken coop', 'temp_and_humidity', 'Temperature and humidty in chicken coop', '0x1c34f1fffeecdd6f'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['property/bed_5/soil_mositure/sensor_1', 'Bed 5 Soil Moisture', 'bed 5', 'soil_moisture', 'Soil moisture sensor for bed 5', '0x41c1381d2125ad62'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['property/bed_2/soil_mositure/sensor_1', 'Bed 2 Soil Moisture', 'bed_2', 'soil_moisture', 'Soil moisture sensor for bed 2', '0xa4c13829c00d5078'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['home/lola/light/light_1', 'Lola Overhead Light', 'lola', 'light', 'Light 1 for Lolas room', '0xb0ce18140015ba9a'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['home/master_bath/light/light_1', 'Master Bathroom Light', 'master_bath', 'light', 'Light 1 for master bathroom', '0xb0ce18140015b105'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['home/master_bath/motion_sensor/bathroom', 'Master Bathroom Motion Sensor', 'master_bath', 'motion_sensor', 'Motion sensor in master bathroom', '0x282c02bfffed3441'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['home/master_bath/light/light_2', 'Master Bathroom Light', 'master_bath', 'light', 'Light 2 for master bathroom', '0xb0ce18140015be41'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['home/lola/light/light_2', 'Lola Overhead Light', 'lola', 'light', 'Light 2 for Lolas room', '0xb0ce18140015ae57'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['home/laundry/motion_sensor/laundry', 'Laundry Motion Sensor', 'laundry', 'motion_sensor', 'Motion sensor in laundry room', '0x282c02bfffed39e8'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['home/laundry/light/light_1', 'Laundry Light', 'laundry', 'light', 'Light 1 in laundry room', '0xb0ce1814036753ea'],
      (err) => err !== null ? logError(err) : ''
    )

    db.run(
      'INSERT INTO device(friendly_name, display_name, location, type, description, ieee_address) VALUES(?, ?, ?, ?, ?, ?)',
      ['home/laundry/light/light_2', 'Laundry Light', 'laundry', 'light', 'Light 2 in laundry room', '0xb0ce18140367646d'],
      (err) => err !== null ? logError(err) : ''
    )
  })
  console.log('DONE')
  db.close()
}

if (require.main === module) {
  initDatabase()
}
