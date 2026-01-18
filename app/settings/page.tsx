'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { setTheme, getTheme } from '@/lib/theme'
import { Moon, Sun, Monitor } from 'lucide-react'
import { toast } from 'sonner'

type Theme = 'light' | 'dark' | 'system'

export default function SettingsPage() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCurrentTheme(getTheme())
  }, [])

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    setTheme(theme)
    toast.success(`Theme changed to ${theme}`)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 rounded-lg bg-muted"></div>
            <div className="h-64 rounded-lg bg-muted"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">Customize your Verdict Registry experience</p>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Choose how Verdict Registry looks to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Theme Preference</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                      currentTheme === 'light'
                        ? 'border-accent bg-accent/10'
                        : 'border-border/40 hover:border-border/60 bg-card'
                    }`}
                  >
                    <Sun className="h-6 w-6 text-accent" />
                    <span className="text-sm font-medium">Light</span>
                  </button>

                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                      currentTheme === 'dark'
                        ? 'border-accent bg-accent/10'
                        : 'border-border/40 hover:border-border/60 bg-card'
                    }`}
                  >
                    <Moon className="h-6 w-6 text-accent" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>

                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                      currentTheme === 'system'
                        ? 'border-accent bg-accent/10'
                        : 'border-border/40 hover:border-border/60 bg-card'
                    }`}
                  >
                    <Monitor className="h-6 w-6 text-accent" />
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  The System option follows your device settings
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Information about Verdict Registry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium text-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium text-foreground">GenLayer StudioNet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground">Decentralized Platform</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
