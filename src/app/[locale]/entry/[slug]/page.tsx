'use client'

import { useParams, useRouter } from 'next/navigation'
import { getDictionary, getNestedValue } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/config'
import { seedData } from '@/lib/seed'
import { formatDate } from '@/lib/utils'
import Sidebar from '@/app/[locale]/Sidebar'
import Header from '@/app/[locale]/Header'

export default function EntryPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as Locale) || 'es'
  const slug = params.slug as string
  const dict = getDictionary(locale)
  const t = (path: string) => dict ? getNestedValue(dict, path) : path

  const entry = seedData.entries.find(e => e.slug === slug)
  const category = entry ? seedData.categories.find(c => c.id === entry.categoryId) : null
  const parentCategory = category?.parentId
    ? seedData.categories.find(c => c.id === category.parentId)
    : null
  const subsections = entry ? seedData.subsections.filter(s => s.entryId === entry.id) : []

  if (!entry) {
    return (
      <>
        <Header locale={locale} router={router} t={t} />
        <div className="cm-body">
          <Sidebar locale={locale} router={router} t={t} />
          <main className="cm-main">
            <div className="cm-content-box">
              <h1>{locale === 'es' ? 'Entrada no encontrada' : 'Entry not found'}</h1>
              <button className="cm-btn" onClick={() => router.push(`/${locale}`)}>
                ← {t('common.back')}
              </button>
            </div>
          </main>
        </div>
      </>
    )
  }

  const title = locale === 'es' ? entry.title_es : entry.title_en
  const content = locale === 'es' ? entry.content_es : entry.content_en
  const catName = category ? (locale === 'es' ? category.name_es : category.name_en) : ''
  const parentCatName = parentCategory
    ? (locale === 'es' ? parentCategory.name_es : parentCategory.name_en)
    : ''

  const subsectionTitle = (s: typeof subsections[0]) =>
    locale === 'es' ? s.title_es : s.title_en
  const subsectionContent = (s: typeof subsections[0]) =>
    locale === 'es' ? s.content_es : s.content_en

  return (
    <>
      <Header locale={locale} router={router} t={t} />
      <div className="cm-body">
        <Sidebar locale={locale} router={router} t={t} />
        <main className="cm-main">
          <div className="cm-content-box">
            <div className="flex items-center gap-2 mb-2 text-sm">
              <button className="cm-btn text-xs" onClick={() => router.push(`/${locale}/categories/${category?.slug}`)}>
                ← {t('entry.backToCategory')}
              </button>
              {parentCategory && (
                <span className="cm-meta">
                  / <a className="cm-link" onClick={() => router.push(`/${locale}/categories/${parentCategory.slug}`)}>
                    {parentCatName}
                  </a>
                </span>
              )}
              <span className="cm-meta">/ {catName}</span>
            </div>

            <h1>{title}</h1>

            <div className="flex gap-2 mb-6">
              <span className="cm-tag">{getNestedValue(dict, `reality.${entry.realityStatus}`)}</span>
              <span className="cm-meta">{t('entry.lastUpdated')}: {formatDate(entry.updatedAt, locale)}</span>
            </div>

            {content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            {subsections.length > 0 && (
              <div className="mt-8 border-t border-gray-300 pt-6">
                <h2>{t('entry.subsections')}</h2>
                {subsections.map((sub) => (
                  <div key={sub.id} className="mb-6">
                    <h3>▸ {subsectionTitle(sub)}</h3>
                    <div className="pl-4 text-sm leading-relaxed">
                      {subsectionContent(sub)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="cm-footer">
            {t('site.title')} &mdash; {title}
          </div>
        </main>
      </div>
    </>
  )
}
