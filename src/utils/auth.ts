/**
 * Retorna o token de autenticação correto baseado no usuário ativo
 * Prioriza o token secundário se existir, senão usa o token principal
 */
export const getActiveToken = (): string | null => {
  const secondaryToken = localStorage.getItem('secondaryAuthToken');
  const mainToken = localStorage.getItem('authToken');
  
  return secondaryToken || mainToken;
};

/**
 * Retorna os headers de autenticação com o token correto
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getActiveToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};