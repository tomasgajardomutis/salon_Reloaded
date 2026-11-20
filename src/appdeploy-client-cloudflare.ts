type ApiResponse<T = unknown> = { data: T };

async function request<T = unknown>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return { data: await response.json() as T };
}

export const api = {
  get<T = unknown>(url: string): Promise<ApiResponse<T>> {
    return request<T>(url);
  },
  post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, { method: 'POST', body: JSON.stringify(data ?? {}) });
  },
  put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, { method: 'PUT', body: JSON.stringify(data ?? {}) });
  },
  delete<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, { method: 'DELETE', body: JSON.stringify(data ?? {}) });
  },
};

const unsupportedAuthError = () => {
  const authError = new Error('La autenticación administrativa requiere el entorno AppDeploy.') as Error & { code?: string };
  authError.code = 'auth_error';
  return authError;
};

export const auth = {
  isSignedIn(): boolean {
    return false;
  },
  async getUser(): Promise<null> {
    return null;
  },
  async getAccessToken(): Promise<null> {
    return null;
  },
  async signIn(): Promise<never> {
    throw unsupportedAuthError();
  },
  async signOut(): Promise<void> {
    return;
  },
};
