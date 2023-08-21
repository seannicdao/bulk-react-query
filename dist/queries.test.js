"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@testing-library/react");
var queries_1 = require("./queries");
var react_query_1 = require("@tanstack/react-query");
var queryClient = new react_query_1.QueryClient();
var ReactQueryWrapper = function (_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: children }));
};
var resolvedData = {
    one: 1,
    two: 2,
    three: 3,
};
var bulkQueryFn = jest.fn(function () {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(resolvedData);
        }, 1000);
    });
});
var individualQueryFn = jest.fn(function (key) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(resolvedData[key]);
        }, 100);
    });
});
var bulkQueryKey = ['bulk', 'all'];
var individualQueryKey = function (key) { return ['bulk', key]; };
var useBoth = function () {
    var bulkData = (0, queries_1.useBulkQuery)(['bulk', 'all'], bulkQueryFn, {
        queryKeys: Object.keys(resolvedData).map(individualQueryKey),
        accessorFn: function (data, queryKey) { return data[queryKey[1]]; },
    }).data;
    var individualData = (0, queries_1.useBulkIndividualQuery)(individualQueryKey('one'), function () { return individualQueryFn('one'); }, {
        queryKey: bulkQueryKey,
    }).data;
    return { bulkData: bulkData, individualData: individualData };
};
describe('useBulk', function () {
    it('should return the bulk value', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = (0, react_1.renderHook)(function () { return useBoth(); }, {
                        wrapper: ReactQueryWrapper,
                    }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            var _a;
                            expect((_a = result.current.bulkData) === null || _a === void 0 ? void 0 : _a.one).toEqual(1);
                            expect(result.current.individualData).toEqual(1);
                            expect(bulkQueryFn).toHaveBeenCalledTimes(1);
                            expect(individualQueryFn).not.toHaveBeenCalled();
                        }, {
                            timeout: 5000,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=queries.test.js.map