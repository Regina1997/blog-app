import { useEffect, useState } from "react"
import axios from '../axios';

export const useFetch = (url) => {
  const [data, setData] = useState([]); // Set initial data as null or an empty object if you prefer.
  const [loading, setLoading] = useState(true); // Start with loading as true
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

    return {
        loading,
        data, 
        error,
    }
}
