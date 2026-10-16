export const inheritancePages = {
  en: {
    title: 'Islamic Inheritance Calculator (Faraid)',
    description:
      'Explore inheritance shares for a spouse, parents, children and full siblings using a simplified Sunni model.',
    intro:
      'Enter the estate and surviving heirs to explore their shares. Have any real distribution checked by a qualified specialist.',
    heading: 'Understanding inheritance shares',
    sources: 'Read the source references',
    sections: [
      [
        'Faraid and this model',
        'Faraid is the study of prescribed inheritance shares in Islamic law. Relationships and the presence of other heirs determine the distribution. This calculator covers a limited set of family structures using a simplified Sunni model; it does not settle an actual estate.',
      ],
      [
        'The Quranic foundation',
        'Quran 4:11 and 4:12 address children, parents and spouses, among others. Verse 4:176 addresses a case involving siblings. The rules also draw on hadith and juristic interpretation. Read the references in context.',
      ],
      [
        'Fixed shares',
        'The basic fractions include 1/2, 1/4, 1/8, 2/3, 1/3 and 1/6. The presence of another heir can change a share or exclude someone. In the spouse-and-both-parents cases without descendants or multiple siblings, this model gives the mother one third of the remainder after the spouse.',
      ],
      [
        'Residual shares',
        'Some heirs receive what remains after fixed shares. A father with daughters can receive his fixed sixth plus residue. Full siblings can receive residue with daughters when no son or father blocks them. Each result row is the total for its heir group, not a per-person amount.',
      ],
      [
        'Debts and bequests',
        'The model deducts debts and funeral expenses first, then caps the requested bequest at one third of what remains. It shows when a bequest has been reduced. Whether a particular bequest is valid depends on the beneficiaries and applicable rules; this form does not decide that question.',
      ],
      [
        'Awl, radd and unallocated amounts',
        'Awl reduces fixed shares proportionally when their total exceeds the estate. This model applies radd to eligible non-spouse fixed-share heirs when no residuary takes the remainder. If only a spouse is entered, the remainder stays unallocated for specialist review. These choices do not represent every school or local legal system.',
      ],
      [
        'Scope and rounding',
        'The form covers one spouse, parents, sons, daughters and full siblings. It does not cover grandparents, grandchildren, half-siblings or multiple wives. Values are rounded to cents and rounding cents go to the largest fractional remainders. Other heirs, valid claims and local law can change the distribution.',
      ],
    ],
    questions: [
      [
        'What does faraid mean?',
        'It refers to prescribed inheritance shares and their study in Islamic law. Quran 4:11, 4:12 and 4:176 are important foundations.',
      ],
      [
        'Why are shares adjusted?',
        'Awl proportionally reduces shares that exceed the whole. Radd returns certain remainders under this model. A specialist should verify the treatment for an actual case.',
      ],
      [
        'Are the amounts per person?',
        'No. Each row shows the total for the displayed heir group. A count appears next to the name when there is more than one person.',
      ],
      [
        'Can I share my calculation?',
        'Sharing sends the public calculator link. It does not send your entered amounts or family details.',
      ],
    ],
  },
  ar: {
    title: 'حاسبة المواريث (الفرائض)',
    description:
      'استكشف أنصبة الزوج أو الزوجة والوالدين والأبناء والبنات والأشقاء باستخدام نموذج سني مبسط.',
    intro: 'أدخل التركة والورثة الأحياء لاستكشاف الأنصبة. يجب مراجعة أي تقسيم فعلي مع مختص مؤهل.',
    heading: 'فهم أنصبة الميراث',
    sources: 'قراءة المراجع',
    sections: [
      [
        'الفرائض وهذا النموذج',
        'الفرائض علم الأنصبة المقدرة في الميراث. تحدد صلة القرابة ووجود الورثة الآخرين التوزيع. تغطي هذه الحاسبة مجموعة محدودة من الحالات الأسرية وفق نموذج سني مبسط، ولا تفصل في تركة فعلية.',
      ],
      [
        'الأساس القرآني',
        'تتناول الآيتان ١١ و١٢ من سورة النساء الأبناء والوالدين والزوجين وغيرهم. وتتناول الآية ١٧٦ حالة تتعلق بالإخوة. تستند الأحكام أيضاً إلى الحديث والاجتهاد الفقهي؛ اقرأ المراجع في سياقها.',
      ],
      [
        'الأنصبة المقدرة',
        'تشمل الكسور الأساسية النصف والربع والثمن والثلثين والثلث والسدس. قد يغير وجود وارث آخر النصيب أو يحجب وارثاً. في حالتي الزوج أو الزوجة مع الأبوين دون فرع وارث أو جمع من الإخوة، يعطي هذا النموذج الأم ثلث الباقي بعد نصيب الزوج أو الزوجة.',
      ],
      [
        'التعصيب والباقي',
        'يرث بعض الورثة الباقي بعد الفروض. قد يأخذ الأب مع البنات سدسه المفروض وما بقي. وقد يرث الأشقاء الباقي مع البنات عند عدم وجود ابن أو أب يحجبهم. يعرض كل صف مجموع نصيب المجموعة لا نصيب الفرد.',
      ],
      [
        'الديون والوصايا',
        'يخصم النموذج الديون ومصاريف الجنازة أولاً، ثم يحدد الوصية المطلوبة بثلث ما بقي. ويُظهر تنبيهاً عند تخفيضها. تعتمد صحة الوصية المعينة على المستفيدين والأحكام المطبقة؛ ولا يقرر النموذج صحتها.',
      ],
      [
        'العول والرد والباقي غير الموزع',
        'يخفض العول الفروض نسبياً عندما يتجاوز مجموعها التركة. يطبق هذا النموذج الرد على المستحقين غير الزوجين إذا لم يوجد عاصب يأخذ الباقي. إذا أُدخل الزوج أو الزوجة وحده، يبقى الباقي غير موزع لمراجعة مختص. لا تمثل هذه الاختيارات جميع المذاهب أو القوانين المحلية.',
      ],
      [
        'نطاق الحاسبة والتقريب',
        'يشمل النموذج زوجاً واحداً أو زوجة واحدة، والوالدين، والأبناء والبنات، والأشقاء. لا يشمل الأجداد والأحفاد والإخوة غير الأشقاء وتعدد الزوجات. تُقرب القيم إلى أجزاء المائة وتوزع فروق التقريب على أكبر البواقي الكسرية. قد يغير الورثة الآخرون والحقوق الثابتة والقانون المحلي التوزيع.',
      ],
    ],
    questions: [
      [
        'ما معنى الفرائض؟',
        'هي الأنصبة المقدرة في الميراث وعلم دراستها في الشريعة. الآيات ١١ و١٢ و١٧٦ من سورة النساء من أسسها المهمة.',
      ],
      [
        'لماذا تُعدل الأنصبة؟',
        'يخفض العول الأنصبة التي يتجاوز مجموعها التركة، ويعيد الرد بعض البواقي وفق هذا النموذج. يجب أن يتحقق مختص من المعالجة المناسبة لكل حالة فعلية.',
      ],
      [
        'هل المبالغ لكل فرد؟',
        'لا. يعرض كل صف المبلغ الإجمالي لمجموعة الورثة المعروضة، ويظهر عدد أفرادها بجانب الاسم عندما يزيد على واحد.',
      ],
      [
        'هل يمكنني مشاركة حسابي؟',
        'ترسل المشاركة الرابط العام للحاسبة، ولا ترسل المبالغ المدخلة أو تفاصيل الأسرة.',
      ],
    ],
  },
  fr: {
    title: 'Calculateur de succession islamique (faraïd)',
    description:
      'Explorez une répartition indicative entre conjoint, parents, enfants et frères et sœurs germains, avec les références coraniques.',
    intro:
      'Indiquez la succession et les héritiers pour explorer les parts du modèle. Faites vérifier tout partage réel par un spécialiste.',
    heading: 'Comprendre les parts successorales',
    sections: [
      [
        'Les faraïd',
        'Les faraïd désignent les parts successorales étudiées en droit islamique. Le lien de parenté et la présence d’autres héritiers déterminent la répartition. Cet outil illustre un ensemble limité de configurations familiales ; il ne règle pas une succession réelle.',
      ],
      [
        'Les références coraniques',
        'Les versets 4:11 et 4:12 de la sourate An-Nisa abordent notamment les enfants, les parents et les conjoints. Le verset 4:176 traite d’une situation concernant les frères et sœurs. Lisez ces passages dans leur contexte, avec les explications appropriées.',
      ],
      [
        'Les parts fixes',
        'Les fractions de référence comprennent 1/2, 1/4, 1/8, 2/3, 1/3 et 1/6. Il ne suffit pas de connaître le lien familial pour choisir une fraction : les autres héritiers peuvent modifier la part ou empêcher une personne d’hériter.',
      ],
      [
        'Le reliquat',
        'Certains héritiers reçoivent ce qui reste après les parts fixes. Le résultat du calculateur indique « Reliquat » pour les lignes concernées. Chaque ligne et chaque montant correspondent au groupe affiché ; le nombre entre parenthèses indique combien de personnes il comprend.',
      ],
      [
        'Dettes, frais et legs',
        'Renseignez séparément la valeur totale, les dettes et frais funéraires, et les legs envisagés. Le montant réellement disponible doit être établi avant tout partage. La validité des legs, les bénéficiaires autorisés et les limites applicables nécessitent une vérification adaptée à la situation.',
      ],
      [
        'Awl et radd',
        'Le modèle applique un ajustement proportionnel lorsque les parts fixes dépassent le total : c’est l’awl. Il peut aussi redistribuer un reliquat selon ses règles de radd. Ces traitements ne représentent pas toutes les positions juridiques ni toutes les règles locales.',
      ],
      [
        'Les limites de cet outil',
        'Le formulaire couvre un conjoint, le père, la mère, les fils, les filles et les frères et sœurs germains. Il ne couvre pas les grands-parents, petits-enfants, demi-frères et demi-sœurs, ni plusieurs épouses. Les cas particuliers et les règles civiles peuvent changer le résultat. Consultez un spécialiste avant toute décision ou tout versement.',
      ],
    ],
    questions: [
      [
        'Que signifie faraïd ?',
        'Ce terme désigne les parts successorales prescrites et leur étude en droit islamique. Les versets 4:11, 4:12 et 4:176 font partie des références essentielles.',
      ],
      [
        'Pourquoi les parts sont-elles ajustées ?',
        'Dans ce modèle, l’awl réduit proportionnellement des parts dont la somme dépasse le total. Le radd redistribue certains reliquats. Faites vérifier le traitement adapté à votre cas.',
      ],
      [
        'Les montants sont-ils individuels ?',
        'Non. Chaque ligne indique le montant total du groupe d’héritiers affiché. Le nombre de membres figure à côté du nom lorsqu’il dépasse un.',
      ],
      [
        'Puis-je partager mon calcul ?',
        'Le bouton de partage envoie le lien public du calculateur. Il ne transmet ni les montants saisis ni la composition de votre famille.',
      ],
    ],
    sources: 'Lire les passages de référence',
  },
  de: {
    title: 'Rechner für islamisches Erbrecht (Faraid)',
    description:
      'Erkunde eine beispielhafte Verteilung zwischen Ehepartner, Eltern, Kindern und Vollgeschwistern mit Koranverweisen.',
    intro:
      'Gib Nachlass und Erben ein, um die Anteile des Modells zu erkunden. Lass jede tatsächliche Erbteilung fachkundig prüfen.',
    heading: 'Erbanteile verstehen',
    sections: [
      [
        'Was sind Faraid?',
        'Faraid bezeichnet die Erbanteile und ihre Behandlung im islamischen Recht. Verwandtschaft und weitere vorhandene Erben bestimmen die Verteilung. Dieses Werkzeug veranschaulicht eine begrenzte Auswahl an Familienkonstellationen; es regelt keinen tatsächlichen Nachlass.',
      ],
      [
        'Die Koranverweise',
        'Die Verse 4:11 und 4:12 der Sure An-Nisa behandeln unter anderem Kinder, Eltern und Ehepartner. Vers 4:176 behandelt eine Konstellation mit Geschwistern. Lies diese Stellen im Zusammenhang und mit den passenden Erläuterungen.',
      ],
      [
        'Feste Anteile',
        'Zu den grundlegenden Bruchteilen gehören 1/2, 1/4, 1/8, 2/3, 1/3 und 1/6. Die Verwandtschaft allein bestimmt den Anteil nicht: Andere Erben können ihn verändern oder eine Person vom Erben ausschließen.',
      ],
      [
        'Der Restanteil',
        'Bestimmte Erben erhalten den Rest nach den festen Anteilen. Der Rechner kennzeichnet entsprechende Zeilen als „Restanteil“. Jede Zeile und jeder Betrag gilt für die angezeigte Gruppe; die Zahl in Klammern gibt deren Mitgliederzahl an.',
      ],
      [
        'Schulden, Kosten und Vermächtnisse',
        'Trage den Gesamtwert, Schulden und Bestattungskosten sowie vorgesehene Vermächtnisse getrennt ein. Vor einer Verteilung muss der tatsächlich verfügbare Nachlass feststehen. Die Wirksamkeit von Vermächtnissen, zulässige Begünstigte und geltende Grenzen müssen für den Einzelfall geprüft werden.',
      ],
      [
        'Awl und Radd',
        'Übersteigen die festen Anteile zusammen das Ganze, passt das Modell sie proportional an: Dies heißt Awl. Nach seinen Radd-Regeln kann es auch einen Rest zurückverteilen. Diese Verfahren bilden nicht alle Rechtsauffassungen oder örtlichen Regelungen ab.',
      ],
      [
        'Grenzen des Werkzeugs',
        'Das Formular umfasst einen Ehepartner, Vater, Mutter, Söhne, Töchter und Vollgeschwister. Großeltern, Enkel, Halbgeschwister und mehrere Ehefrauen werden nicht erfasst. Sonderfälle und staatliches Recht können das Ergebnis verändern. Hole vor Entscheidungen oder Auszahlungen fachkundigen Rat ein.',
      ],
    ],
    questions: [
      [
        'Was bedeutet Faraid?',
        'Der Begriff bezeichnet die vorgeschriebenen Erbanteile und ihre Untersuchung im islamischen Recht. Die Verse 4:11, 4:12 und 4:176 gehören zu den wesentlichen Grundlagen.',
      ],
      [
        'Warum werden Anteile angepasst?',
        'Awl kürzt in diesem Modell Anteile proportional, wenn ihre Summe das Ganze übersteigt. Radd verteilt bestimmte Restbeträge zurück. Lass prüfen, welche Behandlung für deinen Fall gilt.',
      ],
      [
        'Sind die Beträge pro Person angegeben?',
        'Nein. Jede Zeile zeigt den Gesamtbetrag für die angezeigte Erbengruppe. Bei mehr als einer Person steht die Mitgliederzahl neben dem Namen.',
      ],
      [
        'Kann ich meine Berechnung teilen?',
        'Die Teilen-Funktion sendet den öffentlichen Link zum Rechner. Weder eingegebene Beträge noch deine Familienkonstellation werden übertragen.',
      ],
    ],
    sources: 'Die zugrunde liegenden Verse lesen',
  },
}
