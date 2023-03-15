// specs: https://www.rssboard.org/rss-specification

import { isArray, has } from 'lodash'
import { ReaderOptions } from 'types'

import {
  getText,
  toISODateString,
  buildDescription,
  getPureUrl,
  getOptionalTags,
  getEntryId,
} from './normalizer'

const transform = (item: any, options: ReaderOptions) => {
  const { useISODateFormat, descriptionMaxLen, getExtraEntryFields } = options

  const {
    guid = '',
    title = '',
    link = '',
    pubDate = '',
    description = '',
  } = item

  const published = useISODateFormat ? toISODateString(pubDate) : pubDate

  const entry = {
    id: getEntryId(guid, link, pubDate),
    title: getText(title),
    link: getPureUrl(link, guid),
    published,
    description: buildDescription(description, descriptionMaxLen),
  }
  const extraFields = getExtraEntryFields ? getExtraEntryFields(item) : {}
  return {
    ...entry,
    ...extraFields,
  }
}

const flatten = (feed: any) => {
  const { title = '', link = '', item } = feed

  const items = isArray(item) ? item : [item]
  const entries = items.map((entry) => {
    const { id, title = '', link = '' } = entry

    const item = {
      ...entry,
      title: getText(title),
      link: getPureUrl(link, id),
    }

    const txtTags = 'guid description source'.split(' ')

    txtTags.forEach((key) => {
      if (has(entry, key)) {
        item[key] = getText(entry[key])
      }
    })

    const optionalProps = 'source category enclosure author image'.split(' ')
    optionalProps.forEach((key) => {
      if (has(item, key)) {
        entry[key] = getOptionalTags(item[key], key)
      }
    })

    return item
  })

  const output = {
    ...feed,
    title: getText(title),
    link: getPureUrl(link),
    item: isArray(item) ? entries : entries[0],
  }
  return output
}

function getFavicon(channel: any, link: string) {
  const linkUrl = new URL(link)
  let faviconUrl = new URL('/favicon.ico', linkUrl.origin)

  if (channel.image && channel.image.url) {
    faviconUrl = new URL(channel.image.url, linkUrl.origin)
  }

  return faviconUrl.href
}

const parseRss = (data: any, options: ReaderOptions = {}) => {
  const { normalization, getExtraFeedFields } = options

  if (!normalization) {
    return flatten(data.rss.channel)
  }

  const {
    title = '',
    link = '',
    description = '',
    generator = '',
    language = '',
    lastBuildDate = '',
    item = [],
  } = data.rss.channel

  const extraFields = getExtraFeedFields
    ? getExtraFeedFields(data.rss.channel)
    : {}
  const items = isArray(item) ? item : [item]
  const published = options.useISODateFormat
    ? toISODateString(lastBuildDate)
    : lastBuildDate

  const _link = getPureUrl(link)

  return {
    title: getText(title),
    link: _link,
    description,
    language,
    generator,
    published,
    favicon: getFavicon(data.rss.channel, _link),
    ...extraFields,
    entries: items.map((item: any) => {
      return transform(item, options)
    }),
  }
}

export default (data: any, options = {}) => {
  return parseRss(data, options)
}
