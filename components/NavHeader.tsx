'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { connectWallet, getConnectedWallet } from '@/lib/wallet'
import { toast } from 'sonner'
import { Settings } from 'lucide-react'

export function NavHeader() {
  const [connected, setConnected] = useState<`0x${string}` | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected
    getConnectedWallet()
      .then(setConnected)
      .catch(() => setConnected(null))
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    try {
      const account = await connectWallet()
      setConnected(account)
      toast.success(`Connected: ${account.slice(0, 6)}...${account.slice(-4)}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to connect wallet'
      )
    } finally {
      setLoading(false)
    }
  }

  const shortAddress = connected
    ? `${connected.slice(0, 6)}...${connected.slice(-4)}`
    : null

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-blue-600 text-white font-bold">
              ⚖️
            </div>
            <span className="text-lg font-semibold text-foreground hidden sm:inline">Verdict Registry</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-sm">
                Home
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost" size="sm" className="text-sm">
                Create
              </Button>
            </Link>
            <Link href="/judge">
              <Button variant="ghost" size="sm" className="text-sm">
                Judge
              </Button>
            </Link>
            <Link href="/view">
              <Button variant="ghost" size="sm" className="text-sm">
                View
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              onClick={handleConnect}
              disabled={loading}
              variant={connected ? 'secondary' : 'default'}
              size="sm"
              className="text-sm"
            >
              {loading
                ? 'Connecting...'
                : connected
                  ? shortAddress
                  : 'Connect'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
