/** Failed collection reads keep list screens usable without disguising the failure. */
export function collectionResult<T>(result: PromiseSettledResult<T[]>) {
  return result.status === "fulfilled"
    ? { items: result.value, failed: false }
    : { items: [] as T[], failed: true };
}