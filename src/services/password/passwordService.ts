import api from '../../utils/api';

export function gerarSenha(tamanho = 8) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    senha += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return senha;
}

// Salvar senha no backend
export const savePassword = async (item: { service: string, password: string }) => {
  try {
    console.log('Token atual:', api.defaults.headers.common["Authorization"]);
    console.log('Enviando dados:', { nome: item.service, senha: item.password });
    
    const response = await api.post('/item', {
      nome: item.service,
      senha: item.password
    });
    
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro detalhado ao salvar senha:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    
    if (error.response?.status === 403) {
      throw new Error("Sessão expirada ou token inválido. Por favor, faça login novamente.");
    }
    throw new Error(error.response?.data?.message || "Erro ao salvar senha no sistema");
  }
};

// Listar senhas do backend
export const getPasswords = async () => {
  try {
    console.log('Token atual:', api.defaults.headers.common["Authorization"]);
    
    const response = await api.get('/item/items');
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      console.error('Erro detalhado ao buscar senhas:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw new Error("Sessão expirada ou token inválido. Por favor, faça login novamente.");
    } else if (error.response?.status === 404) {
      // Não loga erro no console para 404 (nenhum item encontrado)
      return [];
    }
    
    // Loga outros erros que não sejam 404 ou 403
    console.error('Erro detalhado ao buscar senhas:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    throw new Error("Erro ao buscar itens");
  }
};

// Deletar senha do backend
export const deletePassword = async (id: number) => {
  try {
    console.log('Token atual:', api.defaults.headers.common["Authorization"]);
    
    await api.delete(`/item/${id}`);
  } catch (error) {
    console.error('Erro detalhado ao deletar senha:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    if (error.response?.status === 403) {
      throw new Error("Sessão expirada ou token inválido. Por favor, faça login novamente.");
    }
    throw new Error("Erro ao deletar");
  }
};

// Deletar todos os itens do backend
export const deleteAllPasswords = async () => {
  try {
    console.log('Token atual:', api.defaults.headers.common["Authorization"]);
    await api.delete('/item/todos');
  } catch (error) {
    console.error('Erro detalhado ao deletar todos:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    if (error.response?.status === 403) {
      throw new Error("Sessão expirada ou token inválido. Por favor, faça login novamente.");
    }
    throw new Error("Erro ao deletar todos os itens");
  }
};
