import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { getPasswords, clearPasswords } from "../../services/password/passwordService";
import Button from "../../components/Button"; 
import { LinearGradient } from "expo-linear-gradient";

export default function History() {
  const [password, setPassword] = useState<string[]>([]);

  const carregarSenhas = async () => {
    const data = await getPasswords();
    setPassword(data);
  };

  const limparHistorico = () => {
    Alert.alert("Confirmação", "Deseja apagar todo o histórico de senhas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        onPress: async () => {
          await clearPasswords();
          setPassword([]);
        },
      },
    ]);
  };

  useEffect(() => {
    carregarSenhas();
  }, []);

  return (
    <LinearGradient
      colors={["#fb2d5d", "#FFAFBD", "white", "white", "#FFAFBD", "#fb2d5d"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
        <Text style={styles.title}>HISTÓRICO DE SENHAS</Text>

        <FlatList
          data={password}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
          contentContainerStyle={{ alignItems: "center" }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma senha armazenada.</Text>
          }
        />

      <View style={{ width: '60%', paddingTop: 40}} >
      <Button title="LIMPAR" onPress={limparHistorico} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
    color: "##000C40",
  },
  passwordText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    backgroundColor: "#4b4a4b",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    textAlign: "center",
  },
  itemText: {
    fontSize: 18,
    color: "#333",
    marginVertical: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#9a9b9b",
    marginTop: 20,
  },
});
