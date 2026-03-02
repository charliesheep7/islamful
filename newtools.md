# Potential New Tools for Islamful

> Based on research into Muslim daily pain points, existing market gaps, and search demand.

---

## Current Tools (All Live)

1. **Prayer Times** — Location-based salah times (Aladhan API)
2. **Is This Haram?** — AI-powered halal/haram checker
3. **Dua Collection** — Curated duas for every occasion
4. **Dhikr Counter** — Digital tasbeeh counter
5. **99 Names of Allah** — Meanings, audio, explanations
6. **Islamic Calendar** — Hijri-Gregorian converter + events
7. **Zakat Calculator** — Calculate zakat on wealth/assets

---

## Proposed New Tools

### Tier 1 — High Demand, Clear Gap, Simple to Build

#### 1. Islamic Inheritance Calculator (Faraid/Mirath)

- **Pain point:** Islamic inheritance law is extremely complex. The Quran specifies exact shares (Surah An-Nisa 4:11-12, 4:176) but calculating them with multiple heirs, debts, and edge cases (awl, radd) is error-prone. Most Muslims have no idea how to distribute an estate correctly.
- **Search demand:** High. Many existing tools exist (almwareeth.com, islamicinheritance.com, faraid.net) but most are ugly, complex, or app-only. None dominate SEO.
- **What it does:** User inputs: who died (male/female), surviving relatives (spouse, children, parents, siblings), estate value, debts. Tool outputs exact shares per heir with Quranic references.
- **Differentiator:** Clean web UI, bilingual (en/ar), cite Quran ayat for each share, support multiple madhabs (Hanafi/Shafi'i/Maliki/Hanbali).
- **pSEO potential:** Moderate — pages by scenario ("inheritance with wife and 2 sons", "inheritance with no children").
- **Complexity:** Medium. The math is well-defined (finite rules from Quran + scholarly consensus). Can be fully client-side.

#### 2. Qibla Finder / Compass

- **Pain point:** Muslims need to face Makkah for prayer. Travelers, new Muslims, and anyone in an unfamiliar location need this constantly. Phone compass apps exist but a web-based tool is useful when you don't want to install anything.
- **Search demand:** Very high. "Qibla direction" and "Qibla compass" are consistently high-volume searches.
- **What it does:** Uses device GPS + compass API to show real-time Qibla direction. Also shows bearing angle from any city.
- **Differentiator:** Works in browser (no app install), integrates with existing prayer times city pages (add Qibla bearing per city — genuinely unique data per city page).
- **pSEO potential:** High — "Qibla direction from London", "Qibla direction from New York" for every city page.
- **Complexity:** Low. Simple trigonometry (great circle bearing from coordinates to Kaaba 21.4225°N, 39.8262°E). Device Orientation API for compass.

#### 3. Halal Mortgage / Islamic Finance Calculator

- **Pain point:** Riba (interest) is clearly haram in Islam. Millions of Muslims struggle with home buying — conventional mortgages involve interest, and Islamic alternatives (Murabaha, Ijara, Diminishing Musharaka) are confusing. Muslims need to compare options and understand the true cost.
- **Search demand:** High and growing. Islamic finance is a $4T+ industry. "Halal mortgage calculator", "Islamic finance calculator", "is mortgage haram" are high-volume searches.
- **What it does:** Three modes:
  - **Murabaha calculator** — bank buys property, sells to you at markup. Shows total cost vs conventional mortgage.
  - **Ijara calculator** — lease-to-own. Shows monthly rent + purchase schedule.
  - **Diminishing Musharaka calculator** — co-ownership with gradual buyout. Shows equity progression over time.
  - **Comparison mode** — side-by-side: conventional mortgage vs each Islamic alternative.
- **Differentiator:** Most existing tools are from specific banks (biased). A neutral, educational comparison tool with clear explanations of why interest is haram + what the alternatives actually mean.
- **pSEO potential:** High — by country/currency ("Islamic mortgage calculator UK", "halal home financing USA", "Islamic mortgage calculator UAE").
- **Complexity:** Medium. The math is straightforward. The value is in clear UX and education.

---

### Tier 2 — Strong Demand, Moderate Effort

#### 4. Quran Word-by-Word Reader

- **Pain point:** Non-Arabic-speaking Muslims (majority of the 1.8B Muslims worldwide) struggle to understand what they're reciting in prayer. Word-by-word translation bridges the gap between phonetic recitation and actual comprehension.
- **Search demand:** High. Tools like QuranWBW.com and Tarteel exist but are either cluttered or app-only.
- **What it does:** Clean, distraction-free interface to read any surah with word-by-word translation, transliteration, and audio. Focus on the last 10 surahs (most commonly recited in prayer) as a starting point.
- **Differentiator:** Web-based (no app), minimal design, focused on surahs used in daily prayer, integrated with existing Islamful tools.
- **pSEO potential:** Very high — 114 surah pages, individual ayah pages. "Surah Al-Fatiha word by word", "Surah Al-Ikhlas meaning" etc.
- **Complexity:** High. Needs a good Quran data source (word-by-word corpus), audio files, and careful typography for Arabic.

#### 5. Ramadan Planner / Tracker

- **Pain point:** During Ramadan, Muslims need to track fasting times (suhoor/iftar), increase Quran reading (goal: finish in 30 days), increase charity, and plan taraweeh prayers. It's a lot to manage for 30 days.
- **Search demand:** Extremely high but seasonal (spikes massively every Ramadan). "Ramadan timetable", "Ramadan planner", "how many pages of Quran per day".
- **What it does:** Daily Ramadan dashboard: suhoor/iftar times (from prayer times API), daily Quran reading plan (juz/day tracker), daily dua, good deed tracker, countdown to Eid.
- **Differentiator:** Combines multiple tools (prayer times + Quran reading + dhikr) into one Ramadan-specific experience. Most tools treat Ramadan as just "different prayer times."
- **pSEO potential:** Very high but seasonal — "Ramadan 2027 timetable London", "Ramadan schedule New York" etc.
- **Complexity:** Medium. Mostly combining existing data (prayer times API) with a planning UI.

#### 6. Hadith Search / Explorer

- **Pain point:** Muslims frequently need to look up hadiths (sayings of the Prophet ﷺ) for daily guidance, settling discussions, or learning. Current tools (sunnah.com) are functional but basic in UX.
- **Search demand:** Very high. "Hadith about patience", "hadith on kindness", "sahih bukhari hadith" are massive search terms.
- **What it does:** Search across major hadith collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, etc.) by keyword or topic. Show Arabic + English + grade (sahih/hasan/da'if).
- **Differentiator:** Clean UI, topic-based browsing (not just collection-based), integrated with dua collection.
- **pSEO potential:** Extremely high — individual hadith pages, topic pages, collection pages.
- **Complexity:** High. Needs a reliable hadith database/API.

---

### Tier 3 — Niche but Valuable

#### 7. Islamic Will Generator (Wasiyyah)

- **Pain point:** Most Muslims don't have an Islamic will, even though it's strongly recommended (some scholars say obligatory). The inheritance calculator (Tool #1) tells you the shares — this tool helps you actually write the document.
- **Search demand:** Moderate. "Islamic will template", "Muslim will", "wasiyyah template".
- **What it does:** Guided form that generates a basic Islamic will document. Includes: shahada declaration, debt instructions, funeral wishes (ghusl, janazah, burial), estate distribution per Faraid, guardianship for minors, charitable bequests (max 1/3).
- **Differentiator:** Free. Most Islamic will services charge $50-200+ (e.g., ShariWiz). A basic template generator would serve the majority.
- **pSEO potential:** Moderate — by country ("Islamic will template UK", "Muslim will USA").
- **Complexity:** Medium. Legal disclaimers are critical (not legal advice).

#### 8. Mosque Finder

- **Pain point:** Travelers and new Muslims need to find nearby mosques. Google Maps works but doesn't filter by madhab, language, or facilities (women's section, parking, wheelchair access).
- **Search demand:** High. "Mosque near me", "masjid near me" are massive queries — but Google Maps dominates this SERP.
- **What it does:** Map-based mosque finder with Islamic-specific filters. Pull from existing mosque databases / APIs.
- **Differentiator:** Hard to beat Google Maps here. Lower priority unless we can add unique value (prayer time integration, community reviews).
- **pSEO potential:** High — "mosques in London", "mosques in Houston" etc.
- **Complexity:** High. Needs mosque database, map integration, potentially user-submitted data.

#### 9. Nikah (Marriage) Cost Planner

- **Pain point:** Muslim weddings have specific requirements (mahr, walimah) but costs spiral. Young Muslims especially struggle with planning an affordable, sunnah-compliant wedding.
- **Search demand:** Moderate. "Mahr calculator", "nikah cost", "simple Muslim wedding budget".
- **What it does:** Budget planner with Islamic-specific categories: mahr, venue, walimah, clothing, gifts. Shows what's obligatory (mahr, walimah) vs cultural additions. Tips for keeping it sunnah-simple.
- **Complexity:** Low. Mostly a specialized budget calculator with educational content.

#### 10. Islamic Baby Name Finder

- **Pain point:** Muslim parents spend significant time choosing a meaningful Islamic name. They want to know the meaning, Arabic spelling, Quranic reference (if any), and whether it's authentically Islamic.
- **Search demand:** Very high. "Muslim baby names", "Islamic names for boys", "Quranic names for girls" are massive evergreen searches.
- **What it does:** Searchable database of Islamic names with: meaning, Arabic spelling, gender, origin (Quranic/Arabic/Persian/Turkish), popularity, and scholarly notes.
- **pSEO potential:** Extremely high — individual name pages ("Aisha meaning", "Omar meaning in Islam"). Could be 500+ pages.
- **Complexity:** Medium. Needs a curated name database. Data is widely available but needs verification.

---

## Summary: Priority Ranking

| #   | Tool                              | Demand               | Gap in Market     | Build Effort | pSEO Potential    | Recommended              |
| --- | --------------------------------- | -------------------- | ----------------- | ------------ | ----------------- | ------------------------ |
| 1   | Qibla Finder                      | Very High            | Medium            | Low          | High (city pages) | **YES — Build First**    |
| 2   | Islamic Inheritance Calculator    | High                 | Medium            | Medium       | Moderate          | **YES**                  |
| 3   | Halal Mortgage/Finance Calculator | High                 | High              | Medium       | High              | **YES**                  |
| 4   | Islamic Baby Name Finder          | Very High            | Low (crowded)     | Medium       | Very High         | **YES** (SEO play)       |
| 5   | Ramadan Planner                   | Very High (seasonal) | Medium            | Medium       | High              | **YES** (time-sensitive) |
| 6   | Quran Word-by-Word                | High                 | Medium            | High         | Very High         | Maybe (high effort)      |
| 7   | Hadith Explorer                   | Very High            | Low               | High         | Very High         | Maybe (data-heavy)       |
| 8   | Islamic Will Generator            | Moderate             | High              | Medium       | Moderate          | Maybe                    |
| 9   | Mosque Finder                     | High                 | Low (Google Maps) | High         | High              | Probably Not             |
| 10  | Nikah Cost Planner                | Low-Moderate         | High              | Low          | Low               | Later                    |

---

## Sources

- [Islamic Finance Guru — Best Islamic Mortgage Calculators](https://www.islamicfinanceguru.com/articles/best-islamic-mortgage-calculators)
- [IslamicInheritance.com — Free Faraid Calculator](https://islamicinheritance.com/calculator/)
- [Zoya — Halal Investing App](https://zoya.finance/)
- [QuranWBW.com — Word by Word Translation](https://quranwbw.com/)
- [Greentech Apps Foundation — Islamic Computing Research](https://gtaf.org/blog/islamic-computing-research-agenda/)
- [Islamic Finance Guru — What is Riba](https://www.islamicfinanceguru.com/articles/what-is-riba-interest-a-detailed-definition-guide)
- [Al-Wirasat — Islamic Inheritance Calculator](https://alwirasat.com/)
- [Guidance Residential — Islamic Home Finance](https://www.guidanceresidential.com/home-finance-calculators)
- [DXB Apps — Top Ramadan Apps 2026](https://dxbapps.com/blog/apps-for-ramadan)
- [DeenIn — Best Islamic Apps 2025](https://deenin.com/blogs/all-blogs/best-islamic-apps-in-2025)
