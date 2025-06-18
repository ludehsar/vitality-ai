import { HomeScreen } from '../features/home/screen/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>({
  screens: {
    Home: HomeScreen,
  },
});

export const RootNavigation = createStaticNavigation(RootStack);
