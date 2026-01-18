'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getCase } from '@/lib/contract'
import { toast } from 'sonner'

export default function HomePage() {
  const router = useRouter()
  const [caseId, setCaseId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleViewCase = async () => {
    if (!caseId.trim()) {
      toast.error('Please enter a case ID')
      return
    }

    setLoading(true)
    try {
      const id = parseInt(caseId, 10)
      if (isNaN(id)) {
        toast.error('Invalid case ID')
        return
      }

      const caseData = await getCase(id)
      if (!caseData) {
        toast.error('Case not found')
        return
      }

      router.push(`/view?caseId=${id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load case')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-blue-600 text-4xl">
                ⚖️
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight text-foreground">
                Verdict Registry
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                A decentralized platform for case submissions and verdicts using GenLayer intelligent smart contracts
              </p>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/create">
              <Card className="group h-full cursor-pointer border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg hover:border-accent/50">
                <CardHeader>
                  <div className="mb-2 text-4xl group-hover:scale-110 transition-transform duration-300">📝</div>
                  <CardTitle>Create Case</CardTitle>
                  <CardDescription>Submit a new case question</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/judge">
              <Card className="group h-full cursor-pointer border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg hover:border-accent/50">
                <CardHeader>
                  <div className="mb-2 text-4xl group-hover:scale-110 transition-transform duration-300">🔍</div>
                  <CardTitle>Judge Case</CardTitle>
                  <CardDescription>Review and judge cases</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/view">
              <Card className="group h-full cursor-pointer border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg hover:border-accent/50">
                <CardHeader>
                  <div className="mb-2 text-4xl group-hover:scale-110 transition-transform duration-300">📊</div>
                  <CardTitle>View Case</CardTitle>
                  <CardDescription>Check case status</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* View Case Section */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>View Case by ID</CardTitle>
              <CardDescription>Enter a case ID to view its details and verdicts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter case ID..."
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleViewCase()}
                  disabled={loading}
                  className="bg-background/50"
                />
                <Button onClick={handleViewCase} disabled={loading} className="px-8">
                  {loading ? 'Loading...' : 'View'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>The complete workflow of Verdict Registry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-sm">
                      1
                    </div>
                    <h3 className="font-semibold text-foreground">Create</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Submit a new case question to the blockchain
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-sm">
                      2
                    </div>
                    <h3 className="font-semibold text-foreground">Judge</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Human judges or AI provide verdicts with reasoning
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-sm">
                      3
                    </div>
                    <h3 className="font-semibold text-foreground">Verify</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    All verdicts are recorded on GenLayer ISC
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-sm">
                      4
                    </div>
                    <h3 className="font-semibold text-foreground">Track</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    View the status and reasoning of any case
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
