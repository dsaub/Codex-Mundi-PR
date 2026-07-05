'use client'

import { useParams, useRouter } from 'next/navigation'
import { getDictionary, getNestedValue } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/config'
import Header from '../Header'
import Sidebar from '../Sidebar'

export default function AdminPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as Locale) || 'es'
  const dict = getDictionary(locale)
  const t = (path: string) => dict ? getNestedValue(dict, path) : path

  return (
    <>
      <Header locale={locale} router={router} t={t} />
      <div className="cm-body">
        <Sidebar locale={locale} router={router} t={t} />
        <main className="cm-main">
          <div className="cm-content-box">
            <h1>⚙️ {t('admin.dashboard')}</h1>
            <p className="text-gray-600 mb-6">
              {locale === 'es' ? 'Panel de administración de Codex Mundi' : 'Codex Mundi administration panel'}
            </p>

            <div className="flex flex-col gap-3">
              <div className="cm-card" onClick={() => router.push(`/${locale}/admin/entries`)}>
                <div className="cm-card-title">📝 {t('admin.manageEntries')}</div>
                <div className="cm-card-excerpt">
                  {locale === 'es' ? 'Gestiona las entradas del archivo' : 'Manage archive entries'}
                </div>
              </div>
              <div className="cm-card" onClick={() => router.push(`/${locale}/admin/categories`)}>
                <div className="cm-card-title">📁 {t('admin.manageCategories')}</div>
                <div className="cm-card-excerpt">
                  {locale === 'es' ? 'Gestiona las categorías' : 'Manage categories'}
                </div>
              </div>
              <div className="cm-card" onClick={() => router.push(`/${locale}/admin/contributions`)}>
                <div className="cm-card-title">💬 {t('admin.manageContributions')}</div>
                <div className="cm-card-excerpt">
                  {locale === 'es' ? 'Revisa contribuciones de usuarios' : 'Review user contributions'}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
