## About The Project

This enables a request to a bulk endpoint to update multiple individual queries without requiring multiple individual calls to be made for the individual items. Let's say that you're calling a list endpoint and each individual list item has its own query as well. This will allow the bulk query to notify the related individual queries that it's already making a bulk request for the data from that individual call.

### Built With

-   TypeScript
-   React
-   React-Query
-   Jest
-   Husky

## Instructions

Additional documentation to come

<!--
### Using the bulk query

`useBulkQuery` is the bulk query that controls how it should interact with the individual queries

#### Parameters

* `queryKey: String` — Set this to the query key that you want to use for the bulk query
* `queryFn: Function` — Set this to the fetch function for your query
* `inidividualQueryOptions: {queryKey}`
-->
