import * as FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite'
import { Feed, FeedEntry, PubEvent } from '../types'
import dayjs from 'dayjs'

interface SQLiteUpdateOption {
  isUpdate?: boolean
}

async function openDatabase(
  pathToDatabaseFile: string
): Promise<SQLite.WebSQLDatabase> {
  if (
    !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite'))
      .exists
  ) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite')
  }
  // await FileSystem.downloadAsync(
  //   Asset.fromModule(require(pathToDatabaseFile)).uri,
  //   FileSystem.documentDirectory + 'SQLite/aleph.db'
  // )
  return SQLite.openDatabase('aleph.db')
}

function onError(error: SQLite.SQLError) {
  console.log('Error: ', error)
}

export async function initSQLite() {
  const db = await openDatabase('./db/aleph.db')
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS feeds (url TEXT PRIMARY KEY NOT NULL, title TEXT, description TEXT, favicon TEXT, language TEXT, deleted INTEGER);'
    )
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS entries (id TEXT PRIMARY KEY NOT NULL, title TEXT, description TEXT, sourceUrl TEXT, read INTEGER, bookmarked INTEGER, published INTEGER, tags TEXT);'
    )
    onUpdated(tx)
  }, onError)
}

export async function createFeed(feed: Feed) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO feeds (url, title, description, favicon, language) VALUES (?, ?, ?, ?, ?, ?)',
        [feed.url, feed.title, feed.description, feed.favicon, feed.language, 0]
      )
    },
    onError,
    function onSuccess() {}
  )
}

export async function deleteFeed(feed: Feed) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql('UPDATE feeds deleted = 1 WHERE id = ?', [feed.url])
      tx.executeSql(
        'DELETE FROM entries WHERE sourceUrl = ? AND bookmarked = 0',
        [feed.url]
      )
      onUpdated(tx)
    },
    onError,
    function onSuccess() {}
  )
}

export async function updateFeed(feed: Feed) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql('UPDATE feeds title = ? WHERE id = ?', [
        feed.title,
        feed.url,
      ])
    },
    onError,
    function onSuccess() {}
  )
}

export async function markAllRead() {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql('UPDATE entries SET read = 1', [])
    },
    onError,
    function onSuccess() {}
  )
}

export async function readEntries(entries: FeedEntry[]) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      for (const entry of entries) {
        tx.executeSql('UPDATE entries SET read = 1 WHERE id = ?', [entry.id])
      }
    },
    onError,
    function onSuccess() {}
  )
}

export async function createEntries(entries: FeedEntry[]) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      for (const entry of entries) {
        tx.executeSql(
          'INSERT INTO entries (id, title, description, sourceUrl, read, bookmarked, published, tags) VALUES (?,?,?,?,?,?,?,?)',
          [
            entry.id,
            entry.title || '',
            entry.description || '',
            entry.sourceUrl || '',
            0,
            0,
            dayjs(entry.published).unix(),
            JSON.stringify(entry.tags),
          ]
        )
      }
    },
    onError,
    function onSuccess() {}
  )
}

export async function updateEntries(entries: FeedEntry[]) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      for (const entry of entries) {
        tx.executeSql(
          'UPDATE entries SET read = ?, bookmarked = ?, published = ?, tags = ? WHERE id = ?',
          [
            entry.read ? 1 : 0,
            entry.bookmarked ? 1 : 0,
            dayjs(entry.published).unix(),
            JSON.stringify(entry.tags),
            entry.id,
          ]
        )
      }
    },
    onError,
    function onSuccess() {}
  )
}

function onUpdated(tx: SQLite.SQLTransaction) {
  tx.executeSql('SELECT * FROM feeds', [], (_, { rows }) => {
    PubSub.publish(PubEvent.FEEDS_UPDATE, rows._array)
  })

  tx.executeSql(
    'SELECT * FROM entries WHERE bookmarked = 1',
    [],
    (_, { rows }) => {
      PubSub.publish(PubEvent.BOOKMARKS_UPDATE, rows._array)
    }
  )

  tx.executeSql(
    'SELECT * FROM entries ORDER BY published DESC LIMIT 300',
    [],
    (_, { rows }) => {
      PubSub.publish(PubEvent.ENTRIES_UPDATE, rows._array)
    }
  )
}

export async function getFeeds(callback: (rows: Feed[]) => void) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql('SELECT * FROM feeds', [], (_, { rows }) => {
        // callback(rows)
      })
    },
    onError,
    function onSuccess() {}
  )
}

export async function getEntries() {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql('SELECT * FROM entries', [], (_, { rows }) => {})
      // tx.executeSql('SELECT * FROM feeds', [], (_, { rows }) =>
      //   console.log(JSON.stringify(rows))
      // )
    },
    onError,
    function onSuccess() {}
  )
}

export async function getBookmarkedEntries() {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql(
        'SELECT * FROM entries WHERE bookmarked = 1',
        [],
        (_, { rows }) => {
          // bookmarked
        }
      )
    },
    onError,
    function onSuccess() {}
  )
}
