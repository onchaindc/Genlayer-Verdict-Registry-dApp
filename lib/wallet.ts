'use client'

const CHAIN_ID = 0xf22f // 61999 in decimal
const CHAIN_ID_HEX = '0xf22f'

export async function connectWallet(): Promise<`0x${string}`> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install it to continue.')
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error('No wallet connected')
    }

    return accounts[0] as `0x${string}`
  } catch (error) {
    if ((error as any).code === 4001) {
      throw new Error('Wallet connection rejected by user')
    }
    throw error
  }
}

export async function getConnectedWallet(): Promise<`0x${string}` | null> {
  if (!window.ethereum) {
    return null
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    })

    if (!Array.isArray(accounts) || accounts.length === 0) {
      return null
    }

    return accounts[0] as `0x${string}`
  } catch {
    return null
  }
}

export async function ensureStudioNet(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install it to continue.')
  }

  try {
    // Try to switch to the chain
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN_ID_HEX }],
    })
  } catch (error: any) {
    // Chain not added, add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CHAIN_ID_HEX,
              chainName: 'GenLayer StudioNet',
              rpcUrls: ['https://studio.genlayer.com/api'],
              nativeCurrency: {
                name: 'GEN',
                symbol: 'GEN',
                decimals: 18,
              },
            },
          ],
        })
      } catch (addError) {
        if ((addError as any).code === 4001) {
          throw new Error('User rejected adding GenLayer StudioNet')
        }
        throw addError
      }
    } else if (error.code === 4001) {
      throw new Error('User rejected switching to GenLayer StudioNet')
    } else {
      throw error
    }
  }
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}
