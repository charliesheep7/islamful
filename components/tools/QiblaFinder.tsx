'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Loader2, Compass, Navigation, Smartphone } from 'lucide-react'
import {
  calculateQiblaBearing,
  distanceToKaaba,
  bearingToCompass,
  validCoordinates,
} from '@/data/qibla'

interface QiblaFinderProps {
  lang?: string
}

export default function QiblaFinder({ lang = 'en' }: QiblaFinderProps) {
  const isRTL = lang === 'ar'

  // Location state
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locationName, setLocationName] = useState<string | null>(null)
  const [locationSource, setLocationSource] = useState<'ip' | 'device' | 'manual' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const locationRequestRef = useRef(0)
  const locationAbortRef = useRef<AbortController | null>(null)
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null)
  const headingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Manual input state
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')

  // Compass state
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null)
  const [compassAvailable, setCompassAvailable] = useState(false)
  const [compassPermissionNeeded, setCompassPermissionNeeded] = useState(false)
  const smoothedHeadingRef = useRef<number | null>(null)

  // Computed values
  const bearing =
    latitude !== null && longitude !== null ? calculateQiblaBearing(latitude, longitude) : null
  const distance =
    latitude !== null && longitude !== null ? distanceToKaaba(latitude, longitude) : null
  const compassDirection = bearing !== null ? bearingToCompass(bearing) : null
  const arabicDirections: Record<string, string> = {
    N: 'شمال',
    NE: 'شمال شرق',
    E: 'شرق',
    SE: 'جنوب شرق',
    S: 'جنوب',
    SW: 'جنوب غرب',
    W: 'غرب',
    NW: 'شمال غرب',
  }

  // Every source shares one request generation so an older lookup cannot win.
  const beginLocation = useCallback(() => {
    locationAbortRef.current?.abort()
    const controller = new AbortController()
    locationAbortRef.current = controller
    const requestId = ++locationRequestRef.current
    setError(null)
    setLatitude(null)
    setLongitude(null)
    setLocationName(null)
    setLocationSource(null)
    setLocationAccuracy(null)
    return { requestId, controller }
  }, [])

  const reverseGeocode = useCallback(
    async (lat: number, lng: number, requestId: number, signal: AbortSignal) => {
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${isRTL ? 'ar' : 'en'}`,
          { signal }
        )
        if (!res.ok) return
        const data = await res.json()
        if (requestId !== locationRequestRef.current || signal.aborted) return
        const parts = [data.city || data.locality, data.countryName].filter(
          (value) => typeof value === 'string' && value
        )
        setLocationName(parts.join(', ') || null)
      } catch {
        // Coordinates remain usable if the optional place-name service fails.
      }
    },
    [isRTL]
  )

  async function fetchByIP() {
    const { requestId, controller } = beginLocation()
    setLoading(true)
    const timeout = window.setTimeout(() => controller.abort(), 8000)
    try {
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
      if (!res.ok) throw new Error('Location service unavailable')
      const geo = await res.json()
      const lat = Number(geo.latitude)
      const lng = Number(geo.longitude)
      if (
        geo.latitude == null ||
        geo.longitude == null ||
        String(geo.latitude).trim() === '' ||
        String(geo.longitude).trim() === '' ||
        !validCoordinates(lat, lng)
      )
        throw new Error('Invalid coordinates')
      if (requestId !== locationRequestRef.current) return
      setLatitude(lat)
      setLongitude(lng)
      setLocationSource('ip')
      setLocationName(
        [geo.city, geo.country_name]
          .filter((value) => typeof value === 'string' && value)
          .join(', ') || null
      )
    } catch {
      if (requestId === locationRequestRef.current)
        setError(
          isRTL
            ? 'تعذر اقتراح الموقع. استخدم موقع الجهاز أو أدخل الإحداثيات.'
            : 'Could not suggest a location. Use device location or enter coordinates.'
        )
    } finally {
      window.clearTimeout(timeout)
      if (requestId === locationRequestRef.current) setLoading(false)
    }
  }

  const detectLocation = useCallback(() => {
    const { requestId, controller } = beginLocation()
    setLoading(false)
    if (!navigator.geolocation) {
      setError(
        isRTL
          ? 'المتصفح لا يدعم تحديد الموقع. أدخل الإحداثيات.'
          : 'Geolocation is unavailable. Enter coordinates instead.'
      )
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestId !== locationRequestRef.current) return
        const { latitude: lat, longitude: lng, accuracy } = position.coords
        setLoading(false)
        if (!validCoordinates(lat, lng)) {
          setError(
            isRTL
              ? 'لم يصل موقع صالح. أدخل الإحداثيات.'
              : 'No valid location received. Enter coordinates instead.'
          )
          return
        }
        setLatitude(lat)
        setLongitude(lng)
        setLocationSource('device')
        setLocationAccuracy(Number.isFinite(accuracy) && accuracy >= 0 ? accuracy : null)
        reverseGeocode(lat, lng, requestId, controller.signal)
      },
      (err) => {
        if (requestId !== locationRequestRef.current) return
        setLoading(false)
        setError(
          err.code === 1
            ? isRTL
              ? 'تم رفض إذن الموقع. يمكنك إدخال الإحداثيات أو إعادة المحاولة بعد تغيير الإذن.'
              : 'Location permission denied. Enter coordinates or retry after changing permission.'
            : isRTL
              ? 'تعذر تحديد الموقع. أعد المحاولة أو أدخل الإحداثيات.'
              : 'Could not determine your location. Retry or enter coordinates.'
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [beginLocation, isRTL, reverseGeocode])

  useEffect(
    () => () => {
      locationRequestRef.current++
      locationAbortRef.current?.abort()
      if (headingTimeoutRef.current) clearTimeout(headingTimeoutRef.current)
    },
    []
  )

  // Only absolute orientation can be used as a north-referenced compass.
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let heading: number | null = null
    const webkitHeading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
      .webkitCompassHeading
    if (typeof webkitHeading === 'number' && Number.isFinite(webkitHeading)) {
      heading = webkitHeading
    } else if (event.absolute && typeof event.alpha === 'number' && Number.isFinite(event.alpha)) {
      // Relative orientation has no geographic north and cannot point to the Qibla.
      heading = (360 - event.alpha) % 360
    }

    if (heading === null || heading < 0 || heading >= 360) return
    const accuracy = (event as DeviceOrientationEvent & { webkitCompassAccuracy?: number })
      .webkitCompassAccuracy
    if (
      typeof accuracy === 'number' &&
      (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 30)
    ) {
      setDeviceHeading(null)
      smoothedHeadingRef.current = null
      return
    }
    // The simple alpha heading assumes a flat phone in portrait orientation.
    const screenAngle =
      window.screen.orientation?.angle ??
      (window as Window & { orientation?: number }).orientation ??
      0
    if (
      screenAngle !== 0 ||
      (typeof event.beta === 'number' && Math.abs(event.beta) > 20) ||
      (typeof event.gamma === 'number' && Math.abs(event.gamma) > 20)
    ) {
      setDeviceHeading(null)
      smoothedHeadingRef.current = null
      return
    }
    if (headingTimeoutRef.current) clearTimeout(headingTimeoutRef.current)
    headingTimeoutRef.current = setTimeout(() => {
      setDeviceHeading(null)
      smoothedHeadingRef.current = null
    }, 5000)

    // Low-pass filter for smooth heading
    if (smoothedHeadingRef.current === null) {
      smoothedHeadingRef.current = heading
    } else {
      const diff = ((heading - smoothedHeadingRef.current + 540) % 360) - 180
      smoothedHeadingRef.current = smoothedHeadingRef.current + 0.15 * diff
      // Normalize
      smoothedHeadingRef.current = ((smoothedHeadingRef.current % 360) + 360) % 360
    }

    setDeviceHeading(smoothedHeadingRef.current)
  }, [])

  const addOrientationListener = useCallback(() => {
    window.addEventListener('deviceorientation', handleOrientation, true)
    window.addEventListener('deviceorientationabsolute', handleOrientation)
  }, [handleOrientation])

  // Device orientation / compass
  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setCompassAvailable(false)
      return
    }

    // Check if iOS 13+ permission API exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setCompassPermissionNeeded(true)
      setCompassAvailable(true)
    } else {
      setCompassAvailable(true)
      setCompassPermissionNeeded(false)
      addOrientationListener()
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true)
      window.removeEventListener('deviceorientationabsolute', handleOrientation)
    }
  }, [addOrientationListener, handleOrientation])

  async function requestCompassPermission() {
    setError(null)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const permission = await (DeviceOrientationEvent as any).requestPermission(true)
      if (permission === 'granted') {
        setCompassPermissionNeeded(false)
        addOrientationListener()
      } else {
        setError(isRTL ? 'تم رفض إذن البوصلة.' : 'Compass permission denied.')
      }
    } catch {
      setError(isRTL ? 'تعذر تفعيل البوصلة.' : 'Could not enable compass.')
    }
  }

  // Handle manual coordinate input
  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault()
    const lat = Number(manualLat)
    const lng = Number(manualLng)

    const { requestId, controller } = beginLocation()
    setLoading(false)
    if (!manualLat.trim() || !manualLng.trim() || !validCoordinates(lat, lng)) {
      setError(
        isRTL
          ? 'يرجى إدخال إحداثيات صحيحة (خط العرض: -90 إلى 90، خط الطول: -180 إلى 180).'
          : 'Please enter valid coordinates (latitude: -90 to 90, longitude: -180 to 180).'
      )
      return
    }

    setError(null)
    setLatitude(lat)
    setLongitude(lng)
    setLocationSource('manual')
    setLocationName(null)
    reverseGeocode(lat, lng, requestId, controller.signal)
  }

  const isCompassActive = deviceHeading !== null && !compassPermissionNeeded
  const compassRotation = isCompassActive ? -deviceHeading! : 0

  // Cardinal labels
  const cardinalLabels = isRTL
    ? { N: 'ش', E: 'شر', S: 'ج', W: 'غ' }
    : { N: 'N', E: 'E', S: 'S', W: 'W' }

  return (
    <div className="w-full" data-testid="qibla-tool" dir={isRTL ? 'rtl' : 'ltr'}>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {isRTL
          ? 'اختر موقع الجهاز أو أدخل الإحداثيات. طلب الموقع يبدأ عند الضغط فقط؛ وقد ترسل الإحداثيات لخدمة تسمية المكان.'
          : 'Use device location or enter coordinates. Location lookup starts only when you choose it; coordinates may be sent to a place-name service.'}
      </p>
      <div className="mb-6 flex flex-wrap gap-3">
        <button type="button" onClick={detectLocation} className="rounded-xl border px-4 py-3">
          {isRTL ? 'استخدم موقع الجهاز' : 'Use device location'}
        </button>
        <button type="button" onClick={fetchByIP} className="rounded-xl border px-4 py-3">
          {isRTL ? 'اقتراح موقع تقريبي عبر الإنترنت' : 'Suggest approximate internet location'}
        </button>
      </div>
      {latitude !== null && bearing === null && !loading && (
        <p role="status" className="mb-4 rounded-xl border p-4">
          {isRTL
            ? 'لا يمكن إعطاء زاوية مفيدة من هذه الإحداثيات، مثل موقع الكعبة نفسه أو النقطة المقابلة لها أو القطبين. تحقق من الموقع واستعن بتوجيه محلي موثوق.'
            : 'A useful bearing is undefined at these coordinates, such as the Kaaba itself, its antipode or a pole. Check the location and use trusted local guidance.'}
        </p>
      )}
      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-[var(--color-primary-500)]" />
          <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? 'جارٍ تحديد موقعك...' : 'Detecting your location...'}
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {/* Compass and results */}
      {bearing !== null && !loading && (
        <div className="flex flex-col items-center">
          {locationSource === 'ip' && (
            <div
              role="status"
              className="mb-6 w-full max-w-sm rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-100"
            >
              <p className={isRTL ? 'font-arabic' : ''}>
                {isRTL
                  ? 'موقعك تقريبي اعتماداً على عنوان الإنترنت، وقد يختلف عن مكانك الفعلي. استخدم موقع الجهاز للحصول على اتجاه أدق.'
                  : 'This is an approximate location based on your internet address. Use your device location for a more reliable direction.'}
              </p>
              <button
                type="button"
                onClick={detectLocation}
                className={`me-4 mt-2 font-semibold underline underline-offset-2 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL ? 'استخدم موقع الجهاز' : 'Use device location'}
              </button>
              <button
                type="button"
                onClick={() => {
                  beginLocation()
                  setLoading(false)
                  document.getElementById('manual-lat')?.focus()
                }}
                className={`mt-2 font-semibold underline underline-offset-2 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL ? 'أدخل الإحداثيات بدلاً من ذلك' : 'Enter coordinates instead'}
              </button>
            </div>
          )}
          {/* iOS compass permission button */}
          {compassAvailable && compassPermissionNeeded && (
            <button
              type="button"
              onClick={requestCompassPermission}
              className="mb-6 flex items-center gap-2 rounded-xl bg-[var(--color-primary-500)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
            >
              <Compass className="h-4 w-4" />
              {isRTL ? 'تفعيل البوصلة' : 'Enable Compass'}
            </button>
          )}

          {/* SVG Compass */}
          <div className="relative mb-8">
            <svg
              aria-hidden="true"
              width="280"
              height="280"
              viewBox="0 0 280 280"
              className="drop-shadow-sm"
            >
              {/* Outer circle */}
              <circle
                cx="140"
                cy="140"
                r="130"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-200 dark:text-gray-700"
              />

              {/* Compass body group — rotates by device heading */}
              <g transform={`rotate(${compassRotation}, 140, 140)`}>
                {/* Tick marks every 30 degrees */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = i * 30
                  const isCardinal = angle % 90 === 0
                  const innerR = isCardinal ? 110 : 118
                  const outerR = 130
                  const rad = (angle * Math.PI) / 180
                  const x1 = 140 + innerR * Math.sin(rad)
                  const y1 = 140 - innerR * Math.cos(rad)
                  const x2 = 140 + outerR * Math.sin(rad)
                  const y2 = 140 - outerR * Math.cos(rad)
                  return (
                    <line
                      key={angle}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth={isCardinal ? 2.5 : 1.5}
                      className={
                        isCardinal
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }
                    />
                  )
                })}

                {/* Cardinal labels */}
                {[
                  { label: cardinalLabels.N, angle: 0, isNorth: true },
                  { label: cardinalLabels.E, angle: 90, isNorth: false },
                  { label: cardinalLabels.S, angle: 180, isNorth: false },
                  { label: cardinalLabels.W, angle: 270, isNorth: false },
                ].map(({ label, angle, isNorth }) => {
                  const rad = (angle * Math.PI) / 180
                  const r = 97
                  const x = 140 + r * Math.sin(rad)
                  const y = 140 - r * Math.cos(rad)
                  return (
                    <text
                      key={label}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`text-sm font-bold ${
                        isNorth
                          ? 'fill-red-500 dark:fill-red-400'
                          : 'fill-gray-500 dark:fill-gray-400'
                      } ${isRTL ? 'font-arabic' : ''}`}
                      fontSize="14"
                    >
                      {label}
                    </text>
                  )
                })}

                {/* Qibla arrow — rotated by bearing */}
                <g transform={`rotate(${bearing}, 140, 140)`}>
                  {/* Arrow shaft */}
                  <line
                    x1="140"
                    y1="140"
                    x2="140"
                    y2="38"
                    stroke="var(--color-primary-500)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Arrow head */}
                  <polygon points="140,24 132,46 148,46" fill="var(--color-primary-500)" />
                  {/* Kaaba icon circle at tip */}
                  <circle cx="140" cy="24" r="8" fill="var(--color-primary-500)" />
                  <text
                    x="140"
                    y="24"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {isRTL ? 'ك' : 'Ka'}
                  </text>
                </g>
              </g>

              {/* Center dot */}
              <circle cx="140" cy="140" r="6" fill="var(--color-primary-500)" />
              <circle cx="140" cy="140" r="3" fill="white" />
            </svg>
          </div>

          {/* Info below compass */}
          <div className="w-full max-w-sm space-y-3">
            {/* Bearing */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-center gap-2">
                <Navigation className="h-5 w-5 text-[var(--color-primary-500)]" />
                <span
                  className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL ? 'اتجاه القبلة' : 'Qibla Bearing'}
                </span>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                <bdi>{bearing.toFixed(1)}&deg;</bdi>{' '}
                {isRTL && compassDirection ? arabicDirections[compassDirection] : compassDirection}
              </p>
            </div>

            <p role="status" className="text-sm text-gray-600 dark:text-gray-300">
              {isRTL
                ? 'الزاوية باتجاه عقارب الساعة من الشمال الحقيقي. الرسم ثابت والشمال للأعلى ما لم تصل قراءة بوصلة صالحة. أمسك الهاتف مسطحًا بوضع رأسي بعيدًا عن المعادن والمغناطيس.'
                : 'Bearing is clockwise from true north. The diagram is north-up until a valid compass reading arrives. Hold the phone flat in portrait orientation, away from metal and magnets.'}
            </p>
            {isCompassActive && (
              <p role="status" className="text-sm text-gray-600 dark:text-gray-300">
                {isRTL
                  ? 'قراءة بوصلة الجهاز متاحة، لكنها قد تستخدم الشمال المغناطيسي وتتأثر بالمعايرة. تحقق ببوصلة مضبوطة للشمال الحقيقي أو بتوجيه موثوق.'
                  : 'Device heading available. It may use magnetic north and depend on calibration. Cross-check with a true-north-adjusted compass or trusted guidance.'}
              </p>
            )}
            {locationAccuracy !== null && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isRTL
                  ? 'دقة الموقع التي يقدرها الجهاز: نحو '
                  : 'Device-reported location accuracy: about '}
                {Math.round(locationAccuracy).toLocaleString(isRTL ? 'ar' : 'en')}{' '}
                {isRTL ? 'متر' : 'm'}
              </p>
            )}
            {/* Distance */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5 text-[var(--color-primary-500)]" />
                <span
                  className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL ? 'المسافة إلى مكة' : 'Distance to Makkah'}
                </span>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(distance!).toLocaleString(isRTL ? 'ar' : 'en')} {isRTL ? 'كم' : 'km'}
              </p>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              {isRTL ? 'الإحداثيات المستخدمة: ' : 'Coordinates used: '}
              <bdi>
                {latitude!.toFixed(5)}, {longitude!.toFixed(5)}
              </bdi>
              {' · '}
              {locationSource === 'manual'
                ? isRTL
                  ? 'إدخال يدوي'
                  : 'Manual entry'
                : locationSource === 'device'
                  ? isRTL
                    ? 'موقع الجهاز'
                    : 'Device location'
                  : isRTL
                    ? 'موقع الإنترنت التقريبي'
                    : 'Approximate internet location'}
            </p>
            {/* Location name */}
            {locationName && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900">
                <p
                  className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL ? 'موقعك' : 'Your Location'}
                </p>
                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                  {locationName}
                </p>
              </div>
            )}

            {/* Desktop hint */}
            {!isCompassActive && !compassPermissionNeeded && (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <Smartphone className="h-4 w-4 text-gray-400" />
                <p
                  className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL
                    ? 'لا توجد قراءة بوصلة حديثة وصالحة. الرسم ثابت والشمال للأعلى.'
                    : 'No recent valid compass heading. The diagram is fixed with north at the top.'}
                </p>
              </div>
            )}

            {/* Re-detect location button */}
            <button
              type="button"
              onClick={detectLocation}
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <MapPin className="h-4 w-4" />
              {isRTL ? 'تحديد الموقع مرة أخرى' : 'Detect Location'}
            </button>
          </div>
        </div>
      )}

      {/* Manual entry remains available during and after every location lookup. */}
      {
        <div className="mt-4">
          <p
            className={`mb-4 text-center text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'أو أدخل الإحداثيات يدوياً' : 'Or enter coordinates manually'}
          </p>
          <form noValidate onSubmit={handleManualSubmit} className="mx-auto max-w-sm space-y-3">
            <div>
              <label
                htmlFor="manual-lat"
                className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL ? 'خط العرض' : 'Latitude'}
              </label>
              <input
                id="manual-lat"
                type="number"
                dir="ltr"
                step="any"
                min="-90"
                max="90"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder={isRTL ? 'مثال: 21.4225' : 'e.g. 21.4225'}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-gray-600"
              />
            </div>
            <div>
              <label
                htmlFor="manual-lng"
                className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL ? 'خط الطول' : 'Longitude'}
              </label>
              <input
                id="manual-lng"
                type="number"
                dir="ltr"
                step="any"
                min="-180"
                max="180"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder={isRTL ? 'مثال: 39.8262' : 'e.g. 39.8262'}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-gray-600"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--color-primary-500)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
            >
              {isRTL ? 'حدد القبلة' : 'Find Qibla'}
            </button>
          </form>

          {/* Detect location button */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={detectLocation}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-primary-500)] transition-colors hover:text-[var(--color-primary-600)]"
            >
              <MapPin className="h-4 w-4" />
              {isRTL ? 'تحديد الموقع تلقائياً' : 'Detect My Location'}
            </button>
          </div>
        </div>
      }
    </div>
  )
}
