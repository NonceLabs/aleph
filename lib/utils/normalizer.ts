// normalizer

import { has, isArray, isObject, isObjectLike, isString } from 'lodash'

import { decode } from 'html-entities'

import { isValid as isValidUrl, purify as purifyUrl } from './linker'

export const toISODateString = (dstr: string) => {
  try {
    return dstr ? new Date(dstr).toISOString() : ''
  } catch (err) {
    return ''
  }
}

export const buildDescription = (val: string, maxlen?: number) => {
  return val
  // const stripped = stripTags(String(val))
  // console.log(val)
  // return truncate(stripped, maxlen).replace(/\n+/g, ' ')
}

export const getText = (val: any) => {
  const txt = isObjectLike(val)
    ? val._text || val['#text'] || val._cdata || val.$t
    : val
  return txt ? decode(String(txt).trim()) : ''
}

export const getLink = (val: any, id = ''): string => {
  if (id && isValidUrl(id)) {
    return id
  }
  if (
    isObject(id) &&
    has(id, '@_isPermaLink') &&
    id['@_isPermaLink'] === 'true'
  ) {
    return getText(id)
  }

  const getEntryLink = (links: any[]) => {
    const items = links.map((item) => {
      return getLink(item)
    })
    return items.length > 0 ? items[0] : ''
  }

  return isString(val)
    ? getText(val)
    : isObjectLike(val) && has(val, 'href')
    ? getText(val.href)
    : isObjectLike(val) && has(val, '@_href')
    ? getText(val['@_href'])
    : isObjectLike(val) && has(val, '@_url')
    ? getText(val['@_url'])
    : isObjectLike(val) && has(val, '_attributes')
    ? getText(val._attributes.href)
    : isArray(val)
    ? getEntryLink(val)
    : ''
}

export const getPureUrl = (url: any, id = '') => {
  const link = getLink(url, id)
  return link ? purifyUrl(link) : ''
}

const hash = (str: string) =>
  Math.abs(
    str.split('').reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0)
  ).toString(36)

export const getEntryId = (id: any, url: string, pubDate: string) => {
  const _id = id
    ? getText(id)
    : hash(getPureUrl(url)) + '-' + new Date(pubDate).getTime()
  return _id
}

export const getEnclosure = (val: any) => {
  const url = has(val, '@_url') ? val['@_url'] : ''
  const type = has(val, '@_type') ? val['@_type'] : ''
  const length = Number(has(val, '@_length') ? val['@_length'] : 0)
  return !url || !type
    ? null
    : {
        url,
        type,
        length,
      }
}

const getCategory = (v: any) => {
  return isObjectLike(v)
    ? {
        text: getText(v),
        domain: v['@_domain'],
      }
    : v
}

export const getOptionalTags = (val: any, key: string) => {
  if (key === 'source') {
    return {
      text: getText(val),
      url: getLink(val),
    }
  }
  if (key === 'category') {
    return isArray(val) ? val.map(getCategory) : getCategory(val)
  }
  if (key === 'enclosure') {
    return getEnclosure(val)
  }
  return val
}
