import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "../../hooks/useAuth";

export default function SignUp({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { onRegister } = useAuth();

  const formatDate = (dateStr: string) => {
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const isValidDate = (dateStr: string) => {
    // Check if the date matches DD/MM/YYYY format
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year;
  };

  const isValidEmail = (email: string) => {
    // Regex para validar email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setError("");
    if (!isValidEmail(email)) {
      setError("Email inválido. Use um formato válido como exemplo@dominio.com");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!isValidDate(dataNascimento)) {
      setError("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
      return;
    }
    setLoading(true);
    try {
      const formattedDate = formatDate(dataNascimento);
      await onRegister(nome, email, senha, confirmarSenha, formattedDate);
      navigation.navigate("Login");
    } catch (e) {
      setError("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !nome || !email || !dataNascimento || !senha || !confirmarSenha || loading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGN UP</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#222"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#222"
      />
      <Text style={styles.label}>Data de Nascimento</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        value={dataNascimento}
        onChangeText={setDataNascimento}
        keyboardType="numeric"
        placeholderTextColor="#222"
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#222"
      />
      <Text style={styles.label}>Confirmar Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        placeholderTextColor="#222"
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isDisabled}
      >
        <Text style={styles.buttonText}>REGISTRAR</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.goBack()}>Voltar</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0074d9",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 16,
    letterSpacing: 1,
  },
  label: {
    color: "#222",
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#00bfff",
    color: "#222",
    borderRadius: 6,
    padding: 12,
    marginBottom: 18,
    fontSize: 16,
    borderWidth: 0,
  },
  button: {
    backgroundColor: "#bdbdbd",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#444",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#222",
    fontSize: 12,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
