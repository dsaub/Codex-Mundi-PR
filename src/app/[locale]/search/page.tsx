'use client'

import { Suspense, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getDictionary, getNestedValue } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/config'
import { seedData } from '@/lib/seed'
import { truncate } from '@/lib/utils'
import Sidebar from '../Sidebar'
import Header from '../Header'

function SearchContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = (params.locale as Locale) || 'es'
  const query = searchParams.get('q') || ''
  const dict = getDictionary(locale)
  const t = (path: string) => dict ? getNestedValue(dict, path) : path
  const [searchText, setSearchText] = useState(query)

  const results = query
    ? seedData.entries.filter((entry) => {
        const q = query.toLowerCase()
        return (
          entry.title_es.toLowerCase().includes(q) ||
          entry.title_en.toLowerCase().includes(q) ||
          entry.content_es.toLowerCase().includes(q) ||
          entry.content_en.toLowerCase().includes(q)
        )
      })
    : []

  return (
    <>
      <Header locale={locale} router={router} t={t} />
      <div className="cm-body">
        <Sidebar locale={locale} router={router} t={t} />
        <main className="cm-main">
          <div className="cm-content-box">
            <h1>{t('search.title')}</h1>

            <div className="cm-search-bar mb-6">
              <input
                type="text"
                className="cm-input flex-1"
                placeholder={t('search.placeholder')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchText.trim()) {
                    router.push(`/${locale}/search?q=${encodeURIComponent(searchText.trim())}`)
                  }
                }}
              />
              <button
                className="cm-btn cm-btn-primary"
                onClick={() => {
                  if (searchText.trim()) {
                    router.push(`/${locale}/search?q=${encodeURIComponent(searchText.trim())}`)
                  }
                }}
              >
                {t('search.title')}
              </button>
            </div>

            {query && (
              <p className="text-sm text-gray-600 mb-4">
                {t('search.resultsFor')} &ldquo;{query}&rdquo;: {results.length} {t('home.totalEntries')}
              </p>
            )}

            {query && results.length === 0 && (
              <p className="italic text-gray-500">- {t('search.noResults')} -</p>
            )}

            <div className="flex flex-col gap-3">
              {results.map((entry) => {
                const title = locale === 'es' ? entry.title_es : entry.title_en
                const excerpt = locale === 'es' ? entry.excerpt_es : entry.excerpt_en
                const cat = seedData.categories.find(c => c.id === entry.categoryId)
                return (
                  <div
                    key={entry.id}
                    className="cm-card"
                    onClick={() => router.push(`/${locale}/entry/${entry.slug}`)}
                  >
                    <div className="cm-card-title">{title}</div>
                    <div className="cm-card-excerpt">{truncate(excerpt, 200)}</div>
                    <div className="cm-meta mt-2">
                      <span className="cm-tag">{getNestedValue(dict, `reality.${entry.realityStatus}`)}</span>
                      {cat && (
                        <span className="ml-2">{locale === 'es' ? cat.name_es : cat.name_en}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="cm-footer">
            {t('site.title')} &mdash; {t('search.title')}
          </div>
        </main>
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="cm-body"><main className="cm-main">Loading...</main></div>}>
      <SearchContent />
    </Suspense>
  )
}
