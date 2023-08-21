"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBulkQuery = exports.useBulkIndividualQuery = void 0;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var defaultQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
};
var useBulkIndividualQuery = function (queryKey, queryFn, bulkQueryOptions, customOptions) {
    var bulkQueryKey = bulkQueryOptions.queryKey;
    var queryClient = (0, react_query_1.useQueryClient)();
    var bulkQueryState = queryClient.getQueryState(bulkQueryKey);
    var enabledByBulkState = (bulkQueryState === null || bulkQueryState === void 0 ? void 0 : bulkQueryState.status) !== 'loading' ||
        !!(bulkQueryState === null || bulkQueryState === void 0 ? void 0 : bulkQueryState.dataUpdateCount) ||
        !!(bulkQueryState === null || bulkQueryState === void 0 ? void 0 : bulkQueryState.errorUpdateCount);
    var queryResult = (0, react_query_1.useQuery)(queryKey, queryFn, __assign(__assign({ enabled: enabledByBulkState && (customOptions === null || customOptions === void 0 ? void 0 : customOptions.enabled) }, defaultQueryOptions), customOptions));
    return queryResult;
};
exports.useBulkIndividualQuery = useBulkIndividualQuery;
var useBulkQuery = function (queryKey, queryFn, inidividualQueryOptions, customOptions) {
    var _a = (customOptions !== null && customOptions !== void 0 ? customOptions : {}).enabled, enabled = _a === void 0 ? true : _a;
    var individualQueryKeys = inidividualQueryOptions.queryKeys, individualQueryDataAccessorFn = inidividualQueryOptions.accessorFn;
    var queryResult = (0, react_query_1.useQuery)(queryKey, queryFn, __assign(__assign({}, defaultQueryOptions), customOptions));
    var queryClient = (0, react_query_1.useQueryClient)();
    (0, react_1.useEffect)(function () {
        if (enabled) {
            if (queryResult.data) {
                individualQueryKeys.forEach(function (individualQueryKey) {
                    var individualValue = individualQueryDataAccessorFn(queryResult.data, individualQueryKey);
                    queryClient.setQueryData(individualQueryKey, individualValue);
                });
            }
            else {
                individualQueryKeys.forEach(function (individualQueryKey) {
                    var individualQueryValue = queryClient.getQueryData(individualQueryKey);
                    if (!individualQueryValue) {
                        queryClient.setQueryData(individualQueryKey, undefined);
                    }
                });
            }
            return function () {
                individualQueryKeys.forEach(function (individualQueryKey) {
                    var individualQueryValue = queryClient.getQueryData(individualQueryKey);
                    if (!individualQueryValue) {
                        queryClient.resetQueries(individualQueryKey, undefined);
                    }
                });
            };
        }
        return function () { };
    }, [enabled, queryResult.data]);
    return queryResult;
};
exports.useBulkQuery = useBulkQuery;
//# sourceMappingURL=queries.js.map