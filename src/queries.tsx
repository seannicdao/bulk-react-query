import { useEffect } from 'react';
import {
    QueryFunction,
    QueryKey,
    QueryOptions,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

const defaultQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
};

export const useBulkIndividualQuery = (
    queryKey: QueryKey,
    queryFn: QueryFunction,
    bulkQueryOptions: {
        queryKey: QueryKey;
    },
    customOptions?: QueryOptions,
) => {
    const { queryKey: bulkQueryKey } = bulkQueryOptions;
    const queryClient = useQueryClient();
    const bulkQueryState = queryClient.getQueryState(bulkQueryKey);
    const enabledByBulkState =
        bulkQueryState?.status !== 'loading' ||
        !!bulkQueryState?.dataUpdateCount ||
        !!bulkQueryState?.errorUpdateCount;

    const queryResult = useQuery(queryKey, queryFn, {
        enabled: enabledByBulkState && (customOptions as any)?.enabled,
        ...defaultQueryOptions,
        ...customOptions,
    });

    return queryResult;
};

export const useBulkQuery = (
    queryKey: QueryKey,
    queryFn: QueryFunction,
    inidividualQueryOptions: {
        queryKeys: QueryKey[];
        accessorFn: (data: any, queryKey: QueryKey) => any;
    },
    customOptions?: QueryOptions,
) => {
    const { enabled = true } = (customOptions ?? {}) as any;
    const { queryKeys: individualQueryKeys, accessorFn: individualQueryDataAccessorFn } =
        inidividualQueryOptions;
    const queryResult = useQuery(queryKey, queryFn, { ...defaultQueryOptions, ...customOptions });

    const queryClient = useQueryClient();
    useEffect(() => {
        if (enabled) {
            if (queryResult.data) {
                individualQueryKeys.forEach((individualQueryKey) => {
                    const individualValue = individualQueryDataAccessorFn(
                        queryResult.data,
                        individualQueryKey,
                    );
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
