const fetch = require('isomorphic-fetch');
const { SearchResponse } = require('./models');

async function searchHandler(inputParams) {
    // extract parameters from input
    const { search_query, filter_query } = inputParams;
    // perform the search operation
    const response = await fetch()
    // map response data to SearchResponse model
    const responseData = await response.json();
    return SearchResponse.fromDict(responseData);
}

module.exports = searchHandler