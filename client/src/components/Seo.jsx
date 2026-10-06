import { useEffect } from 'react'
import { SITE_BASE_URL } from '../lib/utils'

const DEFAULT_TITLE = 'CodeCircle | Student Tech Community & Developer Resources | CodeCircle.online'
const DEFAULT_DESCRIPTION = 'CodeCircle (Code Circle / CodeCircle.online) is a student tech community for students, by students. Explore curated resources, tutorials, internship alerts, AI/ML, Linux, cybersecurity, and open source opportunities.'
const SITE_NAME = 'CodeCircle'
const BRAND_KEYWORDS = 'CodeCircle, Code Circle, code circle, codecircle, CodeCircle.online, codecircle.online, Code Circle Online, student tech community, student developer community, student coding resources'

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function upsertScript(id, json) {
  let element = document.getElementById(id)
  if (!element) {
    element = document.createElement('script')
    element.id = id
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(json)
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = '',
  path = '/',
  image = `${SITE_BASE_URL}/og-image.svg`,
  type = 'website',
  noindex = false,
  schema = null,
}) {
  useEffect(() => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const canonical = `${SITE_BASE_URL}${normalizedPath}`
    const pageTitle = title
      ? (title.toLowerCase().includes('codecircle') || title.toLowerCase().includes('code circle')
          ? title
          : `${title} | CodeCircle — CodeCircle.online`)
      : DEFAULT_TITLE
    const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    const combinedKeywords = keywords ? `${keywords}, ${BRAND_KEYWORDS}` : BRAND_KEYWORDS

    document.title = pageTitle

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: combinedKeywords })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical })

    // Dynamic JSON-LD Structured Data for specific pages
    if (schema) {
      upsertScript('dynamic-page-schema', schema)
    } else if (normalizedPath !== '/') {
      // Default breadcrumb for sub-pages
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${SITE_BASE_URL}/`,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': title || 'Page',
            'item': canonical,
          },
        ],
      }
      upsertScript('dynamic-page-schema', breadcrumbData)
    }
  }, [description, image, keywords, noindex, path, schema, title, type])

  return null
}
