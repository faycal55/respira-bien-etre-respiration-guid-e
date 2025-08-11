import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { globalActions } from './src/store';

const App: React.FC = () => {
  useEffect(() => {
    // Initialiser l'application
    globalActions.initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar translucent backgroundColor="transparent" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
