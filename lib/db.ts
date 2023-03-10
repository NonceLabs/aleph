import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import * as SQLite from 'expo-sqlite'

async function openDatabase(
  pathToDatabaseFile: string
): Promise<SQLite.WebSQLDatabase> {
  if (
    !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite'))
      .exists
  ) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite')
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require(pathToDatabaseFile)).uri,
    FileSystem.documentDirectory + 'SQLite/aleph.db'
  )
  return SQLite.openDatabase('aleph.db')
}
