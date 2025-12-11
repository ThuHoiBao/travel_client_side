// src/hook/useAdminUsers.ts
import { useState, useEffect, useCallback } from 'react';
import { searchUsersApi } from '../services/user/user.ts';

const useAdminUsers = (searchDTO: any, page: number, size: number) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const refetch = useCallback(() => setRefetchTrigger(prev => prev + 1), []);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await searchUsersApi(searchDTO, page, size);
                setUsers(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [searchDTO, page, size, refetchTrigger]);

    return { users, loading, totalPages, totalElements, refetch };
};
export default useAdminUsers;