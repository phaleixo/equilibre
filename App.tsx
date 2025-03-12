import React from 'react';
import { StatusBar, useColorScheme, View, Text, Image } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DiarioScreen from './src/screens/DiarioScreen';
import AudioNoteScreen from './src/screens/AudioNoteScreen';
import TarefasScreen from './src/screens/TaskList';
import InfoScreen from './src/screens/InfoScreen';
import { styles } from './src/constants/styles';

const Tab = createBottomTabNavigator();

// Componente personalizado para o header
const CustomHeader = () => {
  const theme = useColorScheme(); // Detecta o tema atual

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: theme === 'dark' ? '#222' : '#005187' }, // Altera a cor do header dinamicamente
      ]}
    >
      {/* Imagem no fundo */}
      <Image
        source={require('./src/assets/images/faixa.png')} // Caminho da imagem
        style={styles.backgroundImage}
      />

      {/* Título no topo */}
      <Text style={styles.headerTitle}>Equilibre</Text>
    </View>
  );
};

export default function App() {
  const theme = useColorScheme(); // Detecta o tema do dispositivo

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar backgroundColor={theme === 'dark' ? '#222' : '#005187'} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';

            if (route.name === 'Diário') {
              iconName = 'happy-outline';
            } else if (route.name === 'Áudio') {
              iconName = 'mic-outline';
            } else if (route.name === 'Tarefas') {
              iconName = 'checkmark-outline';
            } else if (route.name === 'Sobre') {
              iconName = 'information-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 5,
            backgroundColor: theme === 'dark' ? '#' : '#005187', // Muda a cor da tab
            borderTopWidth: 0.1,
          },
          tabBarActiveTintColor: theme === 'dark' ? '#80D8FF' : '#80D8FF',
          tabBarInactiveTintColor: theme === 'dark' ? 'white' : 'white',
          
        })}
      >
        <Tab.Screen
          name="Tarefas"
          component={TarefasScreen}
          options={{
            header: () => <CustomHeader />, 
          }}
        />
        <Tab.Screen
          name="Áudio"
          component={AudioNoteScreen}
          options={{
            header: () => <CustomHeader />,
          }}
        />
        <Tab.Screen
          name="Diário"
          component={DiarioScreen}
          options={{
            header: () => <CustomHeader />,
          }}
        />
        <Tab.Screen
          name="Sobre"
          component={InfoScreen}
          options={{
            header: () => <CustomHeader />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

