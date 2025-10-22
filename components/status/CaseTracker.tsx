'use client'
import { useState } from 'react'
import { Search, AlertCircle, ExternalLink, CheckCircle2, Clock, FileText } from 'lucide-react'

type CaseStatus = {
  caseNumber: string
  status: string
  lastUpdated: string
  currentStep: number
  estimatedCompletion: string
  description: string
}

export default function CaseTracker() {
  const [caseNumber, setCaseNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [caseStatus, setCaseStatus] = useState<CaseStatus | null>(null)
  const [showVerification, setShowVerification] = useState(false)

  const validateCaseNumber = (input: string) => {
    // USCIS case format: ABC1234567890 (3 letters + 10 digits)
    const pattern = /^[A-Z]{3}\d{10}$/
    return pattern.test(input.toUpperCase())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const formattedCase = caseNumber.toUpperCase().replace(/\s/g, '')

    if (!validateCaseNumber(formattedCase)) {
      setError('Please enter a valid USCIS case number (e.g., ABC1234567890)')
      return
    }

    setIsLoading(true)
    setShowVerification(true)

    // Simulate verification step
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleVerificationComplete = () => {
    // Mock data for MVP - replace with actual API call
    setCaseStatus({
      caseNumber: caseNumber.toUpperCase(),
      status: 'Case Was Received',
      lastUpdated: new Date().toLocaleDateString(),
      currentStep: 2,
      estimatedCompletion: '45-60 days',
      description:
        'Your case has been received and is currently under review. We have sent you a receipt notice.',
    })
    setShowVerification(false)
  }

  const steps = [
    { label: 'Case Received', status: 'completed' },
    { label: 'Under Review', status: 'current' },
    { label: 'Decision Pending', status: 'upcoming' },
    { label: 'Case Approved', status: 'upcoming' },
  ]

  return (
    <div className="space-y-8">
      {/* Input form */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            placeholder="Enter your case number (e.g., ABC1234567890)"
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-lg text-[--color-text] transition-all focus:border-[--color-accent-500] focus:ring-4 focus:ring-[--color-accent-500]/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !caseNumber}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-gradient-to-br from-[--color-accent-500] to-[--color-accent-600] px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </form>

      {/* Verification prompt */}
      {showVerification && (
        <div className="animate-fade-in mx-auto max-w-2xl rounded-2xl border-2 border-[--color-accent-300] bg-gradient-to-br from-[--color-surface] to-[--color-bg] p-8 shadow-xl dark:border-[--color-accent-700] dark:from-gray-800 dark:to-gray-900">
          <div className="space-y-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[--color-accent-100] dark:bg-[--color-accent-900]">
              <ExternalLink className="h-8 w-8 text-[--color-accent-600] dark:text-[--color-accent-400]" />
            </div>

            <div>
              <h3 className="mb-2 text-2xl font-bold text-[--color-text] dark:text-white">
                Verification Required
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                To protect against automated requests, USCIS requires human verification. Please
                complete the verification on their website.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="https://egov.uscis.gov/casestatus/landing.do"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Open USCIS Website
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                onClick={handleVerificationComplete}
                className="block w-full rounded-lg border-2 border-[--color-accent-500] px-6 py-3 font-semibold text-[--color-accent-600] transition-colors hover:bg-[--color-accent-50] dark:text-[--color-accent-400] dark:hover:bg-[--color-accent-900]/30"
              >
                I've completed verification
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              This step is required by USCIS to prevent automated scraping
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {caseStatus && !showVerification && (
        <div className="animate-fade-in mx-auto max-w-4xl space-y-6">
          {/* Status card */}
          <div className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-[--color-surface] p-8 shadow-xl dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  Case Number
                </p>
                <p className="text-2xl font-bold text-[--color-text] dark:text-white">
                  {caseStatus.caseNumber}
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-100 px-4 py-2 dark:border-green-800 dark:bg-green-900/30">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">Active</p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 text-[--color-accent-600]" />
                <div>
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                  <p className="font-semibold text-[--color-text] dark:text-white">
                    {caseStatus.status}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-[--color-accent-600]" />
                <div>
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    Estimated Completion
                  </p>
                  <p className="font-semibold text-[--color-text] dark:text-white">
                    {caseStatus.estimatedCompletion}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <p className="text-sm text-blue-900 dark:text-blue-100">{caseStatus.description}</p>
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Last updated: {caseStatus.lastUpdated}
            </p>
          </div>

          {/* Timeline visualization */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-8 text-xl font-bold text-[--color-text] dark:text-white">
              Case Timeline
            </h3>

            <div className="relative">
              {steps.map((step, index) => (
                <div key={index} className="mb-8 flex items-start gap-4 last:mb-0">
                  {/* Step indicator */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                        step.status === 'completed'
                          ? 'border-green-500 bg-green-500'
                          : step.status === 'current'
                            ? 'animate-pulse border-[--color-accent-500] bg-[--color-accent-500]'
                            : 'border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : (
                        <span className="font-bold text-white">{index + 1}</span>
                      )}
                    </div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-12 left-1/2 -ml-px h-8 w-0.5 ${
                          step.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-grow pt-2">
                    <h4
                      className={`mb-1 font-semibold ${
                        step.status === 'current'
                          ? 'text-[--color-accent-600] dark:text-[--color-accent-400]'
                          : step.status === 'completed'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {step.status === 'current' && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">In progress</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info disclaimer */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              <strong>Note:</strong> Timeline estimates are predictions based on historical data and
              current processing times. Actual processing times may vary depending on case
              complexity and USCIS workload.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
