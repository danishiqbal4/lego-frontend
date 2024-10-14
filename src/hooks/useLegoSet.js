import { useState } from 'react';
import axios from 'axios';

const useLegoSet = (setId) => {
    const [legoParts, setLegoParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        next: null,
        previous: null,
    });

    // Fetch the LEGO set parts from the Laravel API
    const fetchLegoSet = async () => {
        if (!setId) return;

        setLegoParts([]);
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/lego/set/${setId}`);
            setLegoParts(response.data.results);
            setLoading(false);
            setPagination({
                next: response.data.next,
                previous: response.data.previous,
            });
        } catch (err) {
            setError("Failed to fetch LEGO set");
            setLoading(false);
            setPagination({
                next: null,
                previous: null,
            });
        }
    };

    const fetchLegoSetByUrl = async (url) => {
        if (!url) return;

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(url);
            setLegoParts(prevData => [...prevData, ...response.data.results]);
            setLoading(false);
            setPagination({
                next: response.data.next,
                previous: response.data.previous,
            });
        } catch (err) {
            setError("Failed to fetch LEGO set");
            setLoading(false);
            setPagination({
                next: null,
                previous: null,
            });
        }
    };

    // Re-fetch when setId changes
    /* useEffect(() => {
        if (setId) {
            fetchLegoSet();
        }
    }, [setId]); */

    return {
        legoParts,
        loading,
        error,
        fetchLegoSet,
        fetchLegoSetByUrl,
        pagination,
    };
};

export default useLegoSet;
