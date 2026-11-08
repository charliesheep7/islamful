import Unsubscribe from './Unsubscribe'

export const metadata = {
  title: 'Email preferences · Islamful',
  referrer: 'no-referrer' as const,
  robots: { index: false, follow: false },
}

export default function UnsubscribePage() {
  return <Unsubscribe />
}
