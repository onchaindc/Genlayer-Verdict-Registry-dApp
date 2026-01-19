import { getClient } from './genlayerClient'
import { ensureStudioNet } from './wallet'

export type Verdict = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW'
export type Source = 'NONE' | 'HUMAN' | 'AI'

export type Case = {
  id: number
  question: string
  verdict: Verdict
  reasoning?: string
  judge?: string
  source?: Source
  createdAt: string
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as
  | `0x${string}`
  | undefined

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function requireContractAddress(): `0x${string}` {
  if (!CONTRACT_ADDRESS) {
    throw new Error(
      'NEXT_PUBLIC_CONTRACT_ADDRESS is not set. Please add it to .env.local and restart the dev server.'
    )
  }
  return CONTRACT_ADDRESS
}

export async function postCase(
  account: `0x${string}`,
  question: string
): Promise<{ txHash: string }> {
  const address = requireContractAddress()
  await ensureStudioNet()
  const client = await getClient(account)

  const txHash = await client.writeContract({
    address,
    functionName: 'post_case',
    args: [question],
  })

  return { txHash: txHash as string }
}

export async function submitVerdict(
  account: `0x${string}`,
  caseId: number,
  verdict: Exclude<Verdict, 'PENDING'>,
  reasoning: string
): Promise<{ txHash: string }> {
  const address = requireContractAddress()
  await ensureStudioNet()
  const client = await getClient(account)

  const txHash = await client.writeContract({
    address,
    functionName: 'submit_verdict',
    args: [caseId, verdict, reasoning],
  })

  return { txHash: txHash as string }
}

export async function aiJudge(
  account: `0x${string}`,
  caseId: number
): Promise<{ txHash: string }> {
  const address = requireContractAddress()
  await ensureStudioNet()
  const client = await getClient(account)

  const txHash = await client.writeContract({
    address,
    functionName: 'ai_judge',
    args: [caseId],
  })

  return { txHash: txHash as string }
}

export async function getCase(caseId: number): Promise<Case | null> {
  const address = requireContractAddress()
  const client = await getClient()

  const question = (await client.readContract({
    address,
    functionName: 'get_question',
    args: [caseId],
  })) as string

  // In your ISC: unknown case returns "" for views
  if (!question || question.trim() === '') return null

  const verdictRaw = (await client.readContract({
    address,
    functionName: 'get_verdict',
    args: [caseId],
  })) as string

  const reasoningRaw = (await client.readContract({
    address,
    functionName: 'get_reasoning',
    args: [caseId],
  })) as string

  const judgeRaw = (await client.readContract({
    address,
    functionName: 'get_judge',
    args: [caseId],
  })) as string

  const sourceRaw = (await client.readContract({
    address,
    functionName: 'get_source',
    args: [caseId],
  })) as string

  const createdAt = (await client.readContract({
    address,
    functionName: 'get_created_at',
    args: [caseId],
  })) as string

  const verdict: Verdict =
    verdictRaw && verdictRaw.trim() !== '' ? (verdictRaw as Verdict) : 'PENDING'

  const reasoning = reasoningRaw && reasoningRaw.trim() !== '' ? reasoningRaw : undefined
  const judge =
    judgeRaw && judgeRaw !== ZERO_ADDRESS && judgeRaw.trim() !== '' ? judgeRaw : undefined
  const source =
    sourceRaw && sourceRaw.trim() !== '' ? (sourceRaw as Source) : undefined

  return {
    id: caseId,
    question,
    verdict,
    reasoning,
    judge,
    source,
    createdAt,
  }
}

export async function getNextCaseId(): Promise<number> {
  const address = requireContractAddress()
  const client = await getClient()

  const result = await client.readContract({
    address,
    functionName: 'get_next_case_id',
    args: [],
  })

  // SDK might return number or string depending on implementation; normalize:
  return typeof result === 'number' ? result : Number(result)
}
