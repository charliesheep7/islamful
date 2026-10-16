'use client'

import { goldTranslations } from '@/data/locales/gold'
import { localizedPath, type Locale } from '@/utils/locale'
import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import {
  calculateGold,
  emptyGoldDraft,
  GoldInputError,
  type GoldDraft,
  type GoldResult,
} from '@/data/gold-zakat'
import { KARATS, ZAKAT_CURRENCIES } from '@/data/zakat'

export default function GoldZakatCalculator({
  lang,
  initialDate,
}: {
  lang: Locale
  initialDate: string
}) {
  const ar = lang === 'ar',
    t = (en: string, arabic: string) =>
      ar ? arabic : lang === 'fr' || lang === 'de' ? goldTranslations[lang][en] || en : en,
    id = useId()
  const [draft, setDraft] = useState(() => emptyGoldDraft(initialDate, ar ? 'SAR' : 'USD'))
  const [pendingCurrency, setPendingCurrency] = useState(ar ? 'SAR' : 'USD')
  const [result, setResult] = useState<GoldResult | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    const now = new Date()
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    setDraft((d) => ({ ...d, date }))
  }, [])
  useEffect(() => {
    if (result) resultRef.current?.focus()
  }, [result])
  const decimalInput = (value: string) =>
    lang === 'fr' || lang === 'de' ? value.replace(',', '.') : value
  const change = (patch: Partial<GoldDraft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setResult(null)
    setError('')
  }
  const input =
    'mt-2 w-full min-w-0 max-w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-base text-stone-900 dark:border-stone-600 dark:bg-gray-900 dark:text-white'
  const money = (value: number) =>
    new Intl.NumberFormat(
      ar ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US',
      {
        style: 'currency',
        currency: draft.currency,
        currencyDisplay: 'code',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(value)
  const number = (value: number) =>
    new Intl.NumberFormat(
      ar ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US',
      { maximumFractionDigits: 6 }
    ).format(value)
  const label = (field: string, text: string) => (
    <label htmlFor={`${id}-${field}`} className="block text-sm font-medium">
      {text}
    </label>
  )
  const fieldProps = (field: string) => ({
    id: `${id}-${field}`,
    'aria-invalid': error === field,
    'aria-describedby': error === field ? `${id}-error` : undefined,
  })
  const status = (r: GoldResult) =>
    ({
      below: t(
        'This gold is below your selected nisab. Other wealth may still make Zakat due.',
        'هذا الذهب أقل من النصاب المختار. قد تجب الزكاة عند احتساب أموالك الأخرى.'
      ),
      estimate: t(
        'Estimated annual Zakat on the included gold, if your chosen basis and eligibility conditions apply.',
        'تقدير الزكاة السنوية على الذهب المشمول إذا انطبق الأساس المختار وشروط الوجوب.'
      ),
      'not-yet': t(
        'Planning amount: your lunar year is not complete.',
        'مبلغ للتخطيط: لم يكتمل الحول القمري.'
      ),
      'check-hawl': t(
        'Potential amount: confirm that your lunar Zakat year is complete.',
        'مبلغ محتمل: تحقّق من اكتمال حول الزكاة القمري.'
      ),
    })[r.status]
  const basis = () =>
    draft.nisab === 'custom'
      ? t('Local nisab amount entered by you', 'قيمة النصاب المحلي التي أدخلتها')
      : `${draft.nisab} ${t('g gold-value basis', 'غرام — أساس الذهب')}`
  const download = () => {
    if (!result) return
    const lines = [
      t('Islamful gold Zakat estimate', 'تقدير زكاة الذهب — إسلامفُل'),
      `${draft.date} · ${draft.currency}`,
      status(result),
      basis(),
      `${t('24K price per gram', 'سعر غرام عيار ٢٤')}: ${draft.price} ${draft.currency}`,
      `${t('Personal jewellery', 'حلي الاستعمال الشخصي')}: ${draft.jewellery === 'include' ? t('Included', 'مشمول') : t('Excluded', 'مستبعد')}`,
      ...draft.lots.map(
        (lot, i) =>
          `${i + 1}. ${lot.weight} g · ${lot.karat}K · ${lot.use === 'investment' ? t('Savings / investment', 'ادخار / استثمار') : t('Personal jewellery', 'حلي شخصي')} · ${result.lots[i].included ? t('Included', 'مشمول') : t('Excluded', 'مستبعد')} · ${money(result.lots[i].value)}`
      ),
      `${t('Included gold value', 'قيمة الذهب المشمول')}: ${money(result.goldValue)}`,
      `${t('Pure-gold equivalent', 'ما يعادله من الذهب الخالص')}: ${number(result.pureGrams)} g`,
      `${t('Nisab', 'النصاب')}: ${money(result.nisabValue)}`,
      `${t('Calculated amount', 'المبلغ المحسوب')}: ${money(result.potential)}`,
      t(
        'Gold only. Prices are entered manually, not a live feed. The total uses unrounded gold values; displayed values round to two decimals and the 2.5% amount rounds up. Confirm jewellery, nisab and lunar-year rules with your adviser.',
        'للذهب فقط. الأسعار مدخلة يدويًا وليست مباشرة. يعتمد المجموع على القيم قبل التقريب؛ تُعرض القيم بمنزلتين ويُقرّب مبلغ ٢٫٥٪ إلى الأعلى. راجع أحكام الحلي والنصاب والحول مع مختص.'
      ),
    ]
    const url = URL.createObjectURL(
      new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `islamful-gold-zakat-${draft.date}-${draft.currency}.txt`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div
      lang={lang}
      dir={ar ? 'rtl' : 'ltr'}
      data-testid="gold-zakat-calculator"
      className="space-y-6 [font-family:var(--font-noto-sans),system-ui,sans-serif]"
    >
      <form
        ref={formRef}
        noValidate
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (pendingCurrency !== draft.currency) return
          try {
            setResult(calculateGold(draft))
            setError('')
          } catch (e) {
            const key = e instanceof GoldInputError ? e.field : 'price'
            setResult(null)
            setError(key)
            const el = document.getElementById(`${id}-${key}`)
            const details = el?.closest('details')
            if (details) details.open = true
            el?.focus()
          }
        }}
      >
        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 dark:border-stone-700 dark:bg-gray-900">
          <h2 className="text-xl font-semibold">{t('Your gold', 'ذهبك')}</h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            {t(
              'Add each purity separately. Use the metal weight without stones or other non-gold parts.',
              'أضف كل عيار على حدة. أدخل وزن المعدن دون الأحجار أو الأجزاء غير الذهبية.'
            )}
          </p>
          <div className="mt-5 space-y-5">
            {draft.lots.map((lot, index) => (
              <fieldset
                key={index}
                className="rounded-xl border border-stone-200 p-4 dark:border-stone-700"
                data-testid="gold-lot"
              >
                <legend className="px-1 text-sm font-semibold">
                  {t('Item', 'القطعة')} {index + 1}
                </legend>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    {label(`weight-${index}`, t('Weight (grams)', 'الوزن بالغرام'))}
                    <input
                      {...fieldProps(`weight-${index}`)}
                      type="text"
                      inputMode="decimal"
                      dir="ltr"
                      autoComplete="off"
                      maxLength={13}
                      value={lot.weight}
                      onChange={(e) =>
                        change({
                          lots: draft.lots.map((v, i) =>
                            i === index ? { ...v, weight: decimalInput(e.target.value) } : v
                          ),
                        })
                      }
                      className={input}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    {label(`karat-${index}`, t('Purity (karat)', 'العيار'))}
                    <select
                      {...fieldProps(`karat-${index}`)}
                      value={lot.karat}
                      onChange={(e) =>
                        change({
                          lots: draft.lots.map((v, i) =>
                            i === index ? { ...v, karat: Number(e.target.value) } : v
                          ),
                        })
                      }
                      className={input}
                    >
                      {KARATS.map((k) => (
                        <option key={k} value={k}>
                          {k}K
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {label(`use-${index}`, t('Use', 'الغرض'))}
                    <select
                      {...fieldProps(`use-${index}`)}
                      value={lot.use}
                      onChange={(e) =>
                        change({
                          lots: draft.lots.map((v, i) =>
                            i === index
                              ? { ...v, use: e.target.value as 'investment' | 'jewellery' }
                              : v
                          ),
                        })
                      }
                      className={input}
                    >
                      <option value="investment">
                        {t('Savings / investment', 'ادخار / استثمار')}
                      </option>
                      <option value="jewellery">{t('Personal jewellery', 'حلي شخصي')}</option>
                    </select>
                  </div>
                </div>
                {draft.lots.length > 1 && (
                  <button
                    type="button"
                    className="mt-3 text-sm underline"
                    onClick={() => change({ lots: draft.lots.filter((_, i) => i !== index) })}
                  >
                    {t('Remove item', 'حذف القطعة')} {index + 1}
                  </button>
                )}
              </fieldset>
            ))}
          </div>
          <button
            type="button"
            disabled={draft.lots.length >= 20}
            onClick={() =>
              change({ lots: [...draft.lots, { weight: '', karat: 24, use: 'investment' }] })
            }
            className="mt-4 rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {t('Add another item', 'أضف قطعة أخرى')}
          </button>
        </section>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 dark:border-stone-700 dark:bg-gray-900">
          <h2 className="text-xl font-semibold">{t('Price and basis', 'السعر وأساس الحساب')}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              {label('currency', t('Currency', 'العملة'))}
              <select
                {...fieldProps('currency')}
                className={input}
                value={pendingCurrency}
                onChange={(e) => {
                  setPendingCurrency(e.target.value)
                  setResult(null)
                  setError('')
                }}
              >
                {ZAKAT_CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              {label('date', t('Valuation date', 'تاريخ التقييم'))}
              <input
                {...fieldProps('date')}
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                value={draft.date}
                onChange={(e) => change({ date: e.target.value })}
                className={input}
              />
            </div>
            {pendingCurrency !== draft.currency && (
              <div className="sm:col-span-2" role="status">
                <p className="text-sm">
                  {t(
                    'Changing currency clears prices and results; weights stay. No currency conversion is performed.',
                    'تغيير العملة يمسح الأسعار والنتائج ويبقي الأوزان. لا تُجرى عملية تحويل عملات.'
                  )}
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-lg border px-4 py-2"
                  onClick={() => change({ currency: pendingCurrency, price: '', customNisab: '' })}
                >
                  {t('Apply currency and clear prices', 'تطبيق العملة ومسح الأسعار')}
                </button>
              </div>
            )}
            <div>
              {label(
                'price',
                lang === 'fr'
                  ? `Prix du gramme d’or 24 carats (${draft.currency})`
                  : lang === 'de'
                    ? `Preis je Gramm 24-Karat-Gold (${draft.currency})`
                    : t(
                        `24K gold price per gram (${draft.currency})`,
                        `سعر غرام الذهب عيار ٢٤ (${draft.currency})`
                      )
              )}
              <input
                {...fieldProps('price')}
                type="text"
                inputMode="decimal"
                dir="ltr"
                autoComplete="off"
                maxLength={16}
                value={draft.price}
                placeholder="0"
                onChange={(e) => change({ price: decimalInput(e.target.value) })}
                className={input}
              />
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300">
                {t(
                  'Enter a dated local quote for 24K gold, not the price of 18K or 22K jewellery. No live price feed.',
                  'أدخل سعرًا محليًا مؤرخًا لعيار ٢٤، لا سعر حلي عيار ١٨ أو ٢٢. لا توجد أسعار مباشرة.'
                )}
              </p>
            </div>
            <div>
              {label('nisab', t('Nisab basis', 'أساس النصاب'))}
              <select
                {...fieldProps('nisab')}
                value={draft.nisab}
                onChange={(e) => change({ nisab: e.target.value as GoldDraft['nisab'] })}
                className={input}
              >
                <option value="85">
                  {t('85 g pure-gold basis', 'أساس ٨٥ غرامًا من الذهب الخالص')}
                </option>
                <option value="87.48">
                  {t('87.48 g gold-value basis', 'أساس قيمة ٨٧٫٤٨ غرامًا من الذهب')}
                </option>
                <option value="custom">
                  {t('Enter my local nisab amount', 'أدخل قيمة النصاب المحلي')}
                </option>
              </select>
            </div>
            {draft.nisab === 'custom' && (
              <div>
                {label(
                  'customNisab',
                  lang === 'fr'
                    ? `Nisab local (${draft.currency})`
                    : lang === 'de'
                      ? `Lokaler Nisab (${draft.currency})`
                      : t(`Local nisab (${draft.currency})`, `النصاب المحلي (${draft.currency})`)
                )}
                <input
                  {...fieldProps('customNisab')}
                  type="text"
                  inputMode="decimal"
                  dir="ltr"
                  value={draft.customNisab}
                  onChange={(e) => change({ customNisab: decimalInput(e.target.value) })}
                  className={input}
                />
              </div>
            )}
            <div>
              {label('jewellery', t('Personal jewellery rule', 'حكم حلي الاستعمال الشخصي'))}
              <select
                {...fieldProps('jewellery')}
                value={draft.jewellery}
                onChange={(e) => change({ jewellery: e.target.value as GoldDraft['jewellery'] })}
                className={input}
              >
                <option value="include">
                  {t('Include personal jewellery', 'احتساب الحلي الشخصي')}
                </option>
                <option value="exclude">
                  {t('Exclude eligible personal jewellery', 'استبعاد الحلي الشخصي المعفى')}
                </option>
              </select>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300">
                {t(
                  'Choose the ruling you follow; conditions differ. Savings and investment gold remain included.',
                  'اختر الحكم الذي تتبعه؛ تختلف الشروط. يبقى ذهب الادخار والاستثمار مشمولًا.'
                )}
              </p>
            </div>
            <div>
              {label(
                'hawl',
                t('Has your lunar Zakat year completed?', 'هل اكتمل حول الزكاة القمري؟')
              )}
              <select
                {...fieldProps('hawl')}
                value={draft.hawl}
                onChange={(e) => change({ hawl: e.target.value as GoldDraft['hawl'] })}
                className={input}
              >
                <option value="unsure">{t('I am not sure', 'لست متأكدًا')}</option>
                <option value="yes">{t('Yes', 'نعم')}</option>
                <option value="no">{t('Not yet', 'ليس بعد')}</option>
              </select>
            </div>
          </div>
          {error && (
            <p
              id={`${id}-error`}
              role="alert"
              className="mt-5 text-sm text-red-700 dark:text-red-300"
            >
              {t(
                'Check the highlighted field. Use a valid date or a non-negative number, without commas. Weight allows 3 decimal places, price 6, and local nisab 2. Price and nisab must be greater than zero.',
                'راجع الحقل المحدد. استخدم تاريخًا صحيحًا أو رقمًا غير سالب دون فواصل آلاف. الوزن يقبل ٣ منازل عشرية والسعر ٦ والنصاب المحلي ٢. يجب أن يكون السعر والنصاب أكبر من صفر.'
              )}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={pendingCurrency !== draft.currency}
              className="rounded-xl bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900 disabled:opacity-40"
            >
              {t('Calculate gold Zakat', 'احسب زكاة الذهب')}
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm underline"
              onClick={() => {
                setDraft(emptyGoldDraft(draft.date, draft.currency))
                setPendingCurrency(draft.currency)
                setResult(null)
                setError('')
              }}
            >
              {t('Clear all', 'مسح الكل')}
            </button>
          </div>
          <p className="mt-3 text-xs text-stone-600 dark:text-stone-300">
            {t(
              'Your amounts stay on this page. This calculator does not save or send them.',
              'تبقى مبالغك في هذه الصفحة؛ لا تحفظها هذه الحاسبة أو ترسلها.'
            )}
          </p>
        </section>
      </form>
      {result && (
        <section
          ref={resultRef}
          tabIndex={-1}
          data-testid="gold-zakat-result"
          className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 focus:outline-none dark:border-emerald-700 dark:bg-emerald-950"
        >
          <h2 className="text-lg font-semibold">{t('Your estimate', 'تقديرك')}</h2>
          <p
            data-testid="gold-zakat-amount"
            className="mt-2 text-3xl font-bold break-words sm:text-4xl"
          >
            {money(result.potential)}
          </p>
          <p className="mt-3 leading-relaxed">{status(result)}</p>
          <dl className="mt-5 space-y-3 text-sm">
            {[
              [t('Included gold value', 'قيمة الذهب المشمول'), money(result.goldValue)],
              [t('Excluded jewellery value', 'قيمة الحلي المستبعد'), money(result.excludedValue)],
              [
                t('Pure-gold equivalent included', 'الذهب الخالص المكافئ المشمول'),
                `${number(result.pureGrams)} ${t('g', 'غرام')}`,
              ],
              [t('Selected nisab', 'النصاب المختار'), money(result.nisabValue)],
              [t('Valuation date', 'تاريخ التقييم'), draft.date],
            ].map(([key, value]) => (
              <div className="flex justify-between gap-4" key={key}>
                <dt>{key}</dt>
                <dd className="text-end font-semibold break-words">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm">
            {basis()} ·{' '}
            {t(
              '2.5% of included value when the threshold is met.',
              '٢٫٥٪ من القيمة المشمولة عند بلوغ النصاب.'
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <button
              type="button"
              onClick={download}
              className="rounded-lg border border-emerald-700 px-4 py-2 font-semibold"
            >
              {t('Download summary', 'تنزيل الملخص')}
            </button>
            <Link className="py-2 underline" href={localizedPath('/zakat-calculator', lang)}>
              {t('Include savings and other wealth →', 'احسب المدخرات والأموال الأخرى ←')}
            </Link>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
            {t(
              'Gold only: savings, silver and debts are not included here. The threshold uses unrounded values. Displayed gold values round to two decimals; the calculated nisab and Zakat round up to the next cent.',
              'للذهب فقط: لا يشمل هذا الحساب المدخرات أو الفضة أو الديون. تُقارن القيم قبل التقريب بالنصاب. تُعرض قيمة الذهب بمنزلتين ويُقرّب النصاب المحسوب والزكاة إلى الجزء الأعلى من مئة.'
            )}
          </p>
        </section>
      )}
      <noscript>
        <p>
          {t(
            'Enable JavaScript to calculate. The formula, worked example and sources below remain available.',
            'فعّل جافاسكربت للحساب. تبقى المعادلة والمثال والمصادر أدناه متاحة.'
          )}
        </p>
      </noscript>
    </div>
  )
}
