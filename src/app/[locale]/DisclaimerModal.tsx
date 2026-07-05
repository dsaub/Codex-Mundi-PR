'use client'

interface DisclaimerModalProps {
  onAccept: () => void
  locale: string
  dict: any
}

export default function DisclaimerModal({ onAccept, locale, dict }: DisclaimerModalProps) {
  const title = dict?.site?.title || 'Codex Mundi'
  const subtitle = dict?.site?.subtitle || ''
  const disclaimer = dict?.site?.disclaimer || ''

  return (
    <div className="cm-disclaimer-overlay">
      <div className="cm-disclaimer-box">
        <div className="text-3xl mb-3">📜</div>
        <h1>{title}</h1>
        <p className="italic text-gray-600 mb-4 text-sm">{subtitle}</p>

        <div className="cm-disclaimer-warning">
          <p className="font-bold text-red-700 mb-2">
            {locale === 'es' ? '⚠️ AVISO IMPORTANTE' : '⚠️ IMPORTANT NOTICE'}
          </p>
          <p>{disclaimer}</p>
        </div>

        <button className="cm-btn cm-btn-primary text-base px-8 py-2" onClick={onAccept}>
          {dict?.common?.accept || 'Accept'}
        </button>
      </div>
    </div>
  )
}
