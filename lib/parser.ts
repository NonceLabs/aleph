import { isValid as isValidUrl } from './utils/linker'
import retrieve from './utils/retrieve'
import { validate, xml2obj, isRSS, isAtom } from './utils/xmlparser'
import parseJsonFeed from './utils/parseJsonFeed'
import parseRssFeed from './utils/parseRssFeed'
import parseAtomFeed from './utils/parseAtomFeed'
import { FetchOptions, ReaderOptions } from 'types'

const getopt = (options: ReaderOptions = {}) => {
  const {
    normalization = true,
    descriptionMaxLen = 210,
    useISODateFormat = true,
    xmlParserOptions = {},
    getExtraFeedFields = () => ({}),
    getExtraEntryFields = () => ({}),
  } = options

  return {
    normalization,
    descriptionMaxLen,
    useISODateFormat,
    xmlParserOptions,
    getExtraFeedFields,
    getExtraEntryFields,
  }
}

export const extractFromJson = (json: string, options = {}) => {
  return parseJsonFeed(json, getopt(options))
}

export const extractFromXml = (xml: string | undefined, options = {}) => {
  if (!validate(xml)) {
    throw new Error('The XML document is not well-formed')
  }
  const opts = getopt(options)
  const data = xml2obj(xml, opts.xmlParserOptions)

  return isRSS(data)
    ? parseRssFeed(data, opts)
    : isAtom(data)
    ? parseAtomFeed(data, opts)
    : null
}

export const extract = async (url: string, options = {}, fetchOptions = {}) => {
  if (!isValidUrl(url)) {
    throw new Error('Input param must be a valid URL')
  }
  const data = await retrieve(url, fetchOptions)
  if (!data.text && !data.json) {
    throw new Error(`Failed to load content from "${url}"`)
  }

  const { type, json, text } = data

  return type === 'json'
    ? extractFromJson(json, options)
    : extractFromXml(text, options)
}

export const read = async (
  url: string,
  options: ReaderOptions,
  fetchOptions: FetchOptions
) => {
  console.warn('WARNING: read() is deprecated. Please use extract() instead!')
  return extract(url, options, fetchOptions)
}
