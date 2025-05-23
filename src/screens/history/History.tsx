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
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Se não houver senhas, apenas inicializa com array vazio
        setPasswords([]);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao obter itens',
          text2: 'Não foi possível carregar sua lista de senhas'
        });
      }
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
    <View style={styles.container}>
      {passwords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não tem senhas salvas</Text>
          <Text style={styles.emptySubText}>Gere uma senha na tela inicial para começar</Text>
        </View>
      ) : (
        <FlatList
          data={passwords}
          renderItem={renderPassword}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  passwordCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  passwordService: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  passwordMasked: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  emoji: {
    fontSize: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
