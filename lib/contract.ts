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

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

function ensureContractAddress() {
  if (!CONTRACT_ADDRESS) {
    throw new Error(
      'NEXT_PUBLIC_CONTRACT_ADDRESS is not set. Please add it to your environment variables.'
    )
  }
}

export async function postCase(
  account: `0x${string}`,
  question: string
): Promise<{ txHash: string }> {
  ensureContractAddress()
  await ensureStudioNet()
  const client = await getClient(account)

  const result = await client.writeContract({
    functionName: 'post_case',
    args: [question],
  })

  return { txHash: result as string }
}

export async function submitVerdict(
  account: `0x${string}`,
  caseId: number,
  verdict: Exclude<Verdict, 'PENDING'>,
  reasoning: string
): Promise<{ txHash: string }> {
  ensureContractAddress()
  await ensureStudioNet()
  const client = await getClient(account)

  const result = await client.writeContract({
    functionName: 'submit_verdict',
    args: [caseId, verdict, reasoning],
  })

  return { txHash: result as string }
}

export async function aiJudge(
  account: `0x${string}`,
  caseId: number
): Promise<{ txHash: string }> {
  ensureContractAddress()
  await ensureStudioNet()
  const client = await getClient(account)

  const result = await client.writeContract({
    functionName: 'ai_judge',
    args: [caseId],
  })

  return { txHash: result as string }
}

export async function getCase(caseId: number): Promise<Case | null> {
  const client = await getClient()

  // Read all the case data
  const question = (await client.readContract({
    functionName: 'get_question',
    args: [caseId],
  })) as string

  // If question is empty, case doesn't exist
  if (question === '') {
    return null
  }

  const verdictRaw = (await client.readContract({
    functionName: 'get_verdict',
    args: [caseId],
  })) as string

  const reasoning = (await client.readContract({
    functionName: 'get_reasoning',
    args: [caseId],
  })) as string

  const judge = (await client.readContract({
    functionName: 'get_judge',
    args: [caseId],
  })) as string

  const source = (await client.readContract({
    functionName: 'get_source',
    args: [caseId],
  })) as string

  const createdAt = (await client.readContract({
    functionName: 'get_created_at',
    args: [caseId],
  })) as string

  // Treat empty verdict as PENDING
  const verdict: Verdict = verdictRaw === '' ? 'PENDING' : (verdictRaw as Verdict)

  return {
    id: caseId,
    question,
    verdict,
    reasoning: reasoning === '' ? undefined : reasoning,
    judge: judge === '0x000' ? undefined : judge,
    source: source === 'NONE' || source === '' ? undefined : (source as Source),
    createdAt,
  }
}

export async function getNextCaseId(): Promise<number> {
  const client = await getClient()

  const result = (await client.readContract({
    functionName: 'get_next_case_id',
    args: [],
  })) as number

  return result
}
