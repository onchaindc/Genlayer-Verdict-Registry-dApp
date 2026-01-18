'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { connectWallet, getConnectedWallet } from '@/lib/wallet'
import { postCase, getNextCaseId } from '@/lib/contract'
import { toast } from 'sonner'

export default function CreatePage() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [createdCaseId, setCreatedCaseId] = useState<number | null>(null)

  const handleCreateCase = async () => {
    const q = question.trim()
    if (q.length < 5) {
      toast.error('Question is too short (min 5 characters)')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Submitting case to blockchain...')

    try {
      let account = await getConnectedWallet()
      if (!account) account = await connectWallet()

      const result = await postCase(account, q)
      setTxHash(result.txHash)

      const nextId = await getNextCaseId()
      const caseId = nextId - 1
      setCreatedCaseId(caseId)

      toast.success(`Case created successfully! Case ID: ${caseId}`, { id: toastId })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create case', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Create New Case</CardTitle>
              <CardDescription>
                Submit a new case question to the Verdict Registry blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!txHash ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Case Question</label>
                    <Textarea
                      placeholder="Enter your case question or scenario..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={loading}
                      className="min-h-40"
                    />
                    <p className="text-xs text-muted-foreground">
                      Be clear and specific so judges can make informed decisions
                    </p>
                  </div>

                  <Button
                    onClick={handleCreateCase}
                    disabled={loading || question.trim().length < 5}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? 'Creating Case...' : 'Create Case'}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                      ✓ Case Created Successfully!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Case ID</p>
                    <p className="break-all rounded bg-muted p-3 font-mono text-sm">
                      {createdCaseId}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Transaction Hash</p>
                    <p className="break-all rounded bg-muted p-3 font-mono text-xs">
                      {txHash}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Question</p>
                    <p className="rounded bg-muted p-3 text-sm">{question}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Create Another
                    </Button>
                    {createdCaseId !== null && (
                      <Link href={`/view?caseId=${createdCaseId}`} className="flex-1">
                        <Button className="w-full">View Case</Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
