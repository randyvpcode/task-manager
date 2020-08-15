import PouchyStore from 'pouchy-store'
import {
  COUCHDB_URL,
  COUCHDB_USERNAME,
  COUCHDB_PASSWORD,
} from '../utils/globals'

class TasksStore extends PouchyStore {
  get name() {
    return this._name
  }

  setName(dbName) {
    this._name = dbName
  }

  get urlRemote() {
    return COUCHDB_URL
  }

  get optionsRemote() {
    return {
      auth: {
        username: COUCHDB_USERNAME,
        password: COUCHDB_PASSWORD,
      },
    }
  }

  sortData(data) {
    data.sort((one, two) => {
      const oneTs = one.createdAt
      const twoTs = two.createdAt
      if (oneTs > twoTs) return -1
      if (oneTs < twoTs) return 1
      return 0
    })
  }
}

export default new TasksStore()
