import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    opacity: 1,
    left: 120,
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    zIndex: 1,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
});
