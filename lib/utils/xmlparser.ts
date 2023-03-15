import { has, isString } from 'lodash'

import { XMLValidator, XMLParser } from 'fast-xml-parser'

export const isRSS = (data: any = {}) => {
  return has(data, 'rss') && has(data.rss, 'channel')
}

export const isAtom = (data: any = {}) => {
  return has(data, 'feed') && has(data.feed, 'entry')
}

export const validate = (xml: string | undefined) => {
  return !xml || !isString(xml) || !xml.length
    ? false
    : XMLValidator.validate(xml) === true
}

export const xml2obj = (xml = '', extraOptions = {}) => {
  const options = {
    ...extraOptions,
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  }
  const parser = new XMLParser(options)
  const jsonObj = parser.parse(xml)
  return jsonObj
}
