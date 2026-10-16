import type { Locale } from '@/utils/locale'
export interface AnswerVerse {
  reference: string
  href: string
  verses: { arabic: string; translation: string; footnotes: string }[]
}
export const answersCopy: Record<
  Locale,
  {
    title: string
    description: string
    intro: string
    prompt: string
    placeholder: string
    submit: string
    opening: string
    reflection: string
    save: string
    saving: string
    again: string
    include: string
    question: string
    error: string
    saved: string
    share: string
    read: string
    notes: string
    source: string
    explanation: string
    questions: [string, string][]
  }
> = {
  en: {
    title: 'Quran Answers',
    description:
      'Pause with a Quran verse, read its meaning and share a reminder with someone you love.',
    intro: 'Bring what is on your mind, and take a moment to reflect.',
    prompt: 'What is on your mind?',
    placeholder: 'I am looking for patience and peace…',
    submit: 'Show a verse',
    opening: 'Preparing your reflection…',
    reflection: 'A verse to reflect on',
    save: 'Save card',
    saving: 'Saving…',
    again: 'Reflect again',
    include: 'Include my question on the saved card',
    question: 'My reflection',
    error: 'The card could not be saved. Please try again.',
    saved: 'Your card is ready to save.',
    share: 'Send a reminder to someone you love',
    read: 'Read the surrounding verses',
    notes: 'Translation notes',
    source: 'Source credits and notices',
    explanation:
      'This tool selects a verse from a fixed collection on your device. It does not interpret your question, predict events or give a personal religious ruling. Your question stays in this page and is not included in shared links.',
    questions: [
      [
        'How is the verse selected?',
        'Your text selects an entry from a fixed collection. It is a prompt for reflection, not a personalized answer or prediction. Read the verse in context.',
      ],
      [
        'Can I share it?',
        'Save the verse card or share this tool with friends and family. Your question is excluded from the card unless you choose to include it.',
      ],
      [
        'Where do the texts come from?',
        'The Arabic text is from Tanzil. The English translation is by Talal Itani, the French by Rachid Maach and the German by the Rowwad Translation Center. Full credits and original notices appear below.',
      ],
    ],
  },
  ar: {
    title: 'إجابات القرآن',
    description: 'تأمل آية من القرآن الكريم واقرأها في سياقها وشارك تذكرة مع من تحب.',
    intro: 'اكتب ما يشغل بالك، وخذ لحظة للتأمل.',
    prompt: 'ما الذي يشغل بالك؟',
    placeholder: 'أبحث عن الصبر والطمأنينة…',
    submit: 'اعرض آية',
    opening: 'نجهز آية للتأمل…',
    reflection: 'آية للتأمل',
    save: 'حفظ البطاقة',
    saving: 'جارٍ الحفظ…',
    again: 'تأمل مجدداً',
    include: 'تضمين سؤالي في البطاقة المحفوظة',
    question: 'تأملي',
    error: 'تعذر حفظ البطاقة. حاول مرة أخرى.',
    saved: 'بطاقتك جاهزة للحفظ.',
    share: 'أرسل تذكرة لمن تحب',
    read: 'اقرأ الآيات في سياقها',
    notes: 'ملاحظات الترجمة',
    source: 'المصادر والإشعارات',
    explanation:
      'تختار هذه الأداة آية من مجموعة ثابتة على جهازك. لا تفسر سؤالك ولا تتنبأ بالأحداث ولا تقدم فتوى شخصية. يبقى سؤالك في هذه الصفحة ولا يُضمّن في الروابط المشتركة.',
    questions: [
      [
        'كيف تُختار الآية؟',
        'يحدد نصك عنصراً من مجموعة ثابتة. الغرض هو التأمل، وليس تقديم إجابة شخصية أو تنبؤ. اقرأ الآية في سياقها.',
      ],
      [
        'هل يمكنني المشاركة؟',
        'احفظ بطاقة الآية أو شارك الأداة مع الأهل والأصدقاء. لا يظهر سؤالك في البطاقة إلا إذا اخترت تضمينه.',
      ],
      [
        'ما مصادر النصوص؟',
        'النص العربي من مشروع تنزيل. الترجمة الإنجليزية لطلال عيتاني، والفرنسية لرشيد معاش، والألمانية لمركز رواد الترجمة. تظهر بيانات المصادر والإشعارات الأصلية أدناه.',
      ],
    ],
  },
  fr: {
    title: 'Réponses du Coran',
    description:
      'Prenez un moment avec un verset du Coran, lisez son sens et partagez un rappel avec un proche.',
    intro: 'Exprimez ce qui vous préoccupe et prenez un moment pour méditer.',
    prompt: 'Qu’avez-vous à l’esprit ?',
    placeholder: 'Je cherche la patience et la sérénité…',
    submit: 'Afficher un verset',
    opening: 'Préparation de votre lecture…',
    reflection: 'Un verset à méditer',
    save: 'Enregistrer la carte',
    saving: 'Enregistrement…',
    again: 'Méditer à nouveau',
    include: 'Inclure ma question dans la carte enregistrée',
    question: 'Ma réflexion',
    error: 'La carte n’a pas pu être enregistrée. Veuillez réessayer.',
    saved: 'Votre carte est prête à être enregistrée.',
    share: 'Envoyez un rappel à un être cher',
    read: 'Lire les versets dans leur contexte',
    notes: 'Notes de traduction',
    source: 'Sources et mentions originales',
    explanation:
      'Cet outil choisit un verset dans une collection fixe sur votre appareil. Il n’interprète pas votre question, ne prédit aucun événement et ne donne pas d’avis religieux personnel. Votre question reste sur cette page et ne figure pas dans les liens partagés.',
    questions: [
      [
        'Comment le verset est-il choisi ?',
        'Votre texte sélectionne une entrée dans une collection fixe. Il invite à la méditation, sans constituer une réponse personnalisée ni une prédiction. Lisez le verset dans son contexte.',
      ],
      [
        'Puis-je le partager ?',
        'Enregistrez la carte du verset ou partagez cet outil avec vos proches. Votre question est exclue de la carte, sauf si vous choisissez de l’inclure.',
      ],
      [
        'D’où viennent les textes ?',
        'Le texte arabe vient de Tanzil. La traduction anglaise est de Talal Itani, la française de Rachid Maach et l’allemande du Centre de traduction Rowwad. Les crédits et mentions originales figurent ci-dessous.',
      ],
    ],
  },
  de: {
    title: 'Antworten aus dem Koran',
    description:
      'Halte bei einem Koranvers inne, lies seine Bedeutung und teile eine Erinnerung mit einem lieben Menschen.',
    intro: 'Schreibe auf, was dich beschäftigt, und nimm dir Zeit zum Nachdenken.',
    prompt: 'Was beschäftigt dich?',
    placeholder: 'Ich suche Geduld und inneren Frieden…',
    submit: 'Vers anzeigen',
    opening: 'Dein Vers wird vorbereitet…',
    reflection: 'Ein Vers zum Nachdenken',
    save: 'Karte speichern',
    saving: 'Wird gespeichert…',
    again: 'Erneut nachdenken',
    include: 'Meine Frage auf der gespeicherten Karte anzeigen',
    question: 'Meine Gedanken',
    error: 'Die Karte konnte nicht gespeichert werden. Bitte versuche es erneut.',
    saved: 'Deine Karte ist zum Speichern bereit.',
    share: 'Sende einem lieben Menschen eine Erinnerung',
    read: 'Verse im Zusammenhang lesen',
    notes: 'Anmerkungen zur Übersetzung',
    source: 'Quellen und Originalhinweise',
    explanation:
      'Dieses Werkzeug wählt auf deinem Gerät einen Vers aus einer festen Sammlung aus. Es deutet deine Frage nicht, sagt keine Ereignisse voraus und erteilt kein persönliches religiöses Urteil. Deine Frage bleibt auf dieser Seite und erscheint nicht in geteilten Links.',
    questions: [
      [
        'Wie wird der Vers ausgewählt?',
        'Dein Text wählt einen Eintrag aus einer festen Sammlung aus. Er regt zum Nachdenken an und ist keine persönliche Antwort oder Vorhersage. Lies den Vers im Zusammenhang.',
      ],
      [
        'Kann ich ihn teilen?',
        'Speichere die Verskarte oder teile dieses Werkzeug mit Familie und Freunden. Deine Frage erscheint nur auf der Karte, wenn du dies ausdrücklich auswählst.',
      ],
      [
        'Woher stammen die Texte?',
        'Der arabische Text stammt von Tanzil. Die englische Übersetzung ist von Talal Itani, die französische von Rachid Maach und die deutsche vom Rowwad-Übersetzungszentrum. Quellenangaben und Originalhinweise stehen unten.',
      ],
    ],
  },
}
