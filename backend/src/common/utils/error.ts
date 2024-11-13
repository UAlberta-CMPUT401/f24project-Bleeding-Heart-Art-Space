export interface ErrorResponse {
  error: string;
}

export function hasError<T>(value: T): value is T & { error: string } {
  return value !== null && typeof value === 'object' && 'error' in value && typeof value.error === 'string';
}
