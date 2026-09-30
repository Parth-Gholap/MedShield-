import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../src/i18n';

/**
 * Tab layout — three tabs: Scan (home), History, About.
 * Tab titles dynamically reflect English or Hindi selection.
 */
export default function TabLayout() {
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        // Dark navy header
        headerStyle: { backgroundColor: '#1A1A2E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
        // Dark tab bar
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopColor: '#2A2A4A',
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#4CC9F0',
        tabBarInactiveTintColor: '#8888AA',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.scan,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t.tabs.history,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: t.tabs.about,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
