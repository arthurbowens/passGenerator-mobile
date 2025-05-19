import React, { useState } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, Modal, TextInput } from "react-native";
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import { gerarSenha, savePassword, getPasswords } from "../../services/password/passwordService";
import AppLink from "../../components/appLink/AppLink";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { useAuth } from "../../hooks/useAuth";

console.log("passwordService.ts carregado!");
console.log("Home.tsx carregado!");

export default function Home({ navigation }) {
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState("");
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);
  const { onLogout } = useAuth();

  const handleGerarSenha = () => {
    setPassword(gerarSenha());
  };

  const copiarSenha = async () => {
    if (password) {
      try {
        await Clipboard.setStringAsync(password);
        Alert.alert("Senha copiada para a área de transferência.");
      } catch (error) {
        Alert.alert("Erro", "Não foi possível copiar a senha.");
      }
    } else {
      Alert.alert("Atenção", "Gere uma senha antes de tentar copiar.");
    }
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer logout.");
    }
  };

  const handleSalvar = () => {
    setModalError("");
    setItemName("");
    setModalVisible(true);
  };

  const handleCriar = async () => {
    setModalError("");
    setSaving(true);
    try {
      await savePassword({ service: itemName.trim(), password });
      setModalVisible(false);
      setItemName("");
      navigation.navigate("History");
    } catch (e) {
      if (e.response && e.response.status === 409) {
        setModalError("Já existe um item com este nome");
      } else {
        setModalError("Erro ao criar item. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  console.log("Modal visível?", modalVisible);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Home</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>GERADOR DE SENHA</Text>
        <View style={styles.logoWrapper}>
          <Image source={require("../../../assets/padlock-vector-icon-png_262163.jpg")} style={styles.logoImage} />
        </View>
        <Text style={styles.passwordText}>{password || "Gere sua senha"}</Text>
        <TouchableOpacity style={styles.button} onPress={handleGerarSenha}>
          <Text style={styles.buttonText}>GERAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, !password && styles.buttonDisabled]} onPress={handleSalvar} disabled={!password}>
          <Text style={styles.buttonText}>SALVAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={copiarSenha}>
          <Text style={styles.buttonText}>COPIAR</Text>
        </TouchableOpacity>
        <Text style={styles.link} onPress={() => navigation.navigate("History")}>Ver Senhas</Text>
      </View>
      {/* Modal de cadastro de item */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cadastrar Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do item"
              value={itemName}
              onChangeText={setItemName}
              autoFocus
            />
            <TextInput
              style={[styles.input, { backgroundColor: '#e0e0e0' }]}
              value={password}
              editable={false}
              selectTextOnFocus={false}
            />
            {!!modalError && <Text style={styles.modalError}>{modalError}</Text>}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#bbb' }]} onPress={() => setModalVisible(false)} disabled={saving}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, (!itemName.trim() || saving) && styles.buttonDisabled]} onPress={handleCriar} disabled={!itemName.trim() || saving}>
                <Text style={styles.buttonText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 40,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  logoutText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0074d9",
    marginBottom: 16,
    textAlign: "center",
  },
  logoWrapper: {
    width: 120,
    height: 120,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  passwordText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#0074d9",
    backgroundColor: "#e0f0ff",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00bfff",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#bdbdbd",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#0074d9",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0074d9',
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#222',
  },
  modalButton: {
    backgroundColor: '#00bfff',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 4,
  },
  modalError: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});
