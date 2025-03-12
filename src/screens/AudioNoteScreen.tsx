import React from 'react';
import { View, useColorScheme } from 'react-native';
import AudioNote from '../components/AudioNote';

const AudioNoteScreen = () => {
  const theme = useColorScheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#222' : '#005187'}}>
      <AudioNote />
    </View>
  );
};

export default AudioNoteScreen;