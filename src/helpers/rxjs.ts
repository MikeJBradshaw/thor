import { filter } from 'rxjs/operators'
import { Database } from 'sqlite3'
import { of } from 'rxjs'
import type { Observable } from 'rxjs'
import type { MqttSubscriptionEvent } from 'data/events'

import config from 'configuration.json'

interface OfEventData {
  [key: string]: string[]
}
export const ofEvent = <T = MqttSubscriptionEvent>(
  events: OfEventData
) => (source: Observable<T>): typeof source => source.pipe(
  filter(({ entity, device }: any) => events[entity]?.includes(device))
)

// database global client object
let db: Database

export const withDatabase = (): Observable<Database> => {
  if (db !== undefined) { return of(db) }

  const { type, fileName } = config.database
  db = new Database(type === 'file' ? fileName : ':memory:')
  return of(db)
}
