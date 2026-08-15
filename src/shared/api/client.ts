export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function apiCall<T>(fn: () => Promise<T>): Promise<T> {
  return fn()
}