const TOKEN_COOKIE = 'token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const sessionToken = sessionStorage.getItem(TOKEN_COOKIE);
  if (sessionToken) return sessionToken;

  const cookieToken = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${TOKEN_COOKIE}=`))
    ?.slice(TOKEN_COOKIE.length + 1);
  return cookieToken ? decodeURIComponent(cookieToken) : null;
}

export function storeAuthToken(token: string): void {
  sessionStorage.setItem(TOKEN_COOKIE, token);
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${
    60 * 60 * 24
  }; SameSite=Strict${secure}`;
}

export function clearAuthToken(): void {
  sessionStorage.removeItem(TOKEN_COOKIE);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
}
