const { searchInputSchema, searchResultSchema } = require('../../lib/search/schema');
const handler = require('../../lib/search/handler');

const inputSchema = searchInputSchema;
const outputSchema = searchResultSchema;
const description = "Search for products using the Bloomreach search service"; 

module.exports.description = description;
module.exports.inputSchema = inputSchema
module.exports.outputSchema = outputSchema

module.exports = function (context, callback) {
    // this should be an object in the shape of the input schema
    var toolInputParams = context.get.toolInput()
    handler(toolInputParams)
        .then((result) => {
            // result should be an object in the shape of the output schema
            callback(null, result);
        })
        .catch((error) => {
            console.error("error in tool execution:", error);
            callback({
                error: error.message || "An error occurred during tool execution"
            });
    });
}

