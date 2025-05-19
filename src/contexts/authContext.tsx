import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../utils/api";
import * as localStorage from "../utils/localStorage";

interface AuthContextProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    dataNascimento: string
  ) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
  authState: AuthenticateProps;
}

interface AuthenticateProps {
  token: string | null;
  authenticated: boolean | null;
}

//Tipando por causa do typescript
type AuthProviderProps = {
  children: ReactNode;
};

const TOKEN_KEY = "acess-token";

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthenticateProps>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await localStorage.getStorageItem(TOKEN_KEY);

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    dataNascimento: string
  ) => {
    try {
      await api.post("/auth/signup", {
        nome: name,
        email,
        senha: password,
        confirmacaoSenha: confirmPassword,
        dataNascimento,
      });
    } catch (error) {
      console.error("Erro ao registrar", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await api.post("/auth/signin", { email, senha: password });
      const token = result.data.token;
      
      if (!token) {
        throw new Error("Token não recebido do servidor");
      }

      setAuthState({
        authenticated: true,
        token: token,
      });
      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await localStorage.setStorageItem(TOKEN_KEY, token);
      return result.data;
    } catch (error) {
      console.error("Erro ao fazer login", error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeStorageItem(TOKEN_KEY);
    api.defaults.headers.common["Authorization"] = "";
    setAuthState({
      authenticated: null,
      token: null,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
