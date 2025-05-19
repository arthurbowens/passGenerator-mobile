import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid, Alert } from "react-native";
import { getPasswords, deletePassword } from "../../services/password/passwordService";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';

export default function History() {
  const [passwords, setPasswords] = useState<any[]>([]);
  const [showPasswordIndex, setShowPasswordIndex] = useState<number | null>(null);
  const navigation = useNavigation();

  const carregarSenhas = async () => {
    try {
      const data = await getPasswords();
      setPasswords(data || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao obter itens',
        text2: 'Não foi possível carregar sua lista de senhas'
      });
    }
  };

  useEffect(() => {
    carregarSenhas();
  }, []);

  const handleCopy = async (password: string) => {
    try {
      await Clipboard.setStringAsync(password);
      ToastAndroid.show("Senha copiada!", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Erro ao copiar senha", ToastAndroid.SHORT);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir esta senha?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePassword(id);
              await carregarSenhas(); // Recarrega a lista após excluir
              ToastAndroid.show("Senha excluída com sucesso!", ToastAndroid.SHORT);
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erro ao excluir senha',
                text2: 'Não foi possível excluir a senha'
              });
            }
          }
        }
      ]
    );
  };

  const renderPassword = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.passwordCard}>
      <Text style={styles.passwordService}>{item.nome}</Text>
      <Text style={styles.passwordMasked}>
        {showPasswordIndex === index ? item.senha : "********"}
      </Text>
      <View style={styles.emojiRow}>
        <TouchableOpacity onPress={() => setShowPasswordIndex(showPasswordIndex === index ? null : index)}>
          <Text style={styles.emoji}>{showPasswordIndex === index ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCopy(item.senha)}>
          <Text style={styles.emoji}>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.emoji}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      {/* Card central */}
      <View style={styles.card}>
        {passwords.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma senha foi gerada</Text>
        ) : (
          <FlatList
            data={passwords}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPassword}
            contentContainerStyle={{ alignItems: "center" }}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 40,
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
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#222",
    marginVertical: 24,
    textAlign: "center",
  },
  passwordCard: {
    borderWidth: 2,
    borderColor: "#222",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: 220,
    backgroundColor: "#fff",
    alignItems: "flex-start",
  },
  passwordService: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  passwordMasked: {
    fontSize: 16,
    marginBottom: 8,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    gap: 8,
  },
  emoji: {
    fontSize: 18,
    marginHorizontal: 2,
  },
  button: {
    backgroundColor: "#2196f3",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
