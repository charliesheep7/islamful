import type { DhikrEntry, RoutineId } from '@/data/adhkar'

// Editorial translations of the existing Islamful explanations. Arabic and source references stay in data/adhkar.ts.
export const adhkarRoutines = {
  fr: {
    morning: {
      title: 'Adhkar du matin',
      description:
        'Commencez la journée avec des invocations sourcées, le texte arabe, leur sens en français et un compteur qui mémorise votre progression.',
    },
    evening: {
      title: 'Adhkar du soir',
      description:
        'Réservez un moment au rappel du soir avec les textes arabes, leurs sources, leur sens en français et une progression que vous pouvez reprendre.',
    },
    'after-prayer': {
      title: 'Adhkar après la prière',
      description:
        'Lisez et comptez les invocations après la prière, choisissez une formule de tasbih rapportée et gardez une progression distincte pour chaque prière.',
    },
  },
  de: {
    morning: {
      title: 'Adhkar am Morgen',
      description:
        'Beginne den Tag mit belegtem Gedenken, arabischem Text, deutschen Bedeutungen und einem Zähler, der deinen Fortschritt speichert.',
    },
    evening: {
      title: 'Adhkar am Abend',
      description:
        'Nimm dir Zeit für das abendliche Gedenken mit arabischen Texten, Quellen, deutschen Bedeutungen und einem Fortschritt, den du fortsetzen kannst.',
    },
    'after-prayer': {
      title: 'Adhkar nach dem Gebet',
      description:
        'Lies und zähle das Gedenken nach dem Gebet, wähle eine überlieferte Tasbih-Abfolge und speichere jede Gebetssitzung getrennt.',
    },
  },
}
const tahlil = {
  fr: 'Allah seul mérite l’adoration, sans associé. À Lui appartiennent toute souveraineté et toute louange, et Son pouvoir englobe toute chose.',
  de: 'Allah allein gebührt die Anbetung, ohne Teilhaber. Ihm gehören alle Herrschaft und alles Lob, und Seine Macht umfasst alles.',
}
export const adhkarEntries: Record<
  'fr' | 'de',
  Record<string, { title: string; meaning?: string }>
> = {
  fr: {
    ikhlas: { title: 'Sourate Al-Ikhlas' },
    falaq: { title: 'Sourate Al-Falaq' },
    nas: { title: 'Sourate An-Nas' },
    'sayyid-istighfar': {
      title: 'Sayyid al-Istighfar',
      meaning:
        'Allah, Tu es mon Seigneur et mon Créateur ; je T’adore Toi seul. Je suis Ton serviteur et je respecte Ton engagement autant que je le peux. Protège-moi du mal que j’ai commis. Je reconnais Ton bienfait et mon péché. Accorde-moi le pardon que Toi seul peux donner.',
    },
    'bismillah-protection': {
      title: 'Évoquer le nom d’Allah',
      meaning:
        'Au nom d’Allah, avec le nom duquel rien sur terre ni dans le ciel ne peut nuire. Il entend tout et sait tout.',
    },
    wellbeing: {
      title: 'Demander le pardon et la préservation',
      meaning:
        'Allah, accorde-moi la préservation ici-bas et dans l’au-delà. Pardonne-moi et protège ma foi, mes affaires quotidiennes, ma famille et mes biens. Couvre mes défauts et apaise mes craintes. Garde-moi de toutes parts ; par Ta grandeur, protège-moi du mal venant d’en dessous.',
    },
    knower: {
      title: 'Chercher refuge contre le mal',
      meaning:
        'Allah, Tu connais l’invisible et le visible et Tu as créé les cieux et la terre. Tu règnes sur toute chose et possèdes tout. J’atteste que Toi seul mérites l’adoration. Protège-moi de mon propre mal, du mal de Satan et de son appel à T’associer d’autres divinités.',
    },
    tasbih: { title: 'SubhanAllah', meaning: 'Allah est exempt de toute imperfection.' },
    tahmid: { title: 'Alhamdulillah', meaning: 'Toute louange appartient à Allah.' },
    takbir: { title: 'Allahu Akbar', meaning: 'Allah est plus grand que tout.' },
    tahlil: { title: 'Compléter la centaine', meaning: tahlil.fr },
    istighfar: { title: 'Demander pardon à Allah', meaning: 'Je demande à Allah de me pardonner.' },
    peace: {
      title: 'Allahumma anta as-Salam',
      meaning:
        'Allah, Tu es la Paix et la source de la paix. Béni sois-Tu, Seigneur de majesté et de générosité.',
    },
    'none-withhold': {
      title: 'Tout don appartient à Allah',
      meaning:
        tahlil.fr +
        ' Allah, personne ne peut retenir Tes dons ni donner ce que Tu retiens. La richesse et le rang ne peuvent protéger leur détenteur contre Toi.',
    },
    'by-you-morning': {
      title: 'Accueillir le matin',
      meaning:
        'Allah, par Toi nous atteignons le matin et le soir ; par Toi nous vivons et mourons, et vers Toi nous serons ressuscités.',
    },
    'by-you-evening': {
      title: 'Accueillir le soir',
      meaning:
        'Allah, par Toi nous atteignons le soir et le matin ; par Toi nous vivons et mourons, et vers Toi nous retournons.',
    },
    'sovereignty-morning': {
      title: 'Un nouveau jour sous la souveraineté d’Allah',
      meaning:
        'Nous voici au matin, et toute souveraineté appartient à Allah, que nous louons. ' +
        tahlil.fr +
        ' Mon Seigneur, accorde-moi le bien de ce jour et de ce qui le suit, et préserve-moi de leur mal. Protège-moi de la paresse, des difficultés de la vieillesse et du châtiment du Feu et de la tombe.',
    },
    'sovereignty-evening': {
      title: 'Un soir sous la souveraineté d’Allah',
      meaning:
        'Nous voici au soir, et toute souveraineté appartient à Allah, que nous louons. ' +
        tahlil.fr +
        ' Mon Seigneur, accorde-moi le bien de cette nuit et de ce qui la suit, et préserve-moi de leur mal. Protège-moi de la paresse, des difficultés de la vieillesse et du châtiment du Feu et de la tombe.',
    },
    'subhan-bihamdih': {
      title: 'SubhanAllahi wa bihamdih',
      meaning: 'Allah est exempt de toute imperfection ; je Le glorifie en Le louant.',
    },
    creation: {
      title: 'Une louange au-delà de tout compte',
      meaning:
        'Je glorifie Allah en Le louant, d’une louange aussi abondante que Sa création, à la mesure de Son agrément, aussi lourde que Son Trône et aussi illimitée que l’encre de Ses paroles.',
    },
    'perfect-words': {
      title: 'Refuge dans les paroles parfaites d’Allah',
      meaning: 'Je cherche refuge dans les paroles parfaites d’Allah contre le mal de Sa création.',
    },
  },
  de: {
    ikhlas: { title: 'Sure Al-Ichlas' },
    falaq: { title: 'Sure Al-Falaq' },
    nas: { title: 'Sure An-Nas' },
    'sayyid-istighfar': {
      title: 'Sayyid al-Istighfar',
      meaning:
        'Allah, Du bist mein Herr und mein Schöpfer; ich bete Dich allein an. Ich bin Dein Diener und halte Deinen Bund, soweit ich kann. Schütze mich vor dem Unrecht, das ich begangen habe. Ich erkenne Deine Gunst und meine Sünde an. Gewähre mir die Vergebung, die nur Du geben kannst.',
    },
    'bismillah-protection': {
      title: 'Allahs Namen gedenken',
      meaning:
        'Im Namen Allahs, mit dessen Namen nichts auf der Erde oder im Himmel schaden kann. Er hört alles und weiß alles.',
    },
    wellbeing: {
      title: 'Um Vergebung und Wohlergehen bitten',
      meaning:
        'Allah, gewähre mir Wohlergehen in dieser Welt und im Jenseits. Vergib mir und schütze mich in meinem Glauben, meinen täglichen Angelegenheiten, meiner Familie und meinem Besitz. Bedecke meine Fehler und beruhige meine Ängste. Behüte mich aus jeder Richtung; schütze mich durch Deine Größe vor Schaden von unten.',
    },
    knower: {
      title: 'Zuflucht vor dem Bösen suchen',
      meaning:
        'Allah, Du kennst das Verborgene und das Sichtbare und hast Himmel und Erde erschaffen. Du herrschst über alles und besitzt alles. Ich bezeuge, dass Dir allein die Anbetung gebührt. Schütze mich vor meinem eigenen Bösen und vor Satans Bösem und seinem Aufruf, Dir Teilhaber beizugesellen.',
    },
    tasbih: { title: 'SubhanAllah', meaning: 'Allah ist frei von jeder Unvollkommenheit.' },
    tahmid: { title: 'Alhamdulillah', meaning: 'Alles Lob gebührt Allah.' },
    takbir: { title: 'Allahu Akbar', meaning: 'Allah ist größer als alles.' },
    tahlil: { title: 'Die Hundert vervollständigen', meaning: tahlil.de },
    istighfar: { title: 'Allah um Vergebung bitten', meaning: 'Ich bitte Allah, mir zu vergeben.' },
    peace: {
      title: 'Allahumma anta as-Salam',
      meaning:
        'Allah, Du bist der Friede und die Quelle des Friedens. Gesegnet bist Du, Herr der Erhabenheit und Ehre.',
    },
    'none-withhold': {
      title: 'Alles Geben gehört Allah',
      meaning:
        tahlil.de +
        ' Allah, niemand kann Deine Gaben zurückhalten oder geben, was Du zurückhältst. Reichtum und Stellung können ihrem Besitzer Dir gegenüber nichts nützen.',
    },
    'by-you-morning': {
      title: 'Den Morgen erreichen',
      meaning:
        'Allah, durch Dich erreichen wir den Morgen und den Abend; durch Dich leben und sterben wir, und zu Dir werden wir auferweckt.',
    },
    'by-you-evening': {
      title: 'Den Abend erreichen',
      meaning:
        'Allah, durch Dich erreichen wir den Abend und den Morgen; durch Dich leben und sterben wir, und zu Dir kehren wir zurück.',
    },
    'sovereignty-morning': {
      title: 'Ein neuer Tag unter Allahs Herrschaft',
      meaning:
        'Wir haben den Morgen erreicht, und alle Herrschaft gehört Allah, den wir loben. ' +
        tahlil.de +
        ' Mein Herr, gewähre mir das Gute dieses Tages und dessen, was folgt, und bewahre mich vor ihrem Bösen. Schütze mich vor Trägheit, den Beschwerden des hohen Alters und der Strafe im Feuer und im Grab.',
    },
    'sovereignty-evening': {
      title: 'Ein Abend unter Allahs Herrschaft',
      meaning:
        'Wir haben den Abend erreicht, und alle Herrschaft gehört Allah, den wir loben. ' +
        tahlil.de +
        ' Mein Herr, gewähre mir das Gute dieser Nacht und dessen, was folgt, und bewahre mich vor ihrem Bösen. Schütze mich vor Trägheit, den Beschwerden des hohen Alters und der Strafe im Feuer und im Grab.',
    },
    'subhan-bihamdih': {
      title: 'SubhanAllahi wa bihamdih',
      meaning: 'Allah ist frei von Unvollkommenheit; ich verherrliche Ihn mit Lob.',
    },
    creation: {
      title: 'Lob über jedes Zählen hinaus',
      meaning:
        'Ich verherrliche Allah mit Lob, so zahlreich wie Seine Schöpfung, Seinem Wohlgefallen entsprechend, so schwer wie Sein Thron und so grenzenlos wie die Tinte für Seine Worte.',
    },
    'perfect-words': {
      title: 'Zuflucht in Allahs vollkommenen Worten',
      meaning: 'Ich suche Schutz in Allahs vollkommenen Worten vor dem Bösen Seiner Schöpfung.',
    },
  },
}
export function localizedDhikr(entry: DhikrEntry, routine: RoutineId, lang: 'fr' | 'de') {
  const key =
    entry.id === 'by-you' || entry.id === 'sovereignty' ? `${entry.id}-${routine}` : entry.id
  return { ...entry, ...adhkarEntries[lang][key] }
}
