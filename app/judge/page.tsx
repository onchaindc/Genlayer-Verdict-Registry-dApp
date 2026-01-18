'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { connectWallet, getConnectedWallet } from '@/lib/wallet'
import { getCase, submitVerdict, aiJudge, type Case, type Verdict } from '@/lib/contract'
import { toast } from 'sonner'

export default function JudgePage() {
  const [caseId, setCaseId] = useState('')
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [verdict, setVerdict] = useState<Exclude<Verdict, 'PENDING'>>('APPROVED')
  const [reasoning, setReasoning] = useState('')
  const [txHash, setTxHash] = useState('')

  const handleLoadCase = async () => {
    if (!caseId.trim()) {
      toast.error('Please enter a case ID')
      return
    }

    setLoading(true)
    try {
      const id = parseInt(caseId, 10)
      if (isNaN(id) || id <= 0) {
        toast.error('Invalid case ID')
        return
      }

      const data = await getCase(id)
      if (!data) {
        toast.error('Case not found')
        setCaseData(null)
        return
      }

      setCaseData(data)
      setTxHash('')
      setReasoning('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load case')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitVerdict = async () => {
    if (!caseData) {
      toast.error('Please load a case first')
      return
    }
    if (!reasoning.trim() || reasoning.trim().length < 5) {
      toast.error('Reasoning is too short (min 5 characters)')
      return
    }

    setSubmitting(true)
    const toastId = toast.loading('Submitting verdict...')

    try {
      let account = await getConnectedWallet()
      if (!account) account = await connectWallet()

      const result = await submitVerdict(account, caseData.id, verdict, reasoning.trim())
      setTxHash(result.txHash)

      toast.success('Verdict submitted successfully!', { id: toastId })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit verdict', { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  const handleAiJudge = async () => {
    if (!caseData) {
      toast.error('Please load a case first')
      return
    }

    setSubmitting(true)
    const toastId = toast.loading('Requesting AI judgment...')

    try {
      let account = await getConnectedWallet()
      if (!account) account = await connectWallet()

      const result = await aiJudge(account, caseData.id)
      setTxHash(result.txHash)

      toast.success('AI judgment requested! It may take a bit—click Refresh Case in a moment.', {
        id: toastId,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to request AI judgment', { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRefreshCase = async () => {
    if (!caseData) return
    setLoading(true)
    try {
      const updatedData = await getCase(caseData.id)
      if (updatedData) {
        setCaseData(updatedData)
        // keep txHash visible; don't wipe it automatically
        toast.success('Case updated')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to refresh case')
    } finally {
      setLoading(false)
    }
  }

  const getVerdictColor = (v: Verdict) => {
    switch (v) {
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
        <div className="w-full max-w-4xl space-y-6">
          {/* Load Case Section */}
          <Card>
            <CardHeader>
              <CardTitle>Load Case</CardTitle>
              <CardDescription>Enter a case ID to review and judge</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter case ID..."
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoadCase()}
                disabled={loading}
              />
              <Button onClick={handleLoadCase} disabled={loading}>
                {loading ? 'Loading...' : 'Load'}
              </Button>
            </CardContent>
          </Card>

          {/* Case Details */}
          {caseData && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Case #{caseData.id}</CardTitle>
                    <CardDescription>{caseData.createdAt}</CardDescription>
                  </div>
                  <Badge className={`${getVerdictColor(caseData.verdict)}`}>
                    {caseData.verdict}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Question</p>
                  <p className="rounded bg-muted p-3 text-sm">{caseData.question}</p>
                </div>

                {/* Current Verdict Details */}
                {caseData.verdict !== 'PENDING' && (
                  <>
                    <Separator />
                    <div className="grid gap-4 sm:grid-cols-2">
                      {caseData.judge && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Judge</p>
                          <p className="break-all font-mono text-sm">{caseData.judge}</p>
                        </div>
                      )}
                      {caseData.source && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Source</p>
                          <p className="text-sm">{caseData.source}</p>
                        </div>
                      )}
                    </div>
                    {caseData.reasoning && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Reasoning</p>
                        <p className="rounded bg-muted p-3 text-sm">{caseData.reasoning}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Human Verdict Form */}
                {caseData.verdict === 'PENDING' && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-semibold">Submit Your Verdict</h3>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Verdict</label>
                        <Select
                          value={verdict}
                          onValueChange={(v) =>
                            setVerdict(v as Exclude<Verdict, 'PENDING'>)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="NEEDS_REVIEW">Needs Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reasoning</label>
                        <Textarea
                          placeholder="Provide your reasoning for this verdict..."
                          value={reasoning}
                          onChange={(e) => setReasoning(e.target.value)}
                          disabled={submitting}
                          className="min-h-32"
                        />
                      </div>

                      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                        <Button
                          onClick={handleSubmitVerdict}
                          disabled={submitting || reasoning.trim().length < 5}
                          className="flex-1"
                        >
                          {submitting ? 'Submitting...' : 'Submit Verdict'}
                        </Button>
                        <Button
                          onClick={handleAiJudge}
                          disabled={submitting}
                          variant="secondary"
                          className="flex-1"
                        >
                          {submitting ? 'Processing...' : 'AI Judge'}
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Transaction Result */}
                {txHash && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                        <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                          ✓ Transaction Submitted
                        </p>
                        <p className="text-xs text-green-900/80 dark:text-green-100/80">
                          If this was AI Judge, it may take a bit for the verdict to appear. Try Refresh Case.
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Transaction Hash:</p>
                      <p className="break-all rounded bg-muted p-3 font-mono text-xs">
                        {txHash}
                      </p>
                      <Button onClick={handleRefreshCase} className="mt-4 w-full" disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh Case'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
