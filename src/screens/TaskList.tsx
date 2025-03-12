import React from 'react';
import { View, useColorScheme } from 'react-native';
import TaskList from '../components/TaskList';

const TarefasScreen = () => {
  const theme = useColorScheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#222' : '#005187'}}>
      <TaskList />
    </View>
  );
};

export default TarefasScreen;