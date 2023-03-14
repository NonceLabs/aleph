export interface FeedEntry {
  id: string
  link?: string
  title?: string
  description?: string
  published?: Date
  sourceUrl?: string
  read?: boolean
  bookmarked?: boolean
  tags?: (string | CustomTag)[]
}

export interface FeedData {
  link?: string
  url?: string
  title?: string
  description?: string
  generator?: string
  language?: string
  favicon?: string
  published?: Date
  entries?: Array<FeedEntry>
}

export interface ProxyConfig {
  target?: string
  headers?: any
}

export interface ReaderOptions {
  /**
   * normalize feed data or keep original
   * default: true
   */
  normalization?: boolean
  /**
   * convert datetime to ISO format
   * default: true
   */
  useISODateFormat?: boolean
  /**
   * to truncate description
   * default: 210
   */
  descriptionMaxLen?: number
  /**
   * fast-xml-parser options
   * https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md
   */
  xmlParserOptions?: any
  /**
   * merge extra feed fields in result
   */
  getExtraFeedFields?: (feedData: object) => object
  /**
   * merge extra entry fields in result
   */
  getExtraEntryFields?: (entryData: object) => object
}

export interface FetchOptions {
  //  Definitions by: Ryan Graham <https://github.com/ryan-codingintrigue>
  method?:
    | 'GET'
    | 'POST'
    | 'DELETE'
    | 'PATCH'
    | 'PUT'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
  headers?: any
  body?: any
  mode?: 'cors' | 'no-cors' | 'same-origin'
  credentials?: 'omit' | 'same-origin' | 'include'
  cache?:
    | 'default'
    | 'no-store'
    | 'reload'
    | 'no-cache'
    | 'force-cache'
    | 'only-if-cached'
  redirect?: 'follow' | 'error' | 'manual'
  referrer?: string
  referrerPolicy?:
    | 'referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'unsafe-url'
  integrity?: any
  proxy?: ProxyConfig
}

export interface Source {
  title: string
  description: string
  url: string
  link?: string
  favicon?: string
  id?: string
  language?: string
}

export interface Feed {
  url: string
  title: string
  description: string
  language: string
  favicon: string
  deleted?: boolean
}

export interface Tag {
  title: string
  icon: any
  count: number
}

export interface CustomTag {
  title: string
  createdAt: Date
}

export type FeedListType = 'flow' | 'bookmarks' | 'tags'

export enum FeedPublishLimit {
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}

export enum PubEvent {
  FEEDS_UPDATE = 'FEEDS_UPDATE',
  ENTRYFLOW_UPDATE = 'ENTRYFLOW_UPDATE',
  BOOKMARKS_UPDATE = 'BOOKMARKS_UPDATE',
  TAGS_UPDATE = 'TAGS_UPDATE',
  ENTRIES_UPDATE = 'ENTRIES_UPDATE',
}
