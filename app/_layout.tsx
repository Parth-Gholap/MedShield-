import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider } from '../src/i18n';

/**
 * Root layout — wraps everything in a Stack navigator and I18nProvider.
 * The (tabs) group is the main screen; "result" sits outside
 * the tabs so it can be pushed on top like a detail page.
 */
export default function RootLayout() {
  return (
    <I18nProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1A1A2E' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#16213E' },
        }}
      >
        {/* The tab navigator is the default screen */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        {/* Result screen pushes on top of tabs */}
        <Stack.Screen
          name="result"
          options={{ title: 'Scan Result', presentation: 'card' }}
        />
      </Stack>
    </I18nProvider>
  );
}
