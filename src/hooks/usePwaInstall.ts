import { useCallback, useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

function isRunningStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as NavigatorWithStandalone).standalone)
  )
}

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(isRunningStandalone)
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const displayMode = window.matchMedia('(display-mode: standalone)')

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    const handleInstalled = () => {
      setInstallPrompt(null)
      setIsInstalled(true)
    }

    const updateDisplayMode = () => setIsInstalled(isRunningStandalone())
    const setOnline = () => setIsOnline(true)
    const setOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)
    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)
    displayMode.addEventListener('change', updateDisplayMode)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
      window.removeEventListener('online', setOnline)
      window.removeEventListener('offline', setOffline)
      displayMode.removeEventListener('change', updateDisplayMode)
    }
  }, [])

  const install = useCallback(async () => {
    if (!installPrompt) return 'unavailable' as const

    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    setInstallPrompt(null)
    return outcome
  }, [installPrompt])

  return {
    canInstall: Boolean(installPrompt) && !isInstalled,
    install,
    isInstalled,
    isOnline,
  }
}
