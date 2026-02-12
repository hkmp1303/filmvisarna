import { useState, useEffect } from 'react';
import fetchJson from './fetchJson';

export default function useFetchJson<Type>(url: string) {
  const [fetchedData, setFetchedData] = useState<Type | null>(null);

  useEffect(() => {
    (async () => {
      // Använd vår fetchJson utility
      const data = await fetchJson(url);
      setFetchedData(data);
    })();
  }, [url]); // Körs när komponenten monteras eller om url ändras

  return fetchedData;
}