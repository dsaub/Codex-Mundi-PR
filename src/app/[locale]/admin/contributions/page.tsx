'use client'

import { useParams, useRouter } from 'next/navigation'
import { getDictionary, getNestedValue } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/config'
import Header from '@/app/[locale]/Header'
import Sidebar from '@/app/[locale]/Sidebar'

export default function AdminContributionsPage() {
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
            <h1>💬 {t('admin.manageContributions')}</h1>
            <p className="italic text-gray-500">
              {locale === 'es'
                ? 'No hay contribuciones pendientes por revisar.'
                : 'No pending contributions to review.'}
            </p>
            <p className="cm-meta mt-2">{t('admin.pendingContributions')}: 0</p>
            <button className="cm-btn mt-4" onClick={() => router.push(`/${locale}/admin`)}>
              ← {t('common.back')}
            </button>
          </div>
        </main>
      </div>
    </>
  )
}
