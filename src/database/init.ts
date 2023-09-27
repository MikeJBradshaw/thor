import { Database } from 'sqlite3'
import { load } from 'js-yaml'
import { Client } from 'node-scp'
import { readFileSync } from 'fs'

import { ENTITIES, PRODUCTION, TEST } from 'consts'
import type { Z2mConfigYaml } from 'types/external'
import config from 'configuration.json'

const TMP_CONFIG_FILE = 'config.tmp.yaml'

const logError = (err: Error): void => console.error(`ERROR LOGGING DEVICE: ${err.message}`)

/**
 * Drops all tables and creates new ones
 *
 * @remarks used to init a database. WARNING: it drops all tables
 *
 * @returns void
 */
const initDatabase = (z2mConfig: string): void => {
  const { database: { type, fileName } } = config
  console.log(`Detected database type: ${type} database location: ${type === 'file' ? fileName : 'memory'}`)
  const db = new Database(type === 'file' ? fileName : ':memory:')

  console.log('READING ZIGBEE2MQTT CONFIG...')

  console.log('DROPPING TABLES...')
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS entity')
    db.run('DROP TABLE IF EXISTS device')
    db.run('DROP TABLE IF EXISTS entity_device')
    db.run('DROP TABLE IF EXISTS transition')
  })

  db.serialize(() => {
    console.log('CREATING TABLES...')
    console.log('CREATING TABLE "entity"')
    db.run('CREATE TABLE entity (id INTEGER, name TEXT UNIQUE NOT NULL, key TEXT UNIQUE NOT NULL, PRIMARY KEY(id))')

    console.log('CREATING TABLE "device"')
    db.run('CREATE TABLE device (id INTEGER, friendly_name TEXT UNIQUE, display_name TEXT, description TEXT, ieee_address TEXT UNIQUE NOT NULL, PRIMARY KEY(id))')

    console.log('CREATING TABLE "entity_device"')
    db.run('CREATE TABLE entity_device (id INTEGER, entity_id INTEGER, device_id INTEGER, FOREIGN KEY (entity_id) REFERENCES entity(id), FOREIGN KEY (device_id) REFERENCES device(id), PRIMARY KEY(id))')

    console.log('CREATING TABLE "transition"')
    db.run('CREATE TABLE state (id: INTEGER, device_id INTEGER, start_time INTEGER, duration INTEGER, end_time INTEGER), PRIMARY KEY(id), FOREIGN KEY (device_id) REFERENCES device(id)')
  })

  db.serialize(() => {
    console.log('ADDING ENTITIES...')
    for (const entity of ENTITIES) {
      console.log(' entity:', entity)
      const name = entity.replace('_', ' ').toUpperCase()
      db.run('INSERT INTO entity(name, key) VALUES (?, ?)', [name, entity], err => err !== null ? logError(err) : () => {})
    }
  })

  console.log('GETTING DEVICE INFO FROM CONFIG FILE...')
  const configDoc = load(readFileSync(z2mConfig, 'utf-8')) as Z2mConfigYaml
  const devices = configDoc.devices

  console.log('ADDING DEVICES...')
  db.serialize(() => {
    for (const [ieeeAddress, deviceInfo] of Object.entries(devices)) {
      const [_, entity, type, __] = deviceInfo.friendly_name.split('/')
      if (entity === undefined || type === undefined) {
        continue
      }

      console.log(' device:', deviceInfo.friendly_name)
      db.run(
        'INSERT INTO device(friendly_name, display_name, description, ieee_address) VALUES (?, ?, ?, ?)',
        [deviceInfo.friendly_name, deviceInfo.display_name, deviceInfo.description, ieeeAddress],
        function (err: Error) {
          if (err !== null) {
            logError(err)
            return
          }
          return this.lastID
        }
      )

      const entityIndex = ENTITIES.indexOf(entity) + 1
      db.run(
        'INSERT INTO entity_device(device_id, entity_id) VALUES(last_insert_rowid(), ?)',
        [entityIndex],
        (err: Error) => err !== null ? logError(err) : () => { }
      )
    }
  })

  console.log('DONE')
  db.close()
}

const LEVEL = process.env.level
const PRIVATE_KEY_PATH = process.env.private_key_path
if (LEVEL !== PRODUCTION && LEVEL !== TEST) {
  console.error(`Level was not set or not recognized. Set level to "${PRODUCTION}" or "${TEST}" and retry.`)
  process.exit(-1)
}

if (PRIVATE_KEY_PATH === undefined || PRIVATE_KEY_PATH === '') {
  console.error('Private key path not found. Set "private_key_path" and retry.')
  process.exit(-1)
}

(async () => {
  try {
    if (LEVEL === 'test') {
      const scpClient = await Client({
        host: '10.243.31.95',
        port: 22,
        username: 'mike',
        privateKey: readFileSync(PRIVATE_KEY_PATH)
      })
      await scpClient.downloadFile(config.z2mConfigLocation, TMP_CONFIG_FILE)
      scpClient.close()
    }
  } catch (err) {
    console.error(err)
  }

  initDatabase(LEVEL === PRODUCTION ? config.z2mConfigLocation : TMP_CONFIG_FILE)
})().catch(e => console.error(e))
