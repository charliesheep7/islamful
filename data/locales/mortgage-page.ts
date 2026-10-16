export const mortgagePages = {
  en: {
    title: 'Islamic Real Estate Financing Calculator',
    description:
      'Compare estimates of murabaha, ijara, and diminishing musharaka with a conventional loan.',
    intro:
      'Explore various real estate financing structures and compare their costs under the same assumptions.',
    guide: 'Understanding Islamic Real Estate Financing',
    sections: [
      [
        'Riba and Islamic Finance',
        'Riba is prohibited in the Qur’an, notably in 2:275–279. Islamic finance offers structures based on sale, lease, or partnership in an asset rather than interest-bearing loans. Compliance depends on the actual contract and its implementation; the product name alone is not sufficient.',
      ],
      [
        'Murabaha: Sale with Margin',
        'The bank purchases the property and then resells it at an agreed price that includes its margin. The sale price and installments are fixed in the contract. In this calculator, the margin is simply calculated on the financed principal, at the entered annual rate, over the entire chosen duration.',
      ],
      [
        'Ijara: Lease with Acquisition',
        'The bank holds the property and leases it to the client; a separate mechanism provides for acquisition. Here, the simulation adds a constant rent calculated on the initial principal and a constant monthly contribution toward purchase. Actual contracts may provide for rent revisions.',
      ],
      [
        'Diminishing Musharaka: Shared Ownership',
        'The client and the bank hold shares of the property. The client gradually buys out the bank’s shares and pays rent on the remaining shares. Here, the starting monthly payment remains constant, while its division between rent and acquisition evolves with the bank’s remaining share.',
      ],
      [
        'Comparing Proposals',
        'Compare total cost, down payment, monthly installments, fees, rent revision conditions, and early repayment terms. Check ownership responsibilities and contract compliance assessment. No structure is automatically the cheapest for all profiles.',
      ],
      [
        'Assumptions and Calculation Limits',
        'The results are simplified illustrations. The principal corresponds to the property value minus the down payment. Fees, taxes, insurance, rate changes, and institution-specific conditions are not included. The conventional loan uses a fixed monthly payment formula. Displayed figures are rounded; an actual offer may differ.',
      ],
      [
        'Availability and Support',
        'Products and protections vary by country and institution. Request a detailed proposal and contract explanations from a qualified professional. The UK resources below present general structures; they do not determine the rules applicable in your country.',
      ],
    ],
    faq: 'Frequently Asked Questions',
    questions: [
      [
        'Does murabaha involve compound interest?',
        'This calculator’s model applies a simple margin on the initial principal. The actual sale price and payment schedule must be verified in the contract.',
      ],
      [
        'Why does the rent decrease in musharaka?',
        'In this simulation, the monthly rent is calculated on the bank’s remaining share. It therefore decreases as this share is bought out.',
      ],
      [
        'Does the calculator confirm the religious compliance of a product?',
        'No. It illustrates calculations and does not certify any institution or contract. Have the actual terms reviewed by a qualified person.',
      ],
      [
        'How to use the comparison?',
        'Enter the same property value, down payment, and duration, then review the calculated costs for each model. The conventional rate is a separate parameter. The results do not constitute a financing recommendation.',
      ],
    ],
    sources: 'Sources and Further Reading',
  },
  ar: {
    title: 'حاسبة التمويل العقاري الإسلامي',
    description: 'قارن تقديرات المرابحة والإجارة والمشاركة التناقصية مع قرض تقليدي.',
    intro: 'استكشف عدة هياكل للتمويل العقاري وقارن تكاليفها وفقًا لنفس الفرضيات.',
    guide: 'فهم التمويل العقاري الإسلامي',
    sections: [
      [
        'الربا والتمويل الإسلامي',
        'الربا محرم في القرآن، لا سيما في ٢:٢٧٥–٢٧٩. يقدم التمويل الإسلامي هياكل قائمة على البيع أو الإيجار أو المشاركة في الأصل بدلاً من القرض بفائدة. الالتزام بالشريعة يعتمد على العقد الفعلي وتنفيذه؛ فاسم المنتج وحده لا يكفي.',
      ],
      [
        'المرابحة: البيع بالربح المحدد',
        'تشتري البنك العقار ثم تعيده للبيع بسعر متفق عليه يشمل هامش ربحها. يتم تحديد سعر البيع والأقساط في العقد. في هذه الحاسبة، يُحسب الهامش ببساطة على رأس المال الممول، بمعدل سنوي مدخل، طوال المدة المختارة.',
      ],
      [
        'الإجارة: الإيجار مع التملك',
        'تمتلك البنك العقار وتؤجره للعميل؛ ويوجد آلية منفصلة للتملك. هنا، تجمع المحاكاة إيجارًا ثابتًا محسوبًا على رأس المال الأصلي ومساهمة شهرية ثابتة للشراء. قد تنص العقود الفعلية على مراجعات للإيجار.',
      ],
      [
        'المشاركة التناقصية: الملكية المشتركة',
        'يمتلك العميل والبنك حصصًا في العقار. يشتري العميل تدريجيًا حصص البنك ويدفع إيجارًا على الحصص المتبقية. هنا، تبقى الدفعة الشهرية ثابتة، بينما يتغير توزيعها بين الإيجار والشراء حسب الحصة المتبقية للبنك.',
      ],
      [
        'مقارنة العروض',
        'قارن التكلفة الإجمالية، الدفعة المقدمة، الأقساط، الرسوم، شروط مراجعة الإيجار، وآليات السداد المبكر. تحقق من المسؤوليات المتعلقة بالملكية وتقييم التزام العقد. لا توجد هيكلية أرخص تلقائيًا لجميع الحالات.',
      ],
      [
        'الافتراضات وحدود الحساب',
        'النتائج تمثيلات مبسطة. رأس المال يعادل قيمة العقار مطروحًا منها الدفعة المقدمة. لا تشمل الحسابات الرسوم والضرائب والتأمينات وتغيرات الأسعار وشروط المؤسسات الخاصة. القرض التقليدي يستخدم صيغة قسط ثابت. الأرقام المعروضة تقريبية؛ قد تختلف العروض الحقيقية.',
      ],
      [
        'التوفر والمرافقة',
        'تختلف المنتجات والحمايات حسب البلد والمؤسسة. اطلب عرضًا مفصلًا وشرحًا للعقد من مختص مؤهل. الموارد البريطانية أدناه تعرض هياكل عامة؛ ولا تحدد القواعد المعمول بها في بلدك.',
      ],
    ],
    faq: 'الأسئلة المتكررة',
    questions: [
      [
        'هل تحتوي المرابحة على فوائد مركبة؟',
        'نموذج هذه الحاسبة يطبق هامش ربح بسيط على رأس المال الأصلي. يجب التحقق من سعر البيع الفعلي وجدول الدفعات في العقد.',
      ],
      [
        'لماذا ينخفض الإيجار في المشاركة؟',
        'في هذه المحاكاة، يُحسب الإيجار الشهري على الحصة المتبقية للبنك. لذا ينخفض مع شراء هذه الحصة.',
      ],
      [
        'هل تؤكد الحاسبة الالتزام الديني للمنتج؟',
        'لا. هي توضح الحسابات ولا تصادق على أي مؤسسة أو عقد. يجب مراجعة الشروط الفعلية من قبل شخص مؤهل.',
      ],
      [
        'كيف أستخدم المقارنة؟',
        'أدخل نفس قيمة العقار، ونفس الدفعة المقدمة، ونفس المدة، ثم راجع التكاليف المحسوبة لكل نموذج. المعدل التقليدي هو معلمة منفصلة. النتائج ليست توصية تمويلية.',
      ],
    ],
    sources: 'المصادر والقراءات',
  },
  fr: {
    title: 'Calculateur de financement immobilier islamique',
    description:
      'Comparez les estimations de mourabaha, ijara et moucharaka dégressive avec un prêt conventionnel.',
    intro:
      'Explorez plusieurs structures de financement immobilier et comparez leurs coûts selon les mêmes hypothèses.',
    guide: 'Comprendre le financement immobilier islamique',
    sections: [
      [
        'Le riba et la finance islamique',
        'Le riba est interdit dans le Coran, notamment en 2:275–279. La finance islamique propose des structures fondées sur la vente, la location ou la participation à un actif plutôt que sur un prêt à intérêt. La conformité dépend du contrat réel et de sa mise en œuvre ; le nom du produit ne suffit pas.',
      ],
      [
        'Mourabaha : vente avec marge',
        'La banque achète le bien puis le revend à un prix convenu qui comprend sa marge. Le prix de vente et les échéances sont fixés dans le contrat. Dans ce calculateur, la marge est calculée simplement sur le capital financé, au taux annuel saisi, pendant toute la durée choisie.',
      ],
      [
        'Ijara : location avec acquisition',
        'La banque détient le bien et le loue au client ; un mécanisme distinct prévoit l’acquisition. Ici, la simulation additionne un loyer constant calculé sur le capital initial et une contribution mensuelle constante à l’achat. Les contrats réels peuvent prévoir des révisions du loyer.',
      ],
      [
        'Moucharaka dégressive : propriété partagée',
        'Le client et la banque détiennent des parts du bien. Le client rachète progressivement les parts de la banque et verse un loyer sur celles qui restent. Ici, la mensualité de départ reste constante, tandis que sa répartition entre loyer et acquisition évolue avec la part restante de la banque.',
      ],
      [
        'Comparer les propositions',
        'Comparez le coût total, l’apport, les mensualités, les frais, les conditions de révision du loyer et les modalités de remboursement anticipé. Vérifiez les responsabilités liées à la propriété et l’évaluation de conformité du contrat. Aucune structure n’est automatiquement la moins chère pour tous les profils.',
      ],
      [
        'Hypothèses et limites du calcul',
        'Les résultats sont des illustrations simplifiées. Le capital correspond à la valeur du bien diminuée de l’apport. Les frais, taxes, assurances, changements de taux et conditions propres à un établissement ne sont pas inclus. Le prêt conventionnel utilise une formule de mensualité constante. Les chiffres affichés sont arrondis ; une offre réelle peut être différente.',
      ],
      [
        'Disponibilité et accompagnement',
        'Les produits et protections varient selon le pays et l’établissement. Demandez une proposition détaillée et des explications sur le contrat auprès d’un professionnel compétent. Les ressources britanniques ci-dessous présentent des structures générales ; elles ne déterminent pas les règles applicables dans votre pays.',
      ],
    ],
    faq: 'Questions fréquentes',
    questions: [
      [
        'La mourabaha comporte-t-elle des intérêts composés ?',
        'Le modèle de ce calculateur applique une marge simple au capital initial. Le prix de vente réel et le calendrier des paiements doivent être vérifiés dans le contrat.',
      ],
      [
        'Pourquoi le loyer diminue-t-il en moucharaka ?',
        'Dans cette simulation, le loyer mensuel est calculé sur la part restante de la banque. Il diminue donc à mesure que cette part est rachetée.',
      ],
      [
        'Le calculateur confirme-t-il la conformité religieuse d’un produit ?',
        'Non. Il illustre des calculs et ne certifie aucun établissement ni contrat. Faites examiner les conditions réelles par une personne qualifiée.',
      ],
      [
        'Comment utiliser la comparaison ?',
        'Saisissez la même valeur de bien, le même apport et la même durée, puis examinez les coûts calculés pour chaque modèle. Le taux conventionnel est un paramètre séparé. Les résultats ne constituent pas une recommandation de financement.',
      ],
    ],
    sources: 'Sources et lectures',
  },
  de: {
    title: 'Rechner für islamische Immobilienfinanzierung',
    description:
      'Vergleiche Schätzungen für Murabaha, Idscharah und abnehmende Muscharaka mit einem konventionellen Darlehen.',
    intro:
      'Erkunde verschiedene Finanzierungsmodelle und vergleiche ihre Kosten unter denselben Annahmen.',
    guide: 'Islamische Immobilienfinanzierung verstehen',
    sections: [
      [
        'Riba und islamische Finanzierung',
        'Riba wird im Koran verboten, unter anderem in 2:275–279. Islamische Finanzierung verwendet Strukturen auf Grundlage von Verkauf, Miete oder Beteiligung an einem Vermögenswert statt eines verzinsten Darlehens. Entscheidend für die Konformität sind der tatsächliche Vertrag und seine Umsetzung, nicht allein die Produktbezeichnung.',
      ],
      [
        'Murabaha: Verkauf mit Aufschlag',
        'Die Bank kauft die Immobilie und verkauft sie zu einem vereinbarten Preis einschließlich Gewinnaufschlag weiter. Verkaufspreis und Zahlungsplan werden vertraglich festgelegt. Dieser Rechner berechnet einen einfachen Aufschlag auf den finanzierten Betrag zum eingegebenen Jahressatz über die gewählte Laufzeit.',
      ],
      [
        'Idscharah: Miete mit Erwerb',
        'Die Bank besitzt die Immobilie und vermietet sie; eine gesonderte Vereinbarung regelt den Erwerb. Die Simulation addiert eine gleichbleibende Miete auf den anfänglichen Finanzierungsbetrag und einen festen monatlichen Kaufbeitrag. Tatsächliche Verträge können Mietanpassungen vorsehen.',
      ],
      [
        'Abnehmende Muscharaka: gemeinsames Eigentum',
        'Kunde und Bank besitzen Anteile an der Immobilie. Der Kunde kauft den Bankanteil schrittweise auf und zahlt Miete auf den verbleibenden Anteil. Hier bleibt die anfängliche Monatszahlung konstant, während sich ihre Aufteilung zwischen Miete und Anteilserwerb mit dem verbleibenden Bankanteil verändert.',
      ],
      [
        'Angebote vergleichen',
        'Vergleiche Gesamtkosten, Eigenmittel, Monatszahlungen, Gebühren, Mietanpassungen und Bedingungen für vorzeitige Rückzahlungen. Prüfe die Eigentümerpflichten und die Bewertung der Vertragskonformität. Kein Modell ist automatisch für alle am günstigsten.',
      ],
      [
        'Annahmen und Grenzen',
        'Die Ergebnisse sind vereinfachte Rechenbeispiele. Der finanzierte Betrag entspricht dem Immobilienwert abzüglich der Eigenmittel. Gebühren, Steuern, Versicherungen, Zinsänderungen und anbieterspezifische Bedingungen sind nicht enthalten. Das konventionelle Darlehen verwendet eine Annuitätenformel. Angezeigte Beträge werden gerundet; ein tatsächliches Angebot kann davon abweichen.',
      ],
      [
        'Verfügbarkeit und Beratung',
        'Produkte und Schutzvorschriften unterscheiden sich je nach Land und Anbieter. Lass dir ein detailliertes Angebot und den Vertrag von einer qualifizierten Fachperson erläutern. Die folgenden britischen Quellen erklären allgemeine Strukturen; sie bestimmen nicht die in deinem Land geltenden Regeln.',
      ],
    ],
    faq: 'Häufige Fragen',
    questions: [
      [
        'Gibt es bei Murabaha Zinseszinsen?',
        'Das Modell dieses Rechners berechnet einen einfachen Aufschlag auf den anfänglichen Finanzierungsbetrag. Prüfe den tatsächlichen Verkaufspreis und Zahlungsplan im Vertrag.',
      ],
      [
        'Warum sinkt die Miete bei Muscharaka?',
        'Die monatliche Miete wird hier auf den verbleibenden Bankanteil berechnet. Sie sinkt daher mit dessen schrittweisem Erwerb.',
      ],
      [
        'Bestätigt der Rechner die religiöse Konformität eines Produkts?',
        'Nein. Er veranschaulicht Berechnungen und zertifiziert weder Anbieter noch Verträge. Lass die tatsächlichen Bedingungen fachkundig prüfen.',
      ],
      [
        'Wie nutze ich den Vergleich?',
        'Gib denselben Immobilienwert, dieselben Eigenmittel und dieselbe Laufzeit ein und vergleiche die berechneten Kosten. Der konventionelle Zinssatz ist eine gesonderte Eingabe. Die Ergebnisse sind keine Finanzierungsempfehlung.',
      ],
    ],
    sources: 'Quellen und weitere Informationen',
  },
} as const
