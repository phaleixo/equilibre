import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated, Modal, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FAB } from 'react-native-paper';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const animation = useRef(new Animated.Value(1)).current;

  const isDarkMode = useColorScheme() === 'dark';
  const styles = dynamicStyles(isDarkMode);

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!taskText) return;

    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTaskText('');
    setModalVisible(false);
  };

  const deleteTask = async (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setConfirmModalVisible(false);
  };

  const confirmDelete = (taskId: number) => {
    setTaskToDelete(taskId);
    setConfirmModalVisible(true);
  };

  const handleDelete = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete);
    }
  };

  const toggleTaskCompletion = async (taskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toLocaleString() : undefined }
        : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Animação ao concluir a tarefa
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (data) {
      setTasks(JSON.parse(data));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>Lista de Tarefas</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Animated.View style={{ transform: [{ scale: animation }] }}>
              <View style={styles.taskContainer}>
                <TouchableOpacity
                  onPress={() => toggleTaskCompletion(item.id)}
                  style={[styles.task, item.completed && styles.completedTask]}
                >
                  <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
                    {item.text}
                  </Text>
                  <Text style={styles.taskDate}>Adicionado em: {item.createdAt}</Text>
                  {item.completedAt && (
                    <Text style={styles.taskDate}>Concluído em: {item.completedAt}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
                  <Icon name="trash" size={20} color={isDarkMode ? '#FFFFFF' : '#333333'} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          color="white"
          onPress={() => setModalVisible(true)}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  placeholder="Adicionar nova tarefa"
                  placeholderTextColor={isDarkMode ? '#999' : '#CCC'}
                  value={taskText}
                  onChangeText={setTaskText}
                  style={styles.input}
                />
                <TouchableOpacity onPress={addTask} style={styles.modalAddButton}>
                  <Text style={styles.modalAddButtonText}>Adicionar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelButton}>
                  <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmModalVisible}
          onRequestClose={() => {
            setConfirmModalVisible(!confirmModalVisible);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.confirmText}>Tem certeza que deseja excluir esta tarefa?</Text>
                <TouchableOpacity onPress={handleDelete} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setConfirmModalVisible(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        </View>
    </View>
  );
};

const dynamicStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
    
  },
bodyContainer: {
  flex: 1,
  backgroundColor: isDarkMode ? '#2b2b2b' : '#F5F5F5',
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
    marginBottom: 10,
    color: isDarkMode ? '#FFFFFF' : '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: isDarkMode ? '#bcb984' : '#fdf9c1',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    margin: 5,
  },
  task: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: isDarkMode ? '#bcb984' : '#fdf9c1',
  },
  completedTask: {
    backgroundColor: isDarkMode ? '#bcb984' : '#fdf9c1',
  },
  taskText: {
    fontSize: 18,
    color: isDarkMode ? '#FFFFFF' : '#000000',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: isDarkMode ? '#4CAF50' : 'green',
  },
  taskDate: {
    fontSize: 12,
    color: isDarkMode ? '#999' : 'gray',
  },
  deleteButton: {
    marginLeft: 20,
    padding: 10,
  },
  fab: {
    position: 'absolute',
    margin: 18,
    right: 0,
    bottom: 0,
    backgroundColor: '#72b288',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    width: '100%',
    backgroundColor: isDarkMode ? '#333' : '#FFFFFF',
    borderColor: isDarkMode ? '#444' : '#CCC',
    color: isDarkMode ? '#FFFFFF' : '#000000',
  },
  modalAddButton: {
    backgroundColor: '#72b288',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalCancelButton: {
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: isDarkMode ? '#FF4444' : 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  confirmText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: isDarkMode ? '#FFFFFF' : '#000000',
  },
  confirmButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: isDarkMode ? '#4CAF50' : 'blue',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TaskList;