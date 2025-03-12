import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

interface TimelineEntry {
  id: number;
  type: 'audio' | 'emotion' | 'task';
  dateTime: string;
  data: any;
}

const Timeline: React.FC = () => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const isDarkMode = useColorScheme() === 'dark';
  const styles = dynamicStyles(isDarkMode);

  useEffect(() => {
    loadEntries();

    const interval = setInterval(() => {
      loadEntries();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadEntries = async () => {
    const audioNotes = await AsyncStorage.getItem('audioNotes');
    const emotionDiary = await AsyncStorage.getItem('diario');
    const tasks = await AsyncStorage.getItem('tasks');

    const audioEntries: TimelineEntry[] = audioNotes
      ? JSON.parse(audioNotes).map((note: any) => ({
          id: note.id,
          type: 'audio',
          dateTime: `${note.date} ${note.time}`,
          data: note,
        }))
      : [];

    const emotionEntries: TimelineEntry[] = emotionDiary
      ? JSON.parse(emotionDiary).map((entry: any) => ({
          id: entry.id,
          type: 'emotion',
          dateTime: `${entry.date} ${entry.time}`,
          data: entry,
        }))
      : [];

    const taskEntries: TimelineEntry[] = tasks
      ? JSON.parse(tasks)
          .filter((task: any) => task.completed) // Filtra apenas tarefas concluídas
          .map((task: any) => ({
            id: task.id,
            type: 'task',
            dateTime: task.createdAt,
            data: task,
          }))
      : [];

    // Combinar todas as entradas em uma única lista
    const allEntries = [...audioEntries, ...emotionEntries, ...taskEntries];

    // Ordenar todas as entradas por data e hora
    allEntries.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    // Atualizar o estado apenas se houver mudanças
    if (JSON.stringify(allEntries) !== JSON.stringify(entries)) {
      setEntries(allEntries);
    }
  };

  const renderItem = ({ item }: { item: TimelineEntry }) => {
    let content;
    let backgroundColor;

    switch (item.type) {
      case 'audio':
        backgroundColor = isDarkMode ? '#97bca2' : '#d3fade';
        content = (
          <View style={[styles.entryContainer, { backgroundColor }]}>
            <Icon name="microphone" size={20} color={isDarkMode ? '#FFFFFF' : '#000000'} />
            <Text style={styles.entryText}>Gravação de áudio em {item.dateTime}</Text>
          </View>
        );
        break;
      case 'emotion':
        backgroundColor = isDarkMode ? '#ffd9d3' : '#ffd9d3';
        content = (
          <View style={[styles.entryContainer, { backgroundColor }]}>
            <Text style={styles.entryEmoji}>{item.data.emotion}</Text>
            <Text style={styles.entryText}>Emoção registrada em {item.dateTime}</Text>
            {item.data.note && <Text style={styles.entryNote}>{item.data.note}</Text>}
          </View>
        );
        break;
      case 'task':
        backgroundColor = isDarkMode ? '#fdf9c1' : '#fdf9c1';
        content = (
          <View style={[styles.entryContainer, { backgroundColor }]}>
            <Icon name="check-circle" size={20} color={isDarkMode ? '#FFFFFF' : '#000000'} />
            <Text style={styles.entryText}>Tarefa: {item.data.text}</Text>
            <Text style={styles.entryDate}>Adicionada em {item.dateTime}</Text>
            {item.data.completed && (
              <Text style={styles.entryDate}>Concluída em {item.data.completedAt}</Text>
            )}
          </View>
        );
        break;
      default:
        content = null;
    }

    return (
      <View style={styles.timelineItem}>
        <View style={styles.timelineLine} />
        {content}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>Linha do Tempo</Text>
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const dynamicStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 6,
    },
    bodyContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? '#2b2b2b' : '#F5F5F5',
      borderRadius: 15,
      padding: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      marginTop: 10,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      textAlign: 'center',
    },
    listContainer: {
      paddingBottom: 20,
    },
    timelineItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    timelineLine: {
      width: 2,
      height: '100%',
      backgroundColor: isDarkMode ? '#444' : '#CCC',
      marginRight: 10,
    },
    entryContainer: {
      flex: 1,
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    entryText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    entryEmoji: {
      fontSize: 24,
      marginBottom: 5,
    },
    entryNote: {
      fontSize: 14,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      marginTop: 5,
    },
    entryDate: {
      fontSize: 12,
      color: isDarkMode ? '#999' : '#666',
      marginTop: 5,
    },
  });

export default Timeline;