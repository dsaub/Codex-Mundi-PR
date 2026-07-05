import type { Locale } from './config'
import esDict from '@/messages/es.json'
import enDict from '@/messages/en.json'

type DictionaryValue = string | string[] | Dictionary
type Dictionary = {
  [key: string]: DictionaryValue
}

const dictionaries: Record<Locale, Dictionary> = {
  es: esDict as Dictionary,
  en: enDict as Dictionary,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export function getNestedValue(obj: Dictionary, path: string): string {
  const val = path.split('.').reduce<DictionaryValue>((acc, key) => {
    if (acc && typeof acc === 'object' && !Array.isArray(acc) && key in acc) {
      return (acc as Dictionary)[key]
    }
    return path
  }, obj as DictionaryValue)
  return typeof val === 'string' ? val : String(val ?? path)
}
