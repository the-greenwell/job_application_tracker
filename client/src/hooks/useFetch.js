import { useState, useEffect } from 'react';

const useFetch = (serviceFN, ...payload) => {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await serviceFN(...payload);
                setData(result);
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        };

        fetchData();
// eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return {data, isLoading, error};
};

export default useFetch;