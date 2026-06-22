// ApiCore's response interceptor rejects with different shapes depending on status:
// - most errors: a plain string message
// - 422 validation errors: the raw error.response.data object (field errors)
// This normalizes any of those into a single string safe to render in the UI.
export function getErrorMessage(err: unknown, fallback = 'Something went wrong.'): string {
  if (typeof err === 'string') return err;

  if (err && typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;

    // 422 case: data is often { errors: { field: 'message' } } or similar — show the first one we find.
    if (obj.errors && typeof obj.errors === 'object') {
      const firstKey = Object.keys(obj.errors as Record<string, unknown>)[0];
      const firstVal = firstKey ? (obj.errors as Record<string, unknown>)[firstKey] : null;
      if (typeof firstVal === 'string') return firstVal;
      if (Array.isArray(firstVal) && typeof firstVal[0] === 'string') return firstVal[0];
    }
  }

  return fallback;
}