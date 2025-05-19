import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "../screens/home/Home";
import History from "../screens/history/History";
import Login from "../screens/login/Login";
import SignUp from "../screens/login/SignUp";
import { useAuth } from "../hooks/useAuth";  

const Stack = createNativeStackNavigator();

export default function Layout() {
  const { authState } = useAuth(); 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          {authState?.authenticated ? (
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerTitle: "Gerador de Senhas" }}
              />
              <Stack.Screen
                name="History"
                component={History}
                options={{ headerTitle: "Histórico de senhas" }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerTitle: "Login" }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerTitle: "Nova conta" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
} 