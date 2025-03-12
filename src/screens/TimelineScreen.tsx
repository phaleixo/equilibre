import React from 'react';
import { View, useColorScheme } from 'react-native';
import Timeline from '../components/Timeline';

const TarefasScreen = () => {
  const theme = useColorScheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#222' : '#005187'}}>
      <Timeline />
    </View>
  );
};

export default TarefasScreen;