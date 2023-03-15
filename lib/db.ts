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
      'CREATE TABLE IF NOT EXISTS feeds (url TEXT PRIMARY KEY NOT NULL, title TEXT, description TEXT, favicon TEXT, language TEXT, deleted INTEGER, type TEXT);'
    )
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS entries (id TEXT PRIMARY KEY NOT NULL, title TEXT, description TEXT, sourceUrl TEXT, read INTEGER, bookmarked INTEGER, published INTEGER, tags TEXT);'
    )
    onUpdated(tx)
  }, onError)
}

export async function purgeAllData() {
  const db = await openDatabase('./db/aleph.db')
  db.transaction((tx) => {
    tx.executeSql('DROP TABLE IF EXISTS feeds;')
    tx.executeSql('DROP TABLE IF EXISTS entries;')
    PubSub.publish(PubEvent.FEEDS_UPDATE, [])
    PubSub.publish(PubEvent.ENTRYFLOW_UPDATE, [])
    PubSub.publish(PubEvent.BOOKMARKS_UPDATE, [])
  }, onError)
}

export async function subFeed(feed: Feed) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO feeds (url, title, description, favicon, language, deleted, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          feed.url,
          feed.title,
          feed.description,
          feed.favicon,
          feed.language,
          0,
          'RSS',
        ]
      )
      onUpdated(tx)
    },
    onError,
    function onSuccess() {}
  )
}

export async function resubFeed(feed: Feed) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql(
        'UPDATE feeds SET deleted = 0 WHERE url = ?',
        [feed.url],
        () => {
          onUpdated(tx)
        },
        onError
      )
    },
    onError,
    function onSuccess() {}
  )
}

export async function unsubFeed(feed: Feed) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql('UPDATE feeds SET deleted = 1 WHERE url = ?', [feed.url])
      tx.executeSql(
        'DELETE FROM entries WHERE sourceUrl = ? AND bookmarked = 0',
        [feed.url],
        () => {
          onUpdated(tx)
        }
      )
    },
    onError,
    function onSuccess() {}
  )
}

export async function updateFeed(feed: Feed) {
  const db = await openDatabase('./db/aleph.db')
  db.transaction(
    (tx) => {
      tx.executeSql(
        'UPDATE feeds SET title = ?, description = ?, favicon = ? WHERE url = ?',
        [feed.title, feed.description, feed.favicon, feed.url]
      )
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
          'INSERT OR IGNORE INTO entries (id, title, description, sourceUrl, read, bookmarked, published, tags) VALUES (?,?,?,?,?,?,?,?)',
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
      onUpdated(tx)
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

function formatEntry(entry: {
  id: string
  title: string
  description: string
  sourceUrl: string
  read: number
  bookmarked: number
  published: number
  tags: string
}) {
  return {
    ...entry,
    read: entry.read === 1,
    bookmarked: entry.bookmarked === 1,
    published: dayjs.unix(entry.published).toDate(),
    tags: entry.tags ? JSON.parse(entry.tags) : [],
  }
}

function onUpdated(tx: SQLite.SQLTransaction) {
  tx.executeSql('SELECT * FROM feeds', [], (_, { rows }) => {
    PubSub.publish(
      PubEvent.FEEDS_UPDATE,
      rows._array.map((t) => {
        return {
          ...t,
          deleted: t.deleted === 1,
        }
      })
    )
  })

  tx.executeSql(
    'SELECT * FROM entries WHERE bookmarked = 1',
    [],
    (_, { rows }) => {
      PubSub.publish(PubEvent.BOOKMARKS_UPDATE, rows._array.map(formatEntry))
    }
  )

  tx.executeSql(
    'SELECT * FROM entries ORDER BY published DESC LIMIT 300',
    [],
    (_, { rows }) => {
      PubSub.publish(PubEvent.ENTRYFLOW_UPDATE, rows._array.map(formatEntry))
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
          PubSub.publish(
            PubEvent.BOOKMARKS_UPDATE,
            rows._array.map(formatEntry)
          )
        }
      )
    },
    onError,
    function onSuccess() {}
  )
}
