const sqlite3 = require('sqlite3')

class DBEngine {
  constructor (dbPath) {
    this.dbPath = dbPath
  }

  async engine () {
    if (this.db) {
      return Promise.resolve(this.db)
    }

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          return reject(err)
        }

        resolve(this.db)
      })
    })
  }

  async run (query, params = []) {
    const db = await this.engine()

    return new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) {
          return reject(err)
        }

        resolve(this.lastID)
      })
    })
  }

  async get (query, params = []) {
    const db = await this.engine()

    return new Promise((resolve, reject) => {
      db.get(query, params, function (err, row) {
        if (err) {
          return reject(err)
        }

        resolve(row)
      })
    })
  }

  async all (query, params = []) {
    const db = await this.engine()

    return new Promise((resolve, reject) => {
      db.all(query, params, function (err, rows) {
        if (err) {
          return reject(err)
        }

        resolve(rows)
      })
    })
  }

  close () {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db.close(err => {
          if (err) {
            return reject(err)
          }

          resolve()
        })
      })
    }

    return Promise.resolve()
  }
}

module.exports = { DBEngine }
