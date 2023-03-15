// parseAtomFeed.js

// specs: https://datatracker.ietf.org/doc/html/rfc5023
// refer: https://validator.w3.org/feed/docs/atom.html

import { has, isArray } from 'lodash'
import { ReaderOptions } from 'types'

import {
  getText,
  toISODateString,
  buildDescription,
  getPureUrl,
  getEntryId,
} from './normalizer'

const transform = (item: any, options: ReaderOptions) => {
  const { useISODateFormat, descriptionMaxLen, getExtraEntryFields } = options

  const {
    id = '',
    title = '',
    issued = '',
    modified = '',
    updated = '',
    published = '',
    link = '',
    summary = '',
    content = '',
  } = item

  const pubDate = updated || modified || published || issued
  const htmlContent = getText(content || summary)
  const entry = {
    id: getEntryId(id, link, pubDate),
    title: getText(title),
    link: getPureUrl(link, id),
    published: useISODateFormat ? toISODateString(pubDate) : pubDate,
    description: buildDescription(htmlContent || summary, descriptionMaxLen),
  }

  const extraFields = getExtraEntryFields ? getExtraEntryFields(item) : {}

  return {
    ...entry,
    ...extraFields,
  }
}

const flatten = (feed: any) => {
  const { id, title = '', link = '', entry } = feed

  const entries = isArray(entry) ? entry : [entry]
  const items = entries.map((entry) => {
    const { id, title = '', link = '', summary = '', content = '' } = entry
    const item = {
      ...entry,
      title: getText(title),
      link: getPureUrl(link, id),
    }
    if (has(item, 'summary')) {
      item.summary = getText(summary)
    }
    if (has(item, 'content')) {
      item.content = getText(content)
    }
    return item
  })

  const output = {
    ...feed,
    title: getText(title),
    link: getPureUrl(link, id),
    entry: isArray(entry) ? items : items[0],
  }
  return output
}

function getFavicon(feed: any, link: string) {
  const linkUrl = new URL(link)
  let faviconUrl = new URL('/favicon.ico', linkUrl.origin)

  if (feed.icon) {
    faviconUrl = new URL(feed.icon, linkUrl.origin)
  }

  return faviconUrl.href
}

const parseAtom = (data: any, options: ReaderOptions = {}) => {
  const { normalization, getExtraFeedFields } = options

  if (!normalization) {
    return flatten(data.feed)
  }

  const {
    id = '',
    title = '',
    link = '',
    subtitle = '',
    generator = '',
    language = '',
    updated = '',
    entry: item = [],
  } = data.feed

  const extraFields = getExtraFeedFields ? getExtraFeedFields(data.feed) : {}

  const items = isArray(item) ? item : [item]

  const published = options.useISODateFormat
    ? toISODateString(updated)
    : updated

  const _link = getPureUrl(link, id)
  return {
    title: getText(title),
    link: _link,
    description: subtitle,
    language,
    generator,
    published,
    favicon: getFavicon(data.feed, _link),
    ...extraFields,
    entries: items.map((item) => {
      return transform(item, options)
    }),
  }
}

export default (data: any, options = {}) => {
  return parseAtom(data, options)
}
