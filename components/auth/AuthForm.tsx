'use client'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { browserSupabase } from '@/utils/supabase/client'
import { authTranslations } from '@/data/locales/auth'
import { safeReturnPath } from '@/utils/auth'
import { useLocale } from '@/components/hooks/useLocale'

const emailEnabled = process.env.NEXT_PUBLIC_EMAIL_AUTH_ENABLED === 'true'

type Mode = 'signin' | 'signup' | 'reset' | 'update'
export default function AuthForm() {
  const { isArabic: ar, currentLang, getLocalePath } = useLocale()
  const t = (en: string, arabic: string) =>
    ar
      ? arabic
      : currentLang === 'fr' || currentLang === 'de'
        ? authTranslations[currentLang][en] || en
        : en
  const params = useSearchParams()
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(
    emailEnabled && params.get('mode') === 'update' ? 'update' : 'signin'
  )
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(
    params.has('error')
      ? t(
          'This sign-in link has expired or could not be verified. Please try again.',
          'انتهت صلاحية رابط الدخول أو تعذر التحقق منه. حاول مجددًا.'
        )
      : ''
  )
  const client = browserSupabase()
  const next = safeReturnPath(params.get('next'), getLocalePath('/'))
  useEffect(() => {
    const supabase = browserSupabase()
    if (!supabase) {
      setReady(true)
      return
    }
    let active = true
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (active) {
          setUser(data.user)
          setReady(true)
        }
      })
      .catch(() => {
        if (active) setReady(true)
      })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])
  function switchMode(value: Mode) {
    setMode(value)
    setError('')
    setMessage('')
    setPassword('')
  }
  function callback(recovery = false) {
    const url = new URL('/auth/callback', window.location.origin)
    url.searchParams.set('next', next)
    url.searchParams.set('lang', currentLang)
    if (recovery) url.searchParams.set('recovery', '1')
    return url.toString()
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!client || busy || !emailEnabled) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      if (mode === 'signin') {
        const result = await client.auth.signInWithPassword({ email: email.trim(), password })
        if (result.error) throw result.error
        router.replace(next)
        router.refresh()
      } else if (mode === 'signup') {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: callback() },
        })
        if (error) throw error
        if (data.session) {
          router.replace(next)
          router.refresh()
        } else
          setMessage(
            t(
              'Check your email to confirm your account. If you already have an account, sign in or reset your password.',
              'تحقق من بريدك لتأكيد حسابك. إذا كان لديك حساب، سجّل الدخول أو أعد تعيين كلمة المرور.'
            )
          )
      } else if (mode === 'reset') {
        const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: callback(true),
        })
        if (error) throw error
        setMessage(
          t(
            'If an account exists for this email, you’ll receive a password reset link.',
            'إذا كان هناك حساب بهذا البريد، فستتلقى رابطًا لإعادة تعيين كلمة المرور.'
          )
        )
      } else {
        const { error } = await client.auth.updateUser({ password })
        if (error) throw error
        setPassword('')
        setMode('signin')
        setMessage(t('Your password has been updated.', 'تم تحديث كلمة المرور.'))
        router.replace(getLocalePath('/login'))
        router.refresh()
      }
    } catch (err) {
      const code = (err as { code?: string }).code
      setError(
        code === 'invalid_credentials'
          ? t('Email or password is incorrect.', 'البريد الإلكتروني أو كلمة المرور غير صحيحة.')
          : code === 'email_not_confirmed'
            ? t('Confirm your email before signing in.', 'أكد بريدك الإلكتروني قبل تسجيل الدخول.')
            : code === 'weak_password'
              ? t('Please choose a stronger password.', 'يرجى اختيار كلمة مرور أقوى.')
              : t(
                  'We couldn’t complete this request. Check your connection and try again in a moment.',
                  'تعذر إكمال الطلب. تحقق من اتصالك وحاول مجددًا بعد قليل.'
                )
      )
    } finally {
      setBusy(false)
    }
  }
  async function google() {
    if (!client || busy) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callback() },
      })
      if (error) throw error
    } catch {
      setError(
        t(
          'Google sign-in is unavailable right now. Please try again later.',
          'الدخول عبر Google غير متاح الآن. حاول لاحقًا.'
        )
      )
      setBusy(false)
    }
  }
  async function signOut() {
    if (!client) return
    setBusy(true)
    setError('')
    try {
      const { error } = await client.auth.signOut({ scope: 'local' })
      if (error) throw error
      setUser(null)
      setMode('signin')
      setMessage('')
      router.refresh()
    } catch {
      setError(t('Could not sign out. Please try again.', 'تعذر تسجيل الخروج. حاول مجددًا.'))
    } finally {
      setBusy(false)
    }
  }
  const inputClass =
    'mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-green-700 focus:ring-green-700 dark:border-gray-600 dark:bg-gray-900 dark:text-white'
  const buttonClass =
    'min-h-12 w-full rounded-xl bg-[#327952] px-5 py-3 font-semibold text-white hover:bg-[#286342] disabled:cursor-not-allowed disabled:opacity-50'
  const title =
    user && mode !== 'update'
      ? t('Your account', 'حسابك')
      : mode === 'signup'
        ? t('Join Islamful', 'انضم إلى Islamful')
        : mode === 'reset'
          ? t('Reset your password', 'إعادة تعيين كلمة المرور')
          : mode === 'update'
            ? t('Choose a new password', 'اختر كلمة مرور جديدة')
            : t('Welcome back', 'مرحبًا بعودتك')
  return (
    <section className="mx-auto max-w-md px-4 py-12 sm:py-20" dir={ar ? 'rtl' : 'ltr'}>
      <div className="rounded-3xl border border-green-900/10 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-700 dark:bg-gray-900">
        <p className="mb-3 text-sm font-semibold tracking-wide text-[#327952]">ISLAMFUL</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {t(
            'Your Islamic companion, wherever you are. Tools and articles are always free to explore.',
            'رفيقك الإسلامي أينما كنت. الأدوات والمقالات متاحة دائمًا مجانًا.'
          )}
        </p>
        {!client && (
          <p role="status" className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            {t(
              'Sign-in is not available yet. Please try again later.',
              'تسجيل الدخول غير متاح بعد. حاول لاحقًا.'
            )}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-900">
            {message}
          </p>
        )}
        {!ready ? (
          <p className="mt-6" role="status">
            {t('Loading…', 'جارٍ التحميل…')}
          </p>
        ) : user && mode !== 'update' ? (
          <div className="mt-6 space-y-4">
            <p className="break-all" dir="ltr">
              {user.email}
            </p>
            <Link href={next} className={`${buttonClass} block text-center`}>
              {t('Continue exploring', 'متابعة التصفح')}
            </Link>
            <button
              disabled={busy}
              onClick={signOut}
              className="min-h-11 w-full rounded-xl border border-gray-300"
            >
              {t('Sign out', 'تسجيل الخروج')}
            </button>
          </div>
        ) : (
          <>
            {(mode === 'signin' || mode === 'signup') && (
              <>
                <button
                  onClick={google}
                  disabled={busy || !client}
                  className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-gray-800"
                >
                  <span aria-hidden="true" className="text-lg font-bold">
                    G
                  </span>
                  {t('Continue with Google', 'المتابعة باستخدام Google')}
                </button>
                {emailEnabled && (
                  <div className="my-5 text-center text-sm text-gray-500">
                    {t('or continue with email', 'أو المتابعة بالبريد الإلكتروني')}
                  </div>
                )}
              </>
            )}
            {emailEnabled && (
              <>
                <form onSubmit={submit} className="mt-5 space-y-4">
                  {mode !== 'update' && (
                    <label className="block text-sm font-medium">
                      {t('Email address', 'البريد الإلكتروني')}
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        dir="ltr"
                        required
                        maxLength={254}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </label>
                  )}
                  {mode !== 'reset' && (
                    <label className="block text-sm font-medium">
                      {mode === 'update'
                        ? t('New password', 'كلمة المرور الجديدة')
                        : t('Password', 'كلمة المرور')}
                      <input
                        type="password"
                        aria-label={
                          mode === 'update'
                            ? t('New password', 'كلمة المرور الجديدة')
                            : t('Password', 'كلمة المرور')
                        }
                        aria-describedby={mode === 'signin' ? undefined : 'password-help'}
                        name="password"
                        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                        dir="ltr"
                        required
                        minLength={mode === 'signin' ? 1 : 8}
                        maxLength={128}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                      />
                      {mode !== 'signin' && (
                        <span id="password-help" className="mt-2 block text-xs text-gray-500">
                          {t('Use at least 8 characters.', 'استخدم 8 أحرف على الأقل.')}
                        </span>
                      )}
                    </label>
                  )}
                  <button
                    disabled={busy || !client || (mode === 'update' && !user)}
                    className={buttonClass}
                  >
                    {busy
                      ? t('Please wait…', 'يرجى الانتظار…')
                      : mode === 'signup'
                        ? t('Create account', 'إنشاء حساب')
                        : mode === 'reset'
                          ? t('Send reset link', 'إرسال رابط إعادة التعيين')
                          : mode === 'update'
                            ? t('Update password', 'تحديث كلمة المرور')
                            : t('Sign in', 'تسجيل الدخول')}
                  </button>
                  {mode === 'update' && !user && (
                    <p role="status">
                      {t(
                        'Open the reset link from your email first.',
                        'افتح رابط إعادة التعيين من بريدك أولًا.'
                      )}
                    </p>
                  )}
                </form>
                <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
                  <button
                    disabled={busy}
                    className="min-h-11 underline underline-offset-4"
                    onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                  >
                    {mode === 'signin'
                      ? t('Create an account', 'إنشاء حساب')
                      : t('Back to sign in', 'العودة لتسجيل الدخول')}
                  </button>
                  {mode === 'signin' && (
                    <button
                      disabled={busy}
                      onClick={() => switchMode('reset')}
                      className="min-h-11 underline underline-offset-4"
                    >
                      {t('Forgot password?', 'نسيت كلمة المرور؟')}
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}
        <p className="mt-6 text-center text-xs text-gray-500">
          <Link className="underline" href={getLocalePath('/privacy')}>
            {t('Privacy', 'الخصوصية')}
          </Link>{' '}
          ·{' '}
          <Link className="underline" href={getLocalePath('/terms')}>
            {t('Terms', 'الشروط')}
          </Link>
        </p>
      </div>
    </section>
  )
}
