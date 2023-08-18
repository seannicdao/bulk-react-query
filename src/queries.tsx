import { useEffect } from 'react';
import {
    QueryFunction,
    QueryKey,
    QueryOptions,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

export const useBulkQuery = (
    queryKey: QueryKey,
    queryFn: QueryFunction,
    inidividualQueryOptions: {
        queryKeys: QueryKey[];
        accessorFn: (data: any) => any;
    },
    customOptions?: QueryOptions,
) => {
    const { enabled = true } = (customOptions ?? {}) as any;
    const { queryKeys: individualQueryKeys, accessorFn: individualQueryDataAccessorFn } =
        inidividualQueryOptions;
    const queryResult = useQuery(queryKey, queryFn, customOptions);

    const queryClient = useQueryClient();
    useEffect(() => {
        if (enabled) {
            if (queryResult.data) {
                individualQueryKeys.forEach((individualQueryKey) => {
                    const individualValue = individualQueryDataAccessorFn(queryResult.data);
                    queryClient.setQueryData(individualQueryKey, individualValue);
                });
            } else {
                individualQueryKeys.forEach((individualQueryKey) => {
                    const individualQueryValue = queryClient.getQueryData(individualQueryKey);
                    if (!individualQueryValue) {
                        queryClient.setQueryData(individualQueryKey, undefined);
                    }
                });
            }

            return () => {
                individualQueryKeys.forEach((individualQueryKey) => {
                    const individualQueryValue = queryClient.getQueryData(individualQueryKey);
                    if (!individualQueryValue) {
                        queryClient.resetQueries(individualQueryKey, undefined);
                    }
                });
            };
        }

        return () => {};
    }, [enabled, queryResult.data]);

    return queryResult;
};
