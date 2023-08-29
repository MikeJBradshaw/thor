import { Database } from 'sqlite3'

import config from 'configuration.json'

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

  console.log('DROPPING TABLES ...')
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS device')
    db.run('DROP TABLE IF EXISTS soil_moisture_history')
    db.run('DROP TABLE IF EXISTS temp_himidity_history')
  })

  db.serialize(() => {
    console.log('CREATING TABLE "device"')
    db.run('CREATE TABLE device (id INTEGER, friendly_name TEXT, entity TEXT, PRIMARY KEY(id))')

    // console.log('CREATING TABLE "global_setting"')
    // db.run('CREATE TABLE global_setting')

    console.log('CREATING TABLE "soil_moisture_history"')
    db.run('CREATE TABLE soil_moisture_history (id INTEGER, device_id INTEGER, date DATE_TIME, soil_moisture INTEGER, soil_temp FLOAT, PRIMARY KEY(id), FOREIGN KEY(device_id) REFERENCES device(id))')

    console.log('CREATING TABLE "temp_humidity_history"')
    db.run('CREATE TABLE temp_himidity_history (id INTEGER, device_id INTEGER, date DATE_TIME, humidity INTEGER, temp FLOAT, PRIMARY KEY(id), FOREIGN KEY(device_id) REFERENCES device(device_id))')

    console.log('ALL TABLES CREATED...')
  })
  db.close()
}

if (require.main === module) {
  initDatabase()
}
