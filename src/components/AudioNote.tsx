import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, useColorScheme, StyleSheet, Modal, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

interface AudioEntry {
  id: number;
  uri: string;
  date: string;
  time: string;
}

const AudioNoteScreen = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioEntries, setAudioEntries] = useState<AudioEntry[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<{ [key: number]: { duration: number, position: number } }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [audioToDeleteId, setAudioToDeleteId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false); // Estado para controlar a mensagem de gravação
  const isDarkMode = useColorScheme() === 'dark';
  const styles = dynamicStyles(isDarkMode);

  // Animação de pulsação
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadAudioEntries();
  }, []);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true); // Ativar mensagem e animação
        startPulseAnimation(); // Iniciar animação
      } else {
        alert('Permissão para acessar o microfone é necessária.');
      }
    } catch (err) {
      console.error('Falha ao iniciar gravação', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        const now = new Date();
        const newEntry: AudioEntry = {
          id: Date.now(),
          uri,
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const updatedEntries = [newEntry, ...audioEntries];
        setAudioEntries(updatedEntries);
        await AsyncStorage.setItem('audioNotes', JSON.stringify(updatedEntries));
      }
      setRecording(null);
      setIsRecording(false); // Desativar mensagem e animação
      stopPulseAnimation(); // Parar animação
    }
  };

  const loadAudioEntries = async () => {
    const data = await AsyncStorage.getItem('audioNotes');
    if (data) {
      setAudioEntries(JSON.parse(data));
    }
  };

  const deleteAudioEntry = async (id: number) => {
    const updatedEntries = audioEntries.filter(entry => entry.id !== id);
    setAudioEntries(updatedEntries);
    await AsyncStorage.setItem('audioNotes', JSON.stringify(updatedEntries));
    setIsModalVisible(false);
  };

  const confirmDelete = (id: number) => {
    setAudioToDeleteId(id);
    setIsModalVisible(true);
  };

  const playPauseAudio = async (id: number, uri: string) => {
    if (playingId === id) {
      if (sound) {
        await sound.pauseAsync();
      }
      setPlayingId(null);
    } else {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setPlayingId(id);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaybackStatus((prevStatus) => ({
            ...prevStatus,
            [id]: {
              duration: status.durationMillis || 0,
              position: status.positionMillis || 0,
            },
          }));
        }
      });
      await newSound.playAsync();
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.length === 1 ? '0' : ''}${seconds}`;
  };

  // Função para iniciar a animação de pulsação
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Função para parar a animação de pulsação
  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1); // Resetar o valor da animação
  };


  return (
    <View style={styles.container}>
        <View style={styles.bodyContainer}>
        <Text style={styles.title}>Gravações de Áudio</Text>
        
        <FlatList
            data={audioEntries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <View style={styles.audioEntryContainer}>
                <Text style={styles.dateText}>{item.date} {item.time}</Text>
                <View style={styles.audioControls}>
                <TouchableOpacity
                    onPress={() => playPauseAudio(item.id, item.uri)}
                    style={styles.controlButton}
                >
                    <View>
                    <Icon
                        name={playingId === item.id ? 'pause' : 'play'}
                        size={22}
                        color={isDarkMode ? '#FFFFFF' : '#000000'}
                    />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => confirmDelete(item.id)}
                    style={styles.controlButton}
                >
                    <View>
                    <Icon name="trash" size={20} color={isDarkMode ? '#FFFFFF' : '#333333'} />
                    </View>
                </TouchableOpacity>
                </View>
                {playbackStatus[item.id] && (
                <Text style={styles.playbackText}>
                    {formatTime(playbackStatus[item.id].position)} / {formatTime(playbackStatus[item.id].duration)}
                </Text>
                )}
            </View>
            )}
        />
        <View style={{ flex: 1 }} />

        {/* Mensagem de gravação */}
        {isRecording && (
            <View style={styles.recordingMessageContainer}>
            <Text style={styles.recordingText}>Gravando...</Text>
            </View>
        )}

        {/* Botão de Gravação Circular com Animação */}
        <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
            style={[
            styles.recordButton,
            { backgroundColor: recording ? '#FF0000' : '#72b288' },
            ]}
        >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Icon
                name="microphone"
                size={26}
                color="white"
            />
            </Animated.View>
        </TouchableOpacity>

        {/* Modal de Confirmação */}
        <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalText}>Tem certeza que deseja excluir este áudio?</Text>
                <View style={styles.modalButtons}>
                <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setIsModalVisible(false)}
                >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={() => audioToDeleteId && deleteAudioEntry(audioToDeleteId)}
                >
                    <Text style={styles.modalButtonText}>Excluir</Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal>
        </View>
    </View>
  );
};

// Função para gerar estilos dinâmicos
const dynamicStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: isDarkMode ? '#222' : '#F5F5F5',
    borderRadius: 15, // Adicionando cantos arredondados
    padding: 3, // Espaçamento interno
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Para dar um pouco de sombra, efeito 3D
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: isDarkMode ? '#FFFFFF' : '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    color: isDarkMode ? '#FFFFFF' : '#333',
    textAlign: 'center',
  },
  audioEntryContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    margin: 5,
  },
  dateText: {
    fontSize: 16,
    color: isDarkMode ? '#FFFFFF' : '#333',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    width: '100%',
  },
  controlButton: {
    padding: 10,
  },
  playbackText: {
    fontSize: 14,
    color: isDarkMode ? '#CCCCCC' : '#666666',
    marginTop: 5,
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recordingMessageContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  recordingText: {
    color: isDarkMode ? '#FFFFFF' : '#000000',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: isDarkMode ? '#FFFFFF' : '#000000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: isDarkMode ? '#333' : '#ccc',
  },
  modalButtonConfirm: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AudioNoteScreen;