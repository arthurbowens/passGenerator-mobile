import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid } from "react-native";
import { getPasswords, clearPasswords } from "../../services/password/passwordService";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";

export default function History() {
  const [passwords, setPasswords] = useState<any[]>([]);
  const [showPasswordIndex, setShowPasswordIndex] = useState<number | null>(null);
  const navigation = useNavigation();

  const carregarSenhas = async () => {
    try {
      const data = await getPasswords();
      setPasswords(data || []);
    } catch (error) {
      ToastAndroid.show("Erro ao obter itens", ToastAndroid.SHORT);
    }
  };

  const limparHistorico = () => {
    Alert.alert("Confirmação", "Deseja apagar todo o histórico de senhas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        onPress: async () => {
          await clearPasswords();
          setPasswords([]);
        },
      },
    ]);
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

  const handleDelete = async (index: number) => {
    try {
      const newList = passwords.filter((_, i) => i !== index);
      setPasswords(newList);
      // Atualiza storage
      await clearPasswords();
      for (const item of newList) {
        await getPasswords().then(async (list) => {
          if (!list.some((l: any) => l.service === item.service)) {
            await getPasswords().then(async () => {
              // re-salva cada item
              await import("../../services/password/passwordService").then(mod => mod.savePassword(item));
            });
          }
        });
      }
    } catch (error) {
      ToastAndroid.show("Erro ao remover item", ToastAndroid.SHORT);
    }
  };

  const renderPassword = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.passwordCard}>
      <Text style={styles.passwordService}>{item.service}</Text>
      <Text style={styles.passwordMasked}>
        {showPasswordIndex === index ? item.password : "********"}
      </Text>
      <View style={styles.emojiRow}>
        <TouchableOpacity onPress={() => setShowPasswordIndex(showPasswordIndex === index ? null : index)}>
          <Text style={styles.emoji}>{showPasswordIndex === index ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCopy(item.password)}>
          <Text style={styles.emoji}>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(index)}>
          <Text style={styles.emoji}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Históricos de senhas</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Card central */}
      <View style={styles.card}>
        <Text style={styles.title}>HISTÓRICO DE SENHAS</Text>
        {passwords.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma senha foi gerada</Text>
        ) : (
          <FlatList
            data={passwords}
            keyExtractor={(_, index) => index.toString()}
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
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "space-between",
  },
  backArrow: {
    fontSize: 24,
    color: "#222",
    fontWeight: "bold",
    width: 24,
    textAlign: "left",
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    textAlign: "center",
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0074d9",
    marginBottom: 16,
    textAlign: "center",
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
