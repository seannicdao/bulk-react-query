import { renderHook, waitFor } from '@testing-library/react';

import { useBulkQuery, useBulkIndividualQuery } from './queries';
import { QueryClient, QueryClientProvider, QueryKey } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});
const ReactQueryWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const resolvedData = {
    one: 1,
    two: 2,
    three: 3,
};
type ResolvedData = typeof resolvedData;

const bulkQueryFn = jest.fn(
    () =>
        new Promise<ResolvedData>((resolve) => {
            setTimeout(() => {
                resolve(resolvedData);
            }, 1000);
        }),
);

const individualQueryFn = jest.fn(
    (key: keyof ResolvedData) =>
        new Promise<number>((resolve) => {
            setTimeout(() => {
                resolve(resolvedData[key]);
            }, 100);
        }),
);

const bulkQueryKey = ['bulk', 'all'];
const individualQueryKey = (key: keyof ResolvedData) => ['bulk', key];

const useBoth = () => {
    const { data: bulkData } = useBulkQuery(['bulk', 'all'], bulkQueryFn, {
        queryKeys: (Object.keys(resolvedData) as (keyof ResolvedData)[]).map(individualQueryKey),
        accessorFn: (data, queryKey: QueryKey) => data[queryKey[1] as keyof ResolvedData],
    });
    const { data: individualData } = useBulkIndividualQuery(
        individualQueryKey('one'),
        () => individualQueryFn('one'),
        {
            queryKey: bulkQueryKey,
        },
    );

    return { bulkData, individualData };
};

describe('useBulk', () => {
    it('should return the bulk value', async () => {
        const { result } = renderHook(() => useBoth(), {
            wrapper: ReactQueryWrapper,
        });

        await waitFor(
            () => {
                expect((result.current.bulkData as any)?.one).toEqual(1);
                expect(result.current.individualData).toEqual(1);
                expect(bulkQueryFn).toHaveBeenCalledTimes(1);
                expect(individualQueryFn).not.toHaveBeenCalled();
            },
            {
                timeout: 5000,
            },
        );
    });
});
