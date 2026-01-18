/**
 * GenLayer ISC Contract Function Names
 * 
 * This module documents the allowed contract function names for interacting
 * with the Verdict Registry Intelligent Smart Contract via genlayer-js.
 * 
 * genlayer-js handles the ABI internally, so we only need to specify
 * functionName and args directly.
 */

export type ContractFunctionName =
  | 'post_case'
  | 'submit_verdict'
  | 'ai_judge'
  | 'get_next_case_id'
  | 'get_question'
  | 'get_verdict'
  | 'get_reasoning'
  | 'get_judge'
  | 'get_source'
  | 'get_created_at'

/**
 * Write Functions (require wallet signature):
 * - post_case(question: string) -> txHash
 *   Submit a new case question to the contract
 * 
 * - submit_verdict(caseId: number, verdict: string, reasoning: string) -> txHash
 *   Submit a human verdict for a case
 * 
 * - ai_judge(caseId: number) -> txHash
 *   Request AI judgment for a case
 */

/**
 * Read Functions (no wallet required):
 * - get_next_case_id() -> number
 *   Get the next case ID that will be assigned
 * 
 * - get_question(caseId: number) -> string
 *   Get the question for a case (empty string if not found)
 * 
 * - get_verdict(caseId: number) -> string
 *   Get the verdict for a case (PENDING, APPROVED, REJECTED, NEEDS_REVIEW)
 * 
 * - get_reasoning(caseId: number) -> string
 *   Get the reasoning provided for a verdict (empty string if not judged)
 * 
 * - get_judge(caseId: number) -> string
 *   Get the address of the judge who made the verdict (0x000... if not judged)
 * 
 * - get_source(caseId: number) -> string
 *   Get the source of the verdict (NONE, HUMAN, AI)
 * 
 * - get_created_at(caseId: number) -> string
 *   Get the creation timestamp of the case
 */
