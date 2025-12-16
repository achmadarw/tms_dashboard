import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api-client';

interface UseApiOptions {
    immediate?: boolean;
}

interface UseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useApi<T>(
    endpoint: string,
    options: UseApiOptions = { immediate: true }
): UseApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiClient.get<T>(endpoint);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        if (options.immediate) {
            fetchData();
        }
    }, [fetchData, options.immediate]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

export function useApiMutation<TData, TVariables = unknown>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(
        async (
            endpoint: string,
            method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
            data?: TVariables
        ): Promise<TData | null> => {
            setLoading(true);
            setError(null);

            try {
                let result: TData;

                switch (method) {
                    case 'POST':
                        result = await apiClient.post<TData>(endpoint, data);
                        break;
                    case 'PUT':
                        result = await apiClient.put<TData>(endpoint, data);
                        break;
                    case 'PATCH':
                        result = await apiClient.patch<TData>(endpoint, data);
                        break;
                    case 'DELETE':
                        result = await apiClient.delete<TData>(endpoint);
                        break;
                }

                return result;
            } catch (err) {
                const error =
                    err instanceof Error ? err : new Error('Unknown error');
                setError(error);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        mutate,
        loading,
        error,
    };
}
