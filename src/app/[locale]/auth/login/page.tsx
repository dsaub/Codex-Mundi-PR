'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getDictionary, getNestedValue } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/config'
import Header from '@/app/[locale]/Header'
import Sidebar from '@/app/[locale]/Sidebar'

export default function LoginPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as Locale) || 'es'
  const dict = getDictionary(locale)
  const t = (path: string) => dict ? getNestedValue(dict, path) : path
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <Header locale={locale} router={router} t={t} />
      <div className="cm-body">
        <Sidebar locale={locale} router={router} t={t} />
        <main className="cm-main">
          <div className="cm-content-box" style={{ maxWidth: 400, margin: '0 auto' }}>
            <h1>🔐 {t('auth.loginTitle')}</h1>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm block mb-1">{t('auth.email')}</label>
                <input type="email" className="cm-input w-full" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm block mb-1">{t('auth.password')}</label>
                <input type="password" className="cm-input w-full" value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button className="cm-btn cm-btn-primary w-full">{t('auth.submitLogin')}</button>
              <p className="text-sm text-center text-gray-600">
                {t('auth.noAccount')}{' '}
                <a className="cm-link" onClick={() => router.push(`/${locale}/auth/register`)}>
                  {t('auth.registerLink')}
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
