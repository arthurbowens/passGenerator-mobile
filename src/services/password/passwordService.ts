import { getStorageItem, setStorageItem } from "../../utils/localStorage";

export function gerarSenha(tamanho = 8) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    senha += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return senha;
}

export const savePassword = async (password: string) => {
  try {
    const saved = await getStorageItem("passwords");
    const history = saved ? JSON.parse(saved) : [];

    history.push(password);

    await setStorageItem("passwords", JSON.stringify(history));
  } catch (error) {
    console.error("Erro ao salvar a senha.", error);
  }
};

export const getPasswords = async (): Promise<string[]> => {
  try {
    const saved = await getStorageItem("passwords");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erro ao recuperar as senhas.", error);
    return [];
  }
};

export const clearPasswords = async () => {
  await setStorageItem("passwords", JSON.stringify([]));
};
