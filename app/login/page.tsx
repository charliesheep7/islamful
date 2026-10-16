import { Suspense } from 'react'
import AuthForm from '@/components/auth/AuthForm'
export const metadata = { title: 'Sign in', robots: { index: false, follow: false } }
export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
