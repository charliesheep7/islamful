'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Loader2, Compass, Navigation, Smartphone } from 'lucide-react'
import { calculateQiblaBearing, distanceToKaaba, bearingToCompass } from '@/data/qibla'

interface QiblaFinderProps {
  lang?: string
}

export default function QiblaFinder({ lang = 'en' }: QiblaFinderProps) {
  const isRTL = lang === 'ar'

  // Location state
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locationName, setLocationName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  // Reverse geocode to get city name
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
      const data = await res.json()
      const city = data.city || data.locality || ''
      const country = data.countryName || ''
      if (city && country) {
        setLocationName(`${city}, ${country}`)
      } else if (country) {
        setLocationName(country)
      }
    } catch {
      // Silently fail — location name is optional
    }
  }, [])

  // Detect location via IP (fast, no permission needed)
  const fetchByIP = useCallback(async () => {
    try {
      const res = await fetch('https://ipapi.co/json/')
      const geo = await res.json()
      if (geo.latitude && geo.longitude) {
        setLatitude(geo.latitude)
        setLongitude(geo.longitude)
        const city = geo.city || ''
        const country = geo.country_name || ''
        if (city && country) {
          setLocationName(`${city}, ${country}`)
        } else if (country) {
          setLocationName(country)
        }
        return true
      }
    } catch {
      // Silently fail — will fall back to browser geolocation
    }
    return false
  }, [])

  // Detect location using browser geolocation API (more accurate)
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(
        isRTL
          ? 'المتصفح لا يدعم تحديد الموقع الجغرافي.'
          : 'Geolocation is not supported by your browser.'
      )
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setLatitude(lat)
        setLongitude(lng)
        setLoading(false)
        reverseGeocode(lat, lng)
      },
      (err) => {
        setLoading(false)
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              isRTL
                ? 'تم رفض إذن الموقع. يرجى تفعيله في إعدادات المتصفح أو إدخال الإحداثيات يدوياً.'
                : 'Location permission denied. Please enable it in browser settings or enter coordinates manually.'
            )
            break
          case err.POSITION_UNAVAILABLE:
            setError(
              isRTL
                ? 'معلومات الموقع غير متوفرة. يرجى إدخال الإحداثيات يدوياً.'
                : 'Location information unavailable. Please enter coordinates manually.'
            )
            break
          default:
            setError(
              isRTL
                ? 'تعذر تحديد الموقع. يرجى إدخال الإحداثيات يدوياً.'
                : 'Could not determine your location. Please enter coordinates manually.'
            )
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [isRTL, reverseGeocode])

  // Auto-detect on mount: IP first (instant), then browser geolocation (more accurate)
  useEffect(() => {
    let mounted = true
    async function init() {
      setLoading(true)
      const ipSuccess = await fetchByIP()
      if (!mounted) return
      setLoading(false)
      // If IP worked, still try browser geolocation for better accuracy
      // If IP failed, fall back to browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!mounted) return
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            setLatitude(lat)
            setLongitude(lng)
            reverseGeocode(lat, lng)
          },
          () => {
            // If browser geolocation fails and IP also failed, show manual input
            if (!mounted) return
            if (!ipSuccess) {
              setError(
                isRTL
                  ? 'تعذر تحديد الموقع. يرجى إدخال الإحداثيات يدوياً.'
                  : 'Could not determine your location. Please enter coordinates manually.'
              )
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        )
      }
    }
    init()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      // Android or older iOS — add listener directly
      setCompassAvailable(true)
      setCompassPermissionNeeded(false)
      addOrientationListener()
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleOrientation(event: DeviceOrientationEvent) {
    let heading: number | null = null

    // iOS provides webkitCompassHeading

    if ((event as unknown as Record<string, number>).webkitCompassHeading !== undefined) {
      heading = (event as unknown as Record<string, number>).webkitCompassHeading
    } else if (event.alpha !== null) {
      // Android: alpha is the compass heading (inverted)
      heading = (360 - event.alpha!) % 360
    }

    if (heading === null) return

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
  }

  function addOrientationListener() {
    window.addEventListener('deviceorientation', handleOrientation, true)
  }

  async function requestCompassPermission() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const permission = await (DeviceOrientationEvent as any).requestPermission()
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
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
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
    setLocationName(null)
    reverseGeocode(lat, lng)
  }

  const isCompassActive = deviceHeading !== null && !compassPermissionNeeded
  const compassRotation = isCompassActive ? -deviceHeading! : 0

  // Cardinal labels
  const cardinalLabels = isRTL
    ? { N: 'ش', E: 'شر', S: 'ج', W: 'غ' }
    : { N: 'N', E: 'E', S: 'S', W: 'W' }

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
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
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Compass and results */}
      {bearing !== null && !loading && (
        <div className="flex flex-col items-center">
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
            <svg width="280" height="280" viewBox="0 0 280 280" className="drop-shadow-sm">
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
                    Ka
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
                {bearing.toFixed(1)}&deg; {compassDirection}
              </p>
            </div>

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
                {Math.round(distance!).toLocaleString()} {isRTL ? 'كم' : 'km'}
              </p>
            </div>

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
            {compassAvailable === false && (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <Smartphone className="h-4 w-4 text-gray-400" />
                <p
                  className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL
                    ? 'افتح على هاتفك للحصول على بوصلة حية'
                    : 'Open on your phone for a live compass'}
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

      {/* Manual input fallback — shown when no location and not loading */}
      {latitude === null && !loading && (
        <div className="mt-4">
          <p
            className={`mb-4 text-center text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'أو أدخل الإحداثيات يدوياً' : 'Or enter coordinates manually'}
          </p>
          <form onSubmit={handleManualSubmit} className="mx-auto max-w-sm space-y-3">
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
      )}
    </div>
  )
}
