# Gold Zakat calculator — source and calculation review

Reviewed 13 October 2026 for `/zakat-calculator/gold` and `/ar/zakat-calculator/gold`. This is an editorial check against primary institutional guidance, not independent scholarly endorsement. The two pages implement assignments is-015 and is-055; their original SEMrush observations remain in the canonical queue.

## Sources read

- [IslamQA, answer 193553](https://islamqa.info/ar/answers/193553): documents a pure-metal basis and 85 g of 24K gold. Supports the explicitly labelled 85 g pure-gold option and purity conversion. This is a named approach, not a claim of universal agreement.
- [Islamic Relief UK, Zakat on jewellery](https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/zakat-on-jewellery/): publishes the 87.48 g threshold, 2.5% rate, treatment of metal within jewellery, and differences concerning personal-use jewellery. Its displayed market prices were not copied or presented as a live feed.
- [Dar al-Ifta, fatwa 22484](https://dar-alifta.org/ar/fatwa/details/22484/حكم-زكاة-الذهب-الذي-تتخذه-المرأة-للزينة): distinguishes qualifying adornment from pure saving/investment and specifies an 85 g **21K** basis in this ruling. The page explicitly names that distinction. It is not used as evidence for an 85 g pure-gold default. A local monetary nisab accommodates this or other appropriate bases.
- [National Zakat Foundation, lunar-year anniversary](https://nzf.org.uk/knowledge/is-zakat-binding-only-after-the-passing-of-a-lunar-year/): distinguishes the owner's annual anniversary from a separate holding year for every new asset. The form asks about the owner's Zakat year, not the age of every piece.

Sources were opened and read through the web tool. No rate provider credentials are needed; visitors supply a price for their valuation date. Current automated metal-price delivery remains a separate unfinished capability.

## Scope and arithmetic

This is a gold-only valuation experience for up to 20 separate weight/purity entries. Users choose inclusion or exclusion of qualifying personal jewellery; savings/investment entries remain included. White-gold alloy weight can be entered at its karat, excluding stones or non-gold attachments. Plated jewellery and workmanship valuation are outside this model. A full-wealth calculator link remains visible below the result.

Weight accepts three decimal places; a 24K price accepts six; an entered monetary nisab accepts two. Arabic and Persian numerals normalize before strict decimal validation. Negative, ambiguous grouped, exponential, missing and overflowing inputs fail visibly. Supported currencies currently all use two decimal places.

Each included value is `weight × karat / 24 × 24K price`. Integer numerators preserve exact fractions across lots, threshold comparison and the 2.5% calculation. Splitting one entry cannot change the result. Displayed values round to two decimals; calculated nisab and the potential payment round upwards. A rounded display equal to the threshold does not override the exact below-threshold comparison. Per-item display amounts in a download need not sum exactly to the aggregate because rounding happens only after aggregation.

A completed lunar-year answer gives a conditional annual estimate. Incomplete and unknown answers remain planning states. A below-threshold result explicitly applies to the entered gold only; it does not declare that the visitor owes no Zakat on other wealth. The tool does not determine personal eligibility, track historical nisab continuity, aggregate other assets or deduct debt.

Changing any input invalidates the old result. Currency changes require applying a reset of prices/monetary nisab; weights and purities remain and are never treated as converted prices. All calculation and text export occur in the browser. The component makes no network calls and stores no balances. An open browser page may of course retain its state until cleared, reloaded or closed.

## Verification

Eight gold arithmetic tests plus the ten existing Zakat tests pass. Cases cover mixed purities, exact equality, display-rounding boundaries, exclusion choices, invalid input, Arabic/Persian numerals and splitting/order invariance. Production build passed. Browser checks cover English/Arabic mobile, result focus, mixed entries, manual threshold, currency reset, invalidation, offline calculation/download, no submitted amounts, reload reset, clear, no-JavaScript guidance, matching FAQ/schema and both sitemap entries. Source and code review preserves a clear explanation of model boundaries instead of a generic all-schools ruling.

Publishing completion is recorded only after the actual Production deployment and live English/Arabic calculation checks.
