// specs: https://www.jsonfeed.org/version/1.1/

import { toISODateString, buildDescription, getEntryId } from './normalizer'

import { purify as purifyUrl } from './linker'
import { ReaderOptions } from 'types'

const transform = (item: any, options: ReaderOptions) => {
  const { useISODateFormat, descriptionMaxLen, getExtraEntryFields } = options

  const {
    id = '',
    title = '',
    url: link = '',
    date_published: pubDate = '',
    summary = '',
    content_html: htmlContent = '',
    content_text: textContent = '',
  } = item

  const published = useISODateFormat ? toISODateString(pubDate) : pubDate
  const extraFields = getExtraEntryFields ? getExtraEntryFields(item) : {}

  const entry = {
    id: getEntryId(id, link, pubDate),
    title,
    link: purifyUrl(link),
    published,
    description: buildDescription(
      textContent || htmlContent || summary,
      descriptionMaxLen
    ),
  }

  return {
    ...entry,
    ...extraFields,
  }
}

const parseJson = (data: any, options: ReaderOptions) => {
  const { normalization, getExtraFeedFields } = options

  if (!normalization) {
    return data
  }

  const {
    title = '',
    home_page_url: homepageUrl = '',
    description = '',
    language = '',
    items: item = [],
  } = data

  const extraFields = getExtraFeedFields ? getExtraFeedFields(data) : {}

  const items = Array.isArray(item) ? item : [item]

  return {
    title,
    link: purifyUrl(homepageUrl),
    description,
    language,
    published: '',
    generator: '',
    ...extraFields,
    entries: items.map((item) => {
      return transform(item, options)
    }),
  }
}

export default (data: any, options = {}) => {
  return parseJson(data, options)
}
