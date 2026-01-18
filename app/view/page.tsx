'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getCase, type Case, type Verdict } from '@/lib/contract'
import { toast } from 'sonner'
import Loading from './loading'

export default function ViewPage() {
  const searchParams = useSearchParams()
  const [caseId, setCaseId] = useState('')
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Load case from URL params on mount
  useEffect(() => {
    const urlCaseId = searchParams.get('caseId')
    if (urlCaseId) {
      setCaseId(urlCaseId)
      loadCase(parseInt(urlCaseId, 10))
    }
  }, [searchParams])

  const loadCase = async (id: number) => {
    setLoading(true)
    setNotFound(false)
    try {
      const data = await getCase(id)
      if (!data) {
        setNotFound(true)
        setCaseData(null)
        toast.error('Case not found')
        return
      }
      setCaseData(data)
      setNotFound(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load case')
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadCase = async () => {
    if (!caseId.trim()) {
      toast.error('Please enter a case ID')
      return
    }

    const id = parseInt(caseId, 10)
    if (isNaN(id)) {
      toast.error('Invalid case ID')
      return
    }

    loadCase(id)
  }

  const handleRefresh = () => {
    if (!caseData) return
    loadCase(caseData.id)
  }

  const getVerdictColor = (verdict: Verdict) => {
    switch (verdict) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'NEEDS_REVIEW':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-3xl space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle>View Case</CardTitle>
              <CardDescription>Enter a case ID to view its details</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter case ID..."
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLoadCase()}
                disabled={loading}
              />
              <Button onClick={handleLoadCase} disabled={loading}>
                {loading ? 'Loading...' : 'View'}
              </Button>
            </CardContent>
          </Card>

          {/* Case Details */}
          {caseData ? (
            <Card>
              <CardHeader>
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <CardTitle className="text-3xl">Case #{caseData.id}</CardTitle>
                    <CardDescription>
                      Created: {new Date(caseData.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`h-fit px-3 py-1 text-base ${getVerdictColor(caseData.verdict)}`}
                  >
                    {caseData.verdict}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question */}
                <div className="space-y-2">
                  <p className="font-medium">Question</p>
                  <p className="whitespace-pre-wrap rounded bg-muted p-4 text-sm leading-relaxed">
                    {caseData.question}
                  </p>
                </div>

                <Separator />

                {/* Case Status */}
                {caseData.verdict === 'PENDING' ? (
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      ⏳ This case is awaiting judgment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Judgment Details</h3>

                    {caseData.judge && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Judge Address</p>
                        <p className="break-all rounded bg-muted p-3 font-mono text-sm">
                          {caseData.judge}
                        </p>
                      </div>
                    )}

                    {caseData.source && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Verdict Source</p>
                        <p className="text-sm">
                          {caseData.source === 'HUMAN'
                            ? '👤 Human Judge'
                            : caseData.source === 'AI'
                              ? '🤖 AI Judge'
                              : '❓ Unknown'}
                        </p>
                      </div>
                    )}

                    {caseData.reasoning && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Reasoning</p>
                        <p className="whitespace-pre-wrap rounded bg-muted p-4 text-sm leading-relaxed">
                          {caseData.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  {loading ? 'Refreshing...' : 'Refresh Case'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Loading />
          )}

          {/* Not Found State */}
          {notFound && !caseData && (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="pt-6">
                <p className="text-sm text-red-900 dark:text-red-100">
                  Case not found. Please check the case ID and try again.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
