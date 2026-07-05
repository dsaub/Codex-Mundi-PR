'use client'

import { useParams, useRouter } from 'next/navigation'
import { getDictionary, getNestedValue } from '@/lib/i18n/dictionary'
import { seedData } from '@/lib/seed'
import type { Locale } from '@/lib/i18n/config'
import Header from '@/app/[locale]/Header'
import Sidebar from '@/app/[locale]/Sidebar'

export default function AdminEntriesPage() {
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
            <h1>📝 {t('admin.manageEntries')}</h1>
            <div className="flex flex-col gap-2">
              {seedData.entries.map((entry) => {
                const title = locale === 'es' ? entry.title_es : entry.title_en
                return (
                  <div key={entry.id} className="cm-card flex justify-between items-center">
                    <span className="font-bold text-sm">{title}</span>
                    <div className="flex gap-2">
                      <button className="cm-btn text-xs">{t('admin.edit')}</button>
                      <button className="cm-btn text-xs">{t('admin.delete')}</button>
                    </div>
                  </div>
                )
              })}
            </div>
            <button className="cm-btn cm-btn-primary mt-4">{t('admin.createEntry')}</button>
            <button className="cm-btn mt-4 ml-2" onClick={() => router.push(`/${locale}/admin`)}>
              ← {t('common.back')}
            </button>
          </div>
        </main>
      </div>
    </>
  )
}
