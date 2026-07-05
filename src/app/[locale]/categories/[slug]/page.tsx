'use client'

import { useParams, useRouter } from 'next/navigation'
import { getDictionary, getNestedValue } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/config'
import { seedData } from '@/lib/seed'
import { truncate } from '@/lib/utils'
import Sidebar from '@/app/[locale]/Sidebar'
import Header from '@/app/[locale]/Header'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as Locale) || 'es'
  const slug = params.slug as string
  const dict = getDictionary(locale)
  const t = (path: string) => dict ? getNestedValue(dict, path) : path

  const category = seedData.categories.find(c => c.slug === slug)
  const subCatIds = category ? seedData.categories.filter(c => c.parentId === category.id).map(c => c.id) : []
  const allCatIds = category ? [category.id, ...subCatIds] : []
  const entries = seedData.entries.filter(e => allCatIds.includes(e.categoryId))

  if (!category) {
    return (
      <>
        <Header locale={locale} router={router} t={t} />
        <div className="cm-body">
          <Sidebar locale={locale} router={router} t={t} />
          <main className="cm-main">
            <div className="cm-content-box">
              <h1>{locale === 'es' ? 'Categoría no encontrada' : 'Category not found'}</h1>
              <button className="cm-btn" onClick={() => router.push(`/${locale}`)}>
                ← {t('common.back')}
              </button>
            </div>
          </main>
        </div>
      </>
    )
  }

  const name = locale === 'es' ? category.name_es : category.name_en
  const desc = locale === 'es' ? category.description_es : category.description_en

  return (
    <>
      <Header locale={locale} router={router} t={t} />
      <div className="cm-body">
        <Sidebar locale={locale} router={router} t={t} />
        <main className="cm-main">
          <div className="cm-content-box">
            <div className="flex items-center gap-2 mb-2">
              <button className="cm-btn text-xs" onClick={() => router.push(`/${locale}`)}>
                ← {t('categories.backToCategories')}
              </button>
            </div>
            <h1>{category.icon} {name}</h1>
            <p className="text-gray-600 mb-6">{desc}</p>

            <hr className="cm-divider" />

            {entries.length === 0 ? (
              <p className="italic text-gray-500">- {t('categories.noEntries')} -</p>
            ) : (
              <div className="flex flex-col gap-3">
                {entries.map((entry) => {
                  const title = locale === 'es' ? entry.title_es : entry.title_en
                  const excerpt = locale === 'es' ? entry.excerpt_es : entry.excerpt_en
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
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="cm-footer">{entries.length} {t('home.totalEntries')}</div>
        </main>
      </div>
    </>
  )
}
