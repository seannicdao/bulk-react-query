"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBulkQuery = void 0;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var useBulkQuery = function (queryKey, queryFn, inidividualQueryOptions, customOptions) {
    var _a = (customOptions !== null && customOptions !== void 0 ? customOptions : {}).enabled, enabled = _a === void 0 ? true : _a;
    var individualQueryKeys = inidividualQueryOptions.queryKeys, individualQueryDataAccessorFn = inidividualQueryOptions.accessorFn;
    var queryResult = (0, react_query_1.useQuery)(queryKey, queryFn, customOptions);
    var queryClient = (0, react_query_1.useQueryClient)();
    (0, react_1.useEffect)(function () {
        if (enabled) {
            if (queryResult.data) {
                individualQueryKeys.forEach(function (individualQueryKey) {
                    var individualValue = individualQueryDataAccessorFn(queryResult.data);
                    queryClient.setQueryData(individualQueryKey, individualValue);
                });
            }
            else {
                individualQueryKeys.forEach(function (individualQueryKey) {
                    queryClient.setQueryData(individualQueryKey, undefined);
                });
            }
        }
    }, [enabled, queryResult.data]);
    return queryResult;
};
exports.useBulkQuery = useBulkQuery;
//# sourceMappingURL=index.js.map