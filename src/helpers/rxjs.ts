import { filter } from 'rxjs/operators'
import { Database } from 'sqlite3'
import { of } from 'rxjs'
import type { Observable } from 'rxjs'
import type { MqttSubscriptionEvent } from 'data/events'

import config from 'configuration.json'

export const ofEvent = <T = MqttSubscriptionEvent>(
  entity: string,
  device: string
) => (source: Observable<T>): typeof source => source.pipe(
  filter(({ device: dev, entity: ent }: any) => ent === entity && dev === device)
)

// database global client object
let db: Database

export const withDatabase = (): Observable<Database> => {
  if (db !== undefined) { return of(db) }

  const { type, fileName } = config.database
  db = new Database(type === 'file' ? fileName : ':memory:')
  return of(db)
}
