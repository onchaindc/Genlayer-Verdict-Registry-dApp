import { createClient, type Client } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'

let cachedClient: Client | null = null
let initializePromise: Promise<void> | null = null

export async function getClient(account?: `0x${string}`): Promise<Client> {
  const client = createClient({
    chain: studionet,
    endpoint: process.env.NEXT_PUBLIC_GENLAYER_RPC_URL,
    account,
  })

  // Initialize consensus smart contract once per session
  if (!cachedClient) {
    if (!initializePromise) {
      initializePromise = client.initializeConsensusSmartContract()
    }
    await initializePromise
    cachedClient = client
  }

  return client
}
