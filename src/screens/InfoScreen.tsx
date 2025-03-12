import { View, useColorScheme } from 'react-native';
import Info from '../components/Info';


const InfoScreen = () => {
  const theme = useColorScheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#222' : '#005187'}}>
      <Info />
    </View>
  );
};

export default InfoScreen;