import { Database } from 'sqlite3'
import { of } from 'rxjs'
import type { Observable } from 'rxjs'

import config from 'configuration.json'

// database global client object
let db: Database

export const withDatabase = (): Observable<Database> => {
  if (db !== undefined) { return of(db) }

  const { type, fileName } = config.database
  db = new Database(type === 'file' ? fileName : ':memory:')
  return of(db)
}
