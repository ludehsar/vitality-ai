import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

export const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  },
});
