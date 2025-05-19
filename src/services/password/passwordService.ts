const API_URL = "http://localhost:8080/passGenerator/item";

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
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome: item.service, senha: item.password }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Erro ao salvar");
  }
};

// Listar senhas do backend
export const getPasswords = async () => {
  const response = await fetch(`${API_URL}/items`);
  if (!response.ok) throw new Error("Erro ao buscar itens");
  return await response.json(); // [{id, nome, senha}, ...]
};

// Deletar senha do backend
export const deletePassword = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Erro ao deletar");
};
