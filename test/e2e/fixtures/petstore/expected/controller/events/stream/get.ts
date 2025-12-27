import type { GetInput, GetEventOutput } from './types.gen'

export async function* handleGet(
  input: GetInput,
): AsyncGenerator<GetEventOutput> {
  // @ts-ignore - Implementation required
  throw new Error('Not implemented')
}
