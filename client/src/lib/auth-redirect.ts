/**
 * Auth Redirect Utilities
 * 
 * These utilities handle storing and retrieving the intended URL
 * when a user is redirected to login from a protected page.
 */

const REDIRECT_KEY = 'redirectAfterLogin';

/**
 * Store the current URL to redirect back after login
 * Call this before redirecting to the login page
 */
export function storeRedirectUrl(url?: string): void {
  const redirectUrl = url || window.location.pathname + window.location.search;
  sessionStorage.setItem(REDIRECT_KEY, redirectUrl);
}

/**
 * Get and clear the stored redirect URL
 * Call this after successful login to get the URL to redirect to
 * @param fallbackUrl - URL to use if no stored redirect exists
 */
export function getAndClearRedirectUrl(fallbackUrl: string = '/courses'): string {
  const storedRedirect = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  return storedRedirect || fallbackUrl;
}

/**
 * Check if there's a stored redirect URL
 */
export function hasStoredRedirectUrl(): boolean {
  return sessionStorage.getItem(REDIRECT_KEY) !== null;
}

/**
 * Clear the stored redirect URL without returning it
 */
export function clearRedirectUrl(): void {
  sessionStorage.removeItem(REDIRECT_KEY);
}
