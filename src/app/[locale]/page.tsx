'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getDictionary, getNestedValue } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/config'
import { seedData } from '@/lib/seed'
import { truncate } from '@/lib/utils'
import SplashScreen from './SplashScreen'
import DisclaimerModal from './DisclaimerModal'
import Sidebar from './Sidebar'
import Header from './Header'

const realityColors: Record<string, string> = {
  historical: '#2d5a8a',
  scientific: '#2d7a3a',
  hypothesis: '#8a6d2d',
  theoretical: '#6d2d8a',
  mythological: '#8a2d4a',
  speculative: '#8a5a2d',
  conspiratorial: '#8a2d2d',
  fiction: '#4a6a8a',
  philosophical: '#3a6a6a',
  unclassified: '#666666',
}

type Phase = 'splash' | 'disclaimer' | 'library'

export default function HomePage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as Locale) || 'es'
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('codex_intro_done')) {
      return 'library'
    }
    return 'splash'
  })
  const dict = getDictionary(locale)
  const t = (path: string) => dict ? getNestedValue(dict, path) : path

  const rootCategories = seedData.categories.filter(c => !c.parentId)
  const recentEntries = [...seedData.entries].slice(0, 4)
  const totalEntries = seedData.entries.length
  const totalCategories = seedData.categories.length
  const totalSubsections = seedData.subsections.length

  const realityStatuses = [
    { key: 'historical', color: '#2d5a8a' },
    { key: 'scientific', color: '#2d7a3a' },
    { key: 'hypothesis', color: '#8a6d2d' },
    { key: 'theoretical', color: '#6d2d8a' },
    { key: 'mythological', color: '#8a2d4a' },
    { key: 'speculative', color: '#8a5a2d' },
    { key: 'conspiratorial', color: '#8a2d2d' },
    { key: 'fiction', color: '#4a6a8a' },
    { key: 'philosophical', color: '#3a6a6a' },
    { key: 'unclassified', color: '#666666' },
  ]

  if (phase === 'splash') {
    return <SplashScreen onComplete={() => setPhase('disclaimer')} locale={locale} dict={dict} />
  }

  if (phase === 'disclaimer') {
    return <DisclaimerModal onAccept={() => {
      localStorage.setItem('codex_intro_done', 'true')
      setPhase('library')
    }} locale={locale} dict={dict} />
  }

  return (
    <>
      <Header locale={locale} router={router} t={t} />
      <div className="cm-body">
        <Sidebar locale={locale} router={router} t={t} />

        <main className="cm-main">
          <div className="cm-content-box">
            <h1>{t('site.title')}</h1>

            <div className="flex items-center gap-3 mb-6 p-4 bg-[var(--color-cm-sidebar-bg)] border border-[var(--color-cm-border)]">
              <span className="text-4xl">📜</span>
              <div>
                <p className="text-lg italic text-gray-600">{t('site.subtitle')}</p>
                <p className="text-sm text-gray-500 mt-1">{t('site.description')}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="cm-stats">
              <div className="cm-stat">
                <div className="cm-stat-number">{totalEntries}</div>
                <div className="cm-stat-label">{t('home.totalEntries')}</div>
              </div>
              <div className="cm-stat">
                <div className="cm-stat-number">{totalCategories}</div>
                <div className="cm-stat-label">
                  {locale === 'es' ? 'categorías' : 'categories'}
                </div>
              </div>
              <div className="cm-stat">
                <div className="cm-stat-number">{totalSubsections}</div>
                <div className="cm-stat-label">
                  {locale === 'es' ? 'subsecciones' : 'subsections'}
                </div>
              </div>
            </div>

            {/* Organization explanation */}
            <h2>
              {locale === 'es' ? '📖 Organización del archivo' : '📖 Archive organization'}
            </h2>
            <p>
              {locale === 'es'
                ? 'Codex Mundi está organizado en categorías y subcategorías que abarcan todas las áreas del conocimiento humano. Cada entrada contiene información detallada con subsecciones, y está clasificada según su estado de realidad (ver la leyenda más abajo).'
                : 'Codex Mundi is organized into categories and subcategories covering all areas of human knowledge. Each entry contains detailed information with subsections and is classified according to its reality status (see legend below).'}
            </p>
            <p>
              {locale === 'es'
                ? 'Puedes navegar usando el menú lateral, buscar términos específicos con el buscador superior, o explorar las categorías principales desde el mapa de conocimiento.'
                : 'You can navigate using the sidebar menu, search for specific terms with the search bar above, or explore the main categories from the knowledge map.'}
            </p>

            <hr className="cm-divider" />

            {/* Knowledge Map */}
            <h2>
              {locale === 'es' ? '🗺️ Mapa del conocimiento' : '🗺️ Knowledge map'}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              {locale === 'es'
                ? 'Visualización general de las categorías y su contenido. Haz clic para explorar.'
                : 'General visualization of categories and their content. Click to explore.'}
            </p>
            <div className="cm-map">
              {rootCategories.map((cat) => {
                const catName = locale === 'es' ? cat.name_es : cat.name_en
                const subCats = seedData.categories.filter(c => c.parentId === cat.id)
                const catEntries = seedData.entries.filter(e => {
                  const ids = [cat.id, ...subCats.map(c => c.id)]
                  return ids.includes(e.categoryId)
                })
                return (
                  <div key={cat.id} className="cm-map-node">
                    <div
                      className="cm-map-node-title"
                      onClick={() => router.push(`/${locale}/categories/${cat.slug}`)}
                    >
                      {cat.icon} {catName}
                      <span className="ml-2 text-[10px] text-gray-400">
                        ({catEntries.length} {t('home.totalEntries')})
                      </span>
                    </div>
                    <div className="cm-map-children">
                      {subCats.map((sub) => {
                        const subName = locale === 'es' ? sub.name_es : sub.name_en
                        const subEntries = seedData.entries.filter(e => e.categoryId === sub.id)
                        return (
                          <div
                            key={sub.id}
                            className="cm-map-child"
                            onClick={() => router.push(`/${locale}/categories/${sub.slug}`)}
                          >
                            {sub.icon} {subName} ({subEntries.length})
                          </div>
                        )
                      })}
                      {catEntries.filter(e => e.categoryId === cat.id).map((entry) => {
                        const title = locale === 'es' ? entry.title_es : entry.title_en
                        return (
                          <div
                            key={entry.id}
                            className="cm-map-child"
                            onClick={() => router.push(`/${locale}/entry/${entry.slug}`)}
                          >
                            📄 {title}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <hr className="cm-divider" />

            {/* Reality Status Legend */}
            <h2>
              {locale === 'es'
                ? '🎯 Leyenda: Estados de realidad'
                : '🎯 Legend: Reality states'}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              {locale === 'es'
                ? 'Cada entrada está clasificada según su nivel de verificabilidad:'
                : 'Each entry is classified according to its level of verifiability:'}
            </p>
            <div className="cm-legend">
              {realityStatuses.map((rs) => (
                <div key={rs.key} className="cm-legend-item">
                  <div className="cm-legend-dot" style={{ background: rs.color }} />
                  <div>
                    <div className="cm-legend-label">
                      {getNestedValue(dict, `reality.${rs.key}`)}
                    </div>
                    <div className="cm-legend-desc">
                      {locale === 'es'
                        ? realityDescriptions.es[rs.key]
                        : realityDescriptions.en[rs.key]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent entries */}
          <div className="cm-content-box">
            <h2>{t('home.recentEntries')}</h2>
            <div className="flex flex-col gap-3">
              {recentEntries.map((entry) => {
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
                    <div className="cm-meta mt-2 flex gap-2 items-center">
                      <div className="cm-legend-dot inline-block" style={{
                        background: realityColors[entry.realityStatus] || '#666'
                      }} />
                      <span className="cm-tag">{getNestedValue(dict, `reality.${entry.realityStatus}`)}</span>
                      {cat && (
                        <span>{locale === 'es' ? cat.name_es : cat.name_en}</span>
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

const realityDescriptions: Record<string, Record<string, string>> = {
  es: {
    historical: 'Información respaldada por registros históricos y evidencia documental',
    scientific: 'Basado en el método científico y evidencia empírica',
    hypothesis: 'Propuesta teórica aún no confirmada ni refutada',
    theoretical: 'Construcción teórica sin validación empírica directa',
    mythological: 'Proveniente de mitos, leyendas y tradiciones orales',
    speculative: 'Información especulativa sin base sólida verificable',
    conspiratorial: 'Teorías alternativas que contradicen la narrativa oficial',
    fiction: 'Proveniente de obras de ficción, literatura o arte',
    philosophical: 'Reflexión filosófica sin pretensión de verdad factual',
    unclassified: 'Sin clasificar o pendiente de categorización',
  },
  en: {
    historical: 'Information supported by historical records and documentary evidence',
    scientific: 'Based on the scientific method and empirical evidence',
    hypothesis: 'Theoretical proposal not yet confirmed or refuted',
    theoretical: 'Theoretical construction without direct empirical validation',
    mythological: 'From myths, legends, and oral traditions',
    speculative: 'Speculative information without solid verifiable basis',
    conspiratorial: 'Alternative theories contradicting the official narrative',
    fiction: 'From works of fiction, literature, or art',
    philosophical: 'Philosophical reflection without claim to factual truth',
    unclassified: 'Unclassified or pending categorization',
  },
}
