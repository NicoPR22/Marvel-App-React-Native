import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
import Comic from './Comic';
import apiParams from '../../config';
import axios from 'axios';


export default function Comics({ listComics }) {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { ts, apikey, hash } = apiParams;

  useEffect(() => {
    const promisesArray = listComics.map(c => (
      axios.get(c.resourceURI, {
        params: {
          ts,
          apikey,
          hash
        }      
      })
    ));
    
    Promise.all(promisesArray)
      .then(responses => setData(responses.map(r => (
        r?.data?.data?.results[0]
      ))))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));

  }, []);

  return (
    <View>
      {
        isLoading 
          ? <ActivityIndicator size="large" color="#00ff00" /> 
          :(<FlatList
            data={data}
            keyExtractor={({ id }) => id.toString()}
            horizontal
            renderItem={({ item }) => (
              <Comic 
              key={item.id}
              name={item.title} 
              image={`${item?.thumbnail?.path}.${item.thumbnail.extension}`} />
            )}
          />) 
      }
    </View>
  )
}