import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';
import Information from '../information/Information';
import Comics from '../comic/Comics';
import apiParams from '../../config';
import axios from 'axios';

const Tab = createBottomTabNavigator();

export default function Detail({ route }) {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { ts, apikey, hash, baseURL } = apiParams;
  
    useEffect(() => {
      axios.get(`${baseURL}/v1/public/characters/${route.params.id}`, {
        params: {
          ts,
          apikey,
          hash
        }
      })
        .then(response => setData(response.data.data.results[0]))
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
      }, []);

    return (
      <Tab.Navigator
        initialRouteName="Information"
        screenOptions={{
          "tabBarActiveTintColor": "darkred",
          "tabBarStyle": [
            {
              "display": "flex"
            },
            null
          ]
        }}
      >
        <Tab.Screen 
          name="Information" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="information-circle" color={color} size={size} />
            )
          }}
        >
          {() => 
            (isLoading
              ? <ActivityIndicator size="large" color="#00ff00" /> 
              : <Information 
                  image={`${data?.thumbnail?.path}.${data.thumbnail.extension}`}
                  name={data.name}
                  description={data.description} 
                  id={route.params.id}
                />
            )
          }
        </Tab.Screen>
        <Tab.Screen 
          name="Comics" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book" color={color} size={size} />
            )
          }}
        >
          {props => <Comics {...props} listComics={data.comics.items} />}
        </Tab.Screen>

      </Tab.Navigator>
    );
  }