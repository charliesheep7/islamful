'use client'

import { zakatTranslations } from '@/data/locales/zakat'
import { useEffect, useId, useRef, useState } from 'react'
import {
  calculateZakat,
  emptyZakatDraft,
  KARATS,
  MONEY_FIELDS,
  SILVER_PURITY,
  ZAKAT_CURRENCIES,
  ZakatInputError,
  type ZakatDraft,
  type ZakatResult,
} from '@/data/zakat'

export default function ZakatCalculator({
  lang = 'en',
  initialDate,
}: {
  lang?: string
  initialDate: string
}) {
  const ar = lang === 'ar'
  const t = (en: string, arabic: string) =>
    ar ? arabic : lang === 'fr' || lang === 'de' ? zakatTranslations[lang][en] || en : en
  const id = useId()
  const [draft, setDraft] = useState(() => emptyZakatDraft(initialDate))
  const [pendingCurrency, setPendingCurrency] = useState('USD')
  const [result, setResult] = useState<ZakatResult | null>(null)
  const [error, setError] = useState<{ field: keyof ZakatDraft; text: string } | null>(null)
  const [notice, setNotice] = useState('')
  const resultRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (result) resultRef.current?.focus()
  }, [result])
  const labels: Record<string, string> = {
    cash: t('Cash and current accounts', 'النقد والحسابات الجارية'),
    savings: t('Savings', 'المدخرات'),
    investments: t('Zakatable portion of investments', 'الجزء الزكوي من الاستثمارات'),
    business: t('Trade inventory', 'عروض التجارة'),
    receivables: t('Money owed to you expected to be repaid', 'الديون المرجو سدادها لك'),
    other: t('Other zakatable assets', 'أصول زكوية أخرى'),
    liabilities: t('Eligible deductible liabilities', 'الالتزامات القابلة للخصم'),
    goldValue: t('Zakatable gold value', 'قيمة الذهب الزكوي'),
    silverValue: t('Zakatable silver value', 'قيمة الفضة الزكوية'),
    goldWeight: t('Gold weight (grams)', 'وزن الذهب بالغرام'),
    silverWeight: t('Silver weight (grams)', 'وزن الفضة بالغرام'),
    goldPrice: t('Pure gold price per gram', 'سعر غرام الذهب الخالص'),
    silverPrice: t('Pure silver price per gram', 'سعر غرام الفضة الخالصة'),
    nisabAmount: t('Nisab amount', 'قيمة النصاب'),
    date: t('Valuation date', 'تاريخ التقييم'),
    karat: t('Gold purity (karat)', 'عيار الذهب'),
    silverPurity: t('Silver purity (parts per thousand)', 'نقاء الفضة بالألف'),
    nisabMode: t('Nisab basis', 'أساس النصاب'),
    convention: t('Nisab weights', 'أوزان النصاب'),
    hawl: t('Has your lunar Zakat year completed?', 'هل اكتمل حول الزكاة القمري؟'),
    metalMode: t('How to enter gold and silver', 'طريقة إدخال الذهب والفضة'),
  }
  const inputClass =
    'mt-2 w-full min-w-0 max-w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
  const panelClass =
    'space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 dark:border-gray-800 dark:bg-gray-900'
  const update = <K extends keyof ZakatDraft>(key: K, value: ZakatDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setResult(null)
    setError(null)
    setNotice('')
  }
  const money = (value: number) =>
    new Intl.NumberFormat(
      ar ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US',
      {
        style: 'currency',
        currency: draft.currency,
        currencyDisplay: 'code',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        numberingSystem: ar ? 'arab' : 'latn',
      }
    ).format(value)
  const field = (key: keyof ZakatDraft, unit = draft.currency, places = 2) => (
    <div>
      <label htmlFor={`${id}-${key}`} className="block text-sm font-medium">
        {labels[key]} {unit && <span className="text-gray-500">({unit})</span>}
      </label>
      <input
        id={`${id}-${key}`}
        aria-label={labels[key]}
        type="text"
        inputMode="decimal"
        dir="ltr"
        autoComplete="off"
        spellCheck={false}
        value={String(draft[key])}
        placeholder="0"
        aria-invalid={error?.field === key}
        aria-describedby={error?.field === key ? `${id}-error` : undefined}
        maxLength={21}
        onChange={(e) =>
          update(
            key,
            (lang === 'fr' || lang === 'de'
              ? e.target.value.replace(',', '.')
              : e.target.value) as never
          )
        }
        className={inputClass}
      />
      {places !== 2 && (
        <p className="mt-1 text-xs text-gray-500">
          {lang === 'fr'
            ? `Jusqu’à ${places} décimales.`
            : lang === 'de'
              ? `Bis zu ${places} Nachkommastellen.`
              : t(`Up to ${places} decimal places.`, `حتى ${places} منازل عشرية.`)}
        </p>
      )}
    </div>
  )
  const select = (key: keyof ZakatDraft, options: [string, string][]) => (
    <div>
      <label htmlFor={`${id}-${key}`} className="block text-sm font-medium">
        {labels[key]}
      </label>
      <select
        id={`${id}-${key}`}
        aria-label={labels[key]}
        value={String(draft[key])}
        className={inputClass}
        onChange={(e) =>
          update(
            key,
            (key === 'karat' || key === 'silverPurity'
              ? Number(e.target.value)
              : e.target.value) as never
          )
        }
      >
        {options.map(([value, name]) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
  const statusText = (r: ZakatResult) =>
    ({
      below: t(
        'Below the selected nisab for the assets entered.',
        'الأصول المدخلة أقل من النصاب المختار.'
      ),
      estimate: t(
        'Estimated annual Zakat, if your selected basis and eligibility conditions apply.',
        'تقدير الزكاة السنوية إذا انطبق الأساس المختار وشروط الوجوب.'
      ),
      'not-yet': t(
        'Your lunar year is not complete. This is a planning amount, not a payment due now under this annual model.',
        'لم يكتمل الحول. هذا مبلغ للتخطيط وليس زكاة مستحقة الآن وفق هذا النموذج السنوي.'
      ),
      'check-hawl': t(
        'Confirm your lunar-year position. This is a potential amount if the annual conditions are met.',
        'تحقّق من الحول. هذا مبلغ محتمل عند تحقق الشروط السنوية.'
      ),
    })[r.status]
  const basisText = () =>
    draft.nisabMode === 'amount'
      ? t('Nisab entered by you', 'النصاب الذي أدخلته')
      : `${draft.nisabMode === 'gold' ? t('Gold', 'الذهب') : t('Silver', 'الفضة')} · ${draft.convention} ${t('grams (gold/silver)', 'غرام (ذهب/فضة)')}`
  const rows = result
    ? [
        [t('Included assets', 'الأصول المشمولة'), money(result.assets)],
        [t('Gold included', 'الذهب المشمول'), money(result.gold)],
        [t('Silver included', 'الفضة المشمولة'), money(result.silver)],
        [labels.liabilities, money(result.liabilities)],
        [t('Net zakatable wealth', 'صافي المال الزكوي'), money(result.net)],
        [labels.nisabAmount, money(result.nisab)],
      ]
    : []
  const download = () => {
    if (!result) return
    const contents = [
      t('Islamful Zakat estimate', 'تقدير الزكاة — إسلامفُل'),
      `${labels.date}: ${draft.date}`,
      draft.currency,
      basisText(),
      statusText(result),
      ...rows.map(([label, value]) => `${label}: ${value}`),
      `${t('Calculated amount', 'المبلغ المحسوب')}: ${money(result.potential)}`,
      `${t('Lunar year answer', 'إجابة الحول')}: ${draft.hawl === 'yes' ? t('Complete', 'اكتمل') : draft.hawl === 'no' ? t('Not complete', 'لم يكتمل') : t('Unsure', 'غير متأكد')}`,
      draft.goldPrice &&
        (draft.nisabMode === 'gold' || (draft.metalMode === 'weight' && draft.goldWeight.trim())) &&
        `${labels.goldPrice}: ${draft.goldPrice} ${draft.currency}`,
      draft.silverPrice &&
        (draft.nisabMode === 'silver' ||
          (draft.metalMode === 'weight' && draft.silverWeight.trim())) &&
        `${labels.silverPrice}: ${draft.silverPrice} ${draft.currency}`,
      draft.metalMode === 'weight' &&
        draft.goldWeight.trim() &&
        `${labels.goldWeight}: ${draft.goldWeight}; ${labels.karat}: ${draft.karat}`,
      draft.metalMode === 'weight' &&
        draft.silverWeight.trim() &&
        `${labels.silverWeight}: ${draft.silverWeight}; ${labels.silverPurity}: ${draft.silverPurity}/1000`,
      t(
        'Metal valuations round to the nearest cent; the calculated nisab and 2.5% amount round up to the next cent. Check asset eligibility, debts, jewellery and hawl with your adviser. Prices and nisab were supplied by you, not a live feed.',
        'تُقرّب قيمة المعادن لأقرب جزء من مئة، ويُقرّب النصاب المحسوب ومبلغ ٢٫٥٪ إلى الجزء الأعلى من مئة. راجع الأصول والديون والحلي والحول مع مختص. الأسعار والنصاب من إدخالك وليست بيانات مباشرة.'
      ),
    ]
      .filter(Boolean)
      .join('\n')
    const url = URL.createObjectURL(
      new Blob(['\uFEFF' + contents], { type: 'text/plain;charset=utf-8' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `islamful-zakat-${draft.date}-${draft.currency}.txt`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div data-testid="zakat-calculator" lang={lang} dir={ar ? 'rtl' : 'ltr'} className="space-y-6">
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {t(
          'Use values on your Zakat date in one currency. Enter a nisab from a trusted local source, or calculate it from your chosen metal price. Prices are not fetched automatically. Amounts are calculated in this page and are not saved or sent by this calculator.',
          'استخدم القيم في تاريخ زكاتك بعملة واحدة. أدخل نصابًا من جهة محلية موثوقة، أو احسبه بسعر المعدن الذي تختاره. لا تُجلب الأسعار تلقائيًا. تُحسب المبالغ داخل الصفحة ولا تحفظها هذه الحاسبة أو ترسلها.'
        )}
      </p>
      <noscript>
        <p>
          {t(
            'Enable JavaScript to calculate. The formula and guidance below remain available.',
            'فعّل جافاسكربت للحساب. تبقى المعادلة والإرشادات أدناه متاحة.'
          )}
        </p>
      </noscript>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setNotice('')
          try {
            setResult(calculateZakat(draft))
            setError(null)
          } catch (err) {
            setResult(null)
            const known =
              err instanceof ZakatInputError ? err : new ZakatInputError('cash', 'number')
            const reason =
              known.code === 'date'
                ? t(
                    'Enter a valid date from 1900 to 2100.',
                    'أدخل تاريخًا صحيحًا من 1900 إلى 2100.'
                  )
                : known.code === 'required'
                  ? t(
                      'Enter a value. Prices and nisab must be greater than zero.',
                      'أدخل قيمة. يجب أن يكون السعر والنصاب أكبر من صفر.'
                    )
                  : known.code === 'choice'
                    ? t('Choose one of the available options.', 'اختر أحد الخيارات المتاحة.')
                    : t(
                        'Use a non-negative number without separators or exponent notation. Amounts allow 2 decimals, grams 3, and prices 6; each input is limited to 1 trillion and combined values to 9 trillion.',
                        'استخدم رقمًا غير سالب دون فواصل آلاف أو صيغة أسية. للمبالغ منزلتان عشريتان، وللأوزان ثلاث، وللأسعار ست. الحد الأقصى لكل إدخال تريليون واحد وللقيم المجمعة تسعة تريليونات.'
                      )
            setError({
              field: known.field,
              text: `${labels[known.field] || known.field}: ${reason}`,
            })
            document.getElementById(`${id}-${known.field}`)?.focus()
          }
        }}
        className="space-y-6"
      >
        <fieldset className={panelClass}>
          <legend className="px-2 text-lg font-bold">
            {t('1. Date, currency and nisab', '١. التاريخ والعملة والنصاب')}
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-date`} className="block text-sm font-medium">
                {labels.date}
              </label>
              <input
                id={`${id}-date`}
                type="date"
                value={draft.date}
                min="1900-01-01"
                max="2100-12-31"
                className={inputClass}
                onChange={(e) => update('date', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`${id}-currency`} className="block text-sm font-medium">
                {t('Currency', 'العملة')}
              </label>
              <select
                id={`${id}-currency`}
                value={pendingCurrency}
                className={inputClass}
                onChange={(e) => setPendingCurrency(e.target.value)}
              >
                {ZAKAT_CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {pendingCurrency !== draft.currency && (
                <div className="mt-2 space-y-2 text-sm">
                  <p>
                    {t(
                      'Changing currency clears the form; it does not convert amounts.',
                      'تغيير العملة يمسح النموذج ولا يحوّل المبالغ.'
                    )}
                  </p>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-2 font-semibold"
                    onClick={() => {
                      setDraft(emptyZakatDraft(draft.date, pendingCurrency))
                      setResult(null)
                      setError(null)
                      setNotice(
                        t(
                          'Currency applied. Enter all values in the new currency.',
                          'تم تغيير العملة. أدخل جميع القيم بالعملة الجديدة.'
                        )
                      )
                    }}
                  >
                    {t('Apply currency and clear', 'تطبيق العملة والمسح')}
                  </button>
                </div>
              )}
            </div>
            {select('nisabMode', [
              ['amount', t('Enter a local nisab amount', 'إدخال قيمة نصاب محلي')],
              ['gold', t('Calculate from gold', 'الحساب بالذهب')],
              ['silver', t('Calculate from silver', 'الحساب بالفضة')],
            ])}
            {draft.nisabMode === 'amount'
              ? field('nisabAmount')
              : select('convention', [
                  [
                    '87.48/612.36',
                    t('87.48 g gold / 612.36 g silver', '87.48 غ ذهب / 612.36 غ فضة'),
                  ],
                  ['85/595', t('85 g gold / 595 g silver', '85 غ ذهب / 595 غ فضة')],
                ])}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t(
              'Gold/silver standards and gram equivalents differ by authority. Follow the basis you use; sources and explanations are below. Every price must match the valuation date and currency.',
              'تختلف معايير الذهب والفضة وتقديرات الأوزان بين الجهات. اتبع الأساس المعتمد لديك؛ المصادر والتوضيح أدناه. يجب أن يوافق كل سعر تاريخ التقييم والعملة.'
            )}
          </p>
        </fieldset>
        <fieldset className={panelClass}>
          <legend className="px-2 text-lg font-bold">
            {t('2. Your zakatable assets', '٢. أموالك الزكوية')}
          </legend>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t(
              'Enter each asset once. Leave unused fields blank. Include only the eligible portion of investments; do not automatically enter an entire pension or property value. The home you live in and ordinary personal belongings are excluded.',
              'أدخل كل أصل مرة واحدة واترك الحقول غير المستخدمة فارغة. أدخل الجزء الزكوي فقط من الاستثمارات؛ لا تدخل تلقائيًا قيمة المعاش أو العقار كاملة. لا تُدرج مسكنك وأمتعتك الشخصية المعتادة.'
            )}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {MONEY_FIELDS.filter((f) => f !== 'liabilities').map((key) => (
              <div key={key}>{field(key)}</div>
            ))}
          </div>
          {select('metalMode', [
            ['value', t('Enter eligible metal values', 'إدخال قيمة المعادن الزكوية')],
            ['weight', t('Calculate from weight and purity', 'الحساب بالوزن والنقاء')],
          ])}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t(
              'Include only jewellery covered by the guidance you follow; scholars differ on personal-use jewellery. Exclude stones and non-metal parts. For mixed gold purities, enter a combined eligible valuation instead of one weight.',
              'أدرج الحلي المشمولة وفق الفتوى التي تتبعها؛ ففي حلي الاستعمال خلاف. استبعد الأحجار والأجزاء غير المعدنية. عند اختلاف عيارات الذهب أدخل قيمة إجمالية مناسبة بدل وزن واحد.'
            )}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {draft.metalMode === 'value' ? (
              <>
                {field('goldValue')}
                {field('silverValue')}
              </>
            ) : (
              <>
                {field('goldWeight', '', 3)}
                {select(
                  'karat',
                  KARATS.map((k) => [String(k), `${k}`])
                )}
                {field('silverWeight', '', 3)}
                {select(
                  'silverPurity',
                  SILVER_PURITY.map((k) => [String(k), `${k}/1000`])
                )}
              </>
            )}
          </div>
          {(draft.nisabMode === 'gold' || draft.metalMode === 'weight') &&
            field('goldPrice', `${draft.currency} / g`, 6)}
          {(draft.nisabMode === 'silver' || draft.metalMode === 'weight') &&
            field('silverPrice', `${draft.currency} / g`, 6)}
          <p className="text-xs text-gray-500">
            {t(
              'A positive metal weight requires its pure-metal price. Use a jeweller or trusted dated price source. No old example price is prefilled.',
              'يتطلب الوزن الأكبر من صفر سعر المعدن الخالص. استخدم تقييم صائغ أو مصدر أسعار موثوقًا مؤرخًا. لا نملأ الحقول بأسعار أمثلة قديمة.'
            )}
          </p>
        </fieldset>
        <fieldset className={panelClass}>
          <legend className="px-2 text-lg font-bold">
            {t('3. Deductions and lunar year', '٣. الخصومات والحول القمري')}
          </legend>
          {field('liabilities')}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t(
              'Deduct only liabilities allowed by your chosen guidance. Do not subtract a whole long-term mortgage or future living costs automatically. Debt rules vary; enter zero if your method allows no deduction.',
              'اخصم فقط الالتزامات المسموح بها وفق الفتوى التي تتبعها. لا تخصم تلقائيًا كامل التمويل طويل الأجل أو نفقات المعيشة المستقبلية. تختلف أحكام الديون؛ أدخل صفرًا إذا كان منهجك لا يجيز الخصم.'
            )}
          </p>
          {select('hawl', [
            ['unsure', t('I am not sure', 'لست متأكدًا')],
            ['yes', t('Yes, my lunar Zakat year is complete', 'نعم، اكتمل حول الزكاة القمري')],
            ['no', t('No, it is not complete yet', 'لا، لم يكتمل بعد')],
          ])}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t(
              'This is a 2.5% annual wealth calculator, not Zakat al-Fitr, crops or livestock. It does not infer your Zakat anniversary or resolve interruptions below nisab.',
              'هذه حاسبة زكاة الأموال السنوية بنسبة ٢٫٥٪، وليست لزكاة الفطر أو الزروع أو الأنعام. لا تستنتج موعد حولك أو تفصل في انقطاع النصاب.'
            )}
          </p>
        </fieldset>
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900"
          >
            {error.text}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pendingCurrency !== draft.currency}
            className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-gray-900"
          >
            {t('Calculate estimate', 'احسب التقدير')}
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(emptyZakatDraft(initialDate, draft.currency))
              setPendingCurrency(draft.currency)
              setResult(null)
              setError(null)
              setNotice(t('All inputs cleared.', 'تم مسح جميع المدخلات.'))
            }}
            className="rounded-xl border px-5 py-3"
          >
            {t('Clear all', 'مسح الكل')}
          </button>
        </div>
      </form>
      {notice && (
        <p role="status" className="text-sm">
          {notice}
        </p>
      )}
      {result && (
        <section
          ref={resultRef}
          tabIndex={-1}
          data-testid="zakat-result"
          aria-label={t('Zakat estimate result', 'نتيجة تقدير الزكاة')}
          className="space-y-5 rounded-2xl bg-gray-900 p-6 text-white outline-offset-4 sm:p-8"
        >
          <h2 className="text-xl font-semibold">{statusText(result)}</h2>
          <p className="text-sm text-gray-300">
            {draft.date} · {draft.currency} · {basisText()}
          </p>
          <dl className="space-y-3">
            {rows.map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-2">
                <dt className="text-gray-300">{label}</dt>
                <dd className="font-medium break-all">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-white/20 pt-5">
            <p>
              {result.status === 'estimate'
                ? t('Estimated annual Zakat', 'تقدير الزكاة السنوية')
                : result.status === 'below'
                  ? t('Calculated amount under this threshold', 'المبلغ المحسوب وفق هذا النصاب')
                  : t('Potential amount at 2.5%', 'المبلغ المحتمل بنسبة ٢٫٥٪')}
            </p>
            <p data-testid="zakat-amount" className="mt-2 text-3xl font-bold break-all">
              {money(result.potential)}
            </p>
          </div>
          <p className="text-sm text-gray-300">
            {t(
              'When eligible, 2.5% applies to the entire net zakatable wealth, not just the part above nisab. Metal values round to the nearest cent; calculated nisab and the 2.5% amount round up to the next cent. Net wealth is never negative.',
              'عند تحقق الشروط، تُحسب ٢٫٥٪ على كامل صافي المال الزكوي لا على الزائد عن النصاب فقط. تُقرّب قيمة المعادن لأقرب جزء من مئة، ويُقرّب النصاب المحسوب ومبلغ ٢٫٥٪ للأعلى. لا يصبح صافي المال سالبًا.'
            )}
          </p>
          {result.liabilities > result.assets && (
            <p>
              {t(
                'The entered liabilities exceed the included assets; net wealth is shown as zero.',
                'الالتزامات المدخلة تتجاوز الأصول المشمولة؛ عُرض صافي المال صفرًا.'
              )}
            </p>
          )}
          <button
            type="button"
            onClick={download}
            className="rounded-xl border border-white/40 px-4 py-3 font-medium"
          >
            {t('Download my summary (.txt)', 'تنزيل ملخصي (.txt)')}
          </button>
        </section>
      )}
    </div>
  )
}
