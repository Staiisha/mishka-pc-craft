// api.ts
export const fetchWithAuth = async (input: RequestInfo, init: RequestInit = {}) => {
  const accessToken = localStorage.getItem('access');
  const refreshToken = localStorage.getItem('refresh');

  const fetchWithToken = async (token: string) => {
    const headers = {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    };

    return fetch(input, { ...init, headers });
  };

  let response = await fetchWithToken(accessToken || '');

  if (response.status === 401 && refreshToken) {
    // пробуем рефрешнуть токен
    const refreshResponse = await fetch('https://mishka-pc-craft-backend.ru/api/auth/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (refreshResponse.ok) {
      const tokens = await refreshResponse.json();
      localStorage.setItem('access', tokens.access);
      localStorage.setItem('refresh', tokens.refresh);

      // повторяем исходный запрос с новым токеном
      response = await fetchWithToken(tokens.access);
    } else {
      // рефреш не удался — разлогиниваем пользователя
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login'; // или другой путь к логину
    }
  }

  return response;
};
