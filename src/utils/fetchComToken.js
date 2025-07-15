export async function fetchComToken(url, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 403 || res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    return res;
  } catch (err) {
    console.error('Erro na requisição:', err);
    throw err;
  }
}