import { View, useColorScheme } from 'react-native';
import Diario from '../components/Diario';


const DiarioScreen = () => {
  const theme = useColorScheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#222' : '#005187'}}>
      <Diario />
    </View>
  );
};

export default DiarioScreen;