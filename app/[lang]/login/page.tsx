import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return {
    title: lang === 'fr' ? 'Connexion' : lang === 'de' ? 'Anmeldung' : 'تسجيل الدخول',
    robots: { index: false, follow: false },
  }
}
export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!['ar', 'en', 'fr', 'de'].includes(lang)) notFound()
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
