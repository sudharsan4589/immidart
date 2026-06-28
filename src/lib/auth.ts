const KEY = "immidart_auth_role";

export function setAuth(role: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, role);
  }
}

export function getAuth(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY);
  }
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}
