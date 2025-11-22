import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import StoreRegistrationScreen from '../screens/StoreRegistrationScreen';
import MainDashboardScreen from '../screens/MainDashboardScreen';
import ProductListScreen from '../screens/ProductListScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  StoreRegistration: undefined;
  MainDashboard: undefined;
  ProductList: undefined;
  AddEditProduct: { product?: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Splash">
          {({ navigation }) => (
            <SplashScreen
              onFinish={() => navigation.replace('Login')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Login">
          {({ navigation }) => (
            <LoginScreen
              onLogin={() => navigation.navigate('StoreRegistration')}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StoreRegistration">
          {({ navigation }) => (
            <StoreRegistrationScreen
              onComplete={() => navigation.replace('MainDashboard')}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MainDashboard">
          {({ navigation }) => (
            <MainDashboardScreen
              onNavigateToProducts={() => navigation.navigate('ProductList')}
              onNavigateToOrders={() => {
                // TODO: Navigate to orders screen when implemented
                console.log('Navigate to Orders');
              }}
              onNavigateToAnalytics={() => {
                // TODO: Navigate to analytics screen when implemented
                console.log('Navigate to Analytics');
              }}
              onNavigateToProfile={() => {
                // TODO: Navigate to profile screen when implemented
                console.log('Navigate to Profile');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ProductList">
          {({ navigation }) => (
            <ProductListScreen
              onAddProduct={() => navigation.navigate('AddEditProduct', {})}
              onEditProduct={(product) => navigation.navigate('AddEditProduct', { product })}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AddEditProduct">
          {({ navigation, route }) => (
            <AddEditProductScreen
              product={route.params?.product}
              onSave={() => navigation.goBack()}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
