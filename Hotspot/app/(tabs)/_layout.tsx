import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import React from 'react';

const TabsLayout = () => {
  return (
    <Tabs
      // Set the initial route name to "dining"
      initialRouteName="dining"
    >
      <Tabs.Screen
        name="dining"
        options={{
          title: 'Dining',
          tabBarShowLabel: true,
          tabBarLabelPosition: 'below-icon',
          headerShown: false,
          tabBarActiveTintColor: '#001F54', 
          tabBarInactiveTintColor: '#888', 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cutlery" size={size} color={color} /> // Use FontAwesome icon
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarShowLabel: true,
          tabBarLabelPosition: 'below-icon',
          headerShown: false,
          tabBarActiveTintColor: '#001F54', 
          tabBarInactiveTintColor: '#888', 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="comments" size={size} color={color} /> // Use FontAwesome icon
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Summary',
          tabBarShowLabel: true,
          tabBarLabelPosition: 'below-icon',
          headerShown: false,
          tabBarActiveTintColor: '#001F54', 
          tabBarInactiveTintColor: '#888', 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-alt" size={size} color={color} /> // Use FontAwesome icon
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarShowLabel: true,
          tabBarLabelPosition: 'below-icon',
          headerShown: false,
          tabBarActiveTintColor: '#001F54', 
          tabBarInactiveTintColor: '#888', 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" size={size} color={color} /> // Use FontAwesome icon
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;