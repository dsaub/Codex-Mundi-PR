'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getDictionary, getNestedValue } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/config'
import { seedData } from '@/lib/seed'
import { truncate } from '@/lib/utils'
import DisclaimerModal from './DisclaimerModal'
import Sidebar from './Sidebar'
import Header from './Header'

export default function HomePage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as Locale) || 'es'
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const dict = getDictionary(locale)
  const t = (path: string) => dict ? getNestedValue(dict, path) : path

  const categories = seedData.categories.filter(c => !c.parentId)
  const recentEntries = [...seedData.entries].slice(0, 4)

  return (
    <>
      {!disclaimerAccepted && (
        <DisclaimerModal onAccept={() => setDisclaimerAccepted(true)} locale={locale} dict={dict} />
      )}

      <Header locale={locale} router={router} t={t} />

      <div className="cm-body">
        <Sidebar locale={locale} router={router} t={t} />

        <main className="cm-main">
          <div className="cm-content-box">
            <h1>{t('site.title')}</h1>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">📜</span>
              <div>
                <p className="text-lg italic text-gray-600">{t('site.subtitle')}</p>
                <p className="text-sm text-gray-500 mt-1">{t('site.description')}</p>
              </div>
            </div>

            <hr className="cm-divider" />

            <h2>{t('home.allCategories')}</h2>
            <div className="cm-grid-2 mb-6">
              {categories.map((cat) => {
                const name = locale === 'es' ? cat.name_es : cat.name_en
                const desc = locale === 'es' ? cat.description_es : cat.description_en
                const count = seedData.entries.filter(e => {
                  const catIds = [cat.id]
                  const subCats = seedData.categories.filter(sc => sc.parentId === cat.id)
                  catIds.push(...subCats.map(sc => sc.id))
                  return catIds.includes(e.categoryId)
                }).length
                return (
                  <div
                    key={cat.id}
                    className="cm-card"
                    onClick={() => router.push(`/${locale}/categories/${cat.slug}`)}
                  >
                    <div className="cm-card-title">
                      {cat.icon} {name}
                    </div>
                    <div className="cm-card-excerpt">{desc}</div>
                    <div className="cm-meta mt-2">{count} {t('home.totalEntries')}</div>
                  </div>
                )
              })}
            </div>

            <hr className="cm-divider" />

            <h2>{t('home.recentEntries')}</h2>
            <div className="flex flex-col gap-3">
              {recentEntries.map((entry) => {
                const title = locale === 'es' ? entry.title_es : entry.title_en
                const excerpt = locale === 'es' ? entry.excerpt_es : entry.excerpt_en
                const catName = seedData.categories.find(c => c.id === entry.categoryId)
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
                      {catName && (
                        <span className="ml-2">{locale === 'es' ? catName.name_es : catName.name_en}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="cm-footer">
            {t('site.title')} &mdash; {t('site.subtitle')}
          </div>
        </main>
      </div>
    </>
  )
}
