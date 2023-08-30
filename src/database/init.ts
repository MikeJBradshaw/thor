import { Database } from 'sqlite3'
import { connect } from 'mqtt'

import type { BridgeMessageDevicesEvent } from 'data/events'
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

    console.log('ALL TABLES CREATED, FINDING ANY ALREADY CONNECTED DEVICES...')
  })
  const client = connect('mqtt://localhost:1883')
  client.subscribe('z2m/bridge/devices', (err) => {
    if (err !== null) {
      console.error(err)
    }

    client.on('message', (topic, buffer) => {
      const message: BridgeMessageDevicesEvent[] = JSON.parse(buffer.toString())
      db.serialize(() => {
        for (const device of message) {
          console.log(`INSERTING DEVICE ${device.ieee_address}`)
          db.run(
            'INSERT INTO device(ieee_address, friendly_name, description) VALUES (?, ?, ?)',
            [device.ieee_address, device.friendly_name, device.description],
            (err) => console.error(err)
          )
        }
      })
    })
    client.end()
  })

  db.close()
}

if (require.main === module) {
  initDatabase()
}
