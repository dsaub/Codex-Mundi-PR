'use client'

import { useRouter } from 'next/navigation'

interface HeaderProps {
  locale: string
  router: ReturnType<typeof useRouter>
  t: (path: string) => string
}

export default function Header({ locale, router, t }: HeaderProps) {
  return (
    <header className="cm-header">
      <div className="cm-header-title">
        <span className="text-lg">📖</span>
        <a href={`/${locale}`}>{t('site.title')}</a>
      </div>

      <div className="flex items-center gap-4">
        <div className="cm-search-bar">
          <input
            type="text"
            className="cm-input"
            placeholder={t('search.placeholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                router.push(`/${locale}/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`)
              }
            }}
          />
          <button
            className="cm-btn cm-btn-primary"
            onClick={() => {
              const input = document.querySelector('.cm-search-bar input') as HTMLInputElement
              if (input?.value.trim()) {
                router.push(`/${locale}/search?q=${encodeURIComponent(input.value.trim())}`)
              }
            }}
          >
            {t('search.title')}
          </button>
        </div>

        <div className="cm-header-nav">
          <a href={`/${locale}/auth/login`}>{t('nav.login')}</a>
          <a href={`/${locale}/admin`}>{t('nav.admin')}</a>
          <a href={locale === 'es' ? '/en' : '/es'}>
            {locale === 'es' ? 'English' : 'Español'}
          </a>
        </div>
      </div>
    </header>
  )
}
