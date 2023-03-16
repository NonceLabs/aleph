export enum FeedType {
  RSS = 'RSS',
  Podcast = 'Podcast',
}

export interface Feed {
  url: string
  title: string
  description: string
  language: string
  favicon: string
  deleted?: boolean
  type?: FeedType
}

export interface FeedEntry {
  id: string
  link: string
  title: string
  description: string
  published: Date
  feedUrl: string
  read?: boolean
  bookmarked?: boolean
  tags: string[]
  entryType: FeedType
  media?: string
  cover?: string
}

export interface FeedData {
  feed: Feed
  entries: FeedEntry[]
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

export type FeedListType = 'flow' | 'bookmarks' | 'tags' | 'feeds'

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
  ON_PODCAST_PORTAL = 'ON_PODCAST_PORTAL',
}
