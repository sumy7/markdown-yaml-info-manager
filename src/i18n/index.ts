import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n'

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-,\s]+.json$/i)
  const messages: LocaleMessages<VueMessageType> = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-]+)./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: loadLocaleMessages()
})

export default i18n
