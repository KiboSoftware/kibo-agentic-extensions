# Kibo Agentic Commerce Extensions 

This repository demonstrates a pattern for extending Kibo's Agentic Commerce capabilities by defining custom tools with structured input/output that an AI Agent can leverage.

This tool can be registered as a "Custom Function" tool type in the Kibo Agentic Admin. Additional documentation for Kibo Agentic Admin tools can be reviewed [here](https://kibo-ucp.github.io/Kibo.AgenticAdmin/userdocs/quickstart/#adding-tools)

## Getting Started

Kibo Agentic Commerce extensions leverages Kibo's API Extension framework. Familiarize yourself with the API Extension framework and follow the [startup guide](https://docs.kibocommerce.com/help/getting-started-with-api-extensions) before proceeding

## Overview

The core pattern revolves around defining tool logic, input and output schemas in javascript that can be called by with:
- **Structured input validation** using Zod schemas
- **Predictable output formats** with well-defined response schemas  
- **Clear descriptions** that help LLMs understand when and how to use the tool

## Key Components

The tool file defines four essential components:

Description, Input Schema, Output Schema and the javascript to execute.
In its simplest form, a tool could be defined in a single file such as:

```javascript
// src/domains/tools/customSearchTool.js

const z = require('zod').z;

// tool description
module.exports.description = "Get product name";

// tool input schema
module.exports.inputSchema = z.object({
    productCode: z.string().describe("The id of the product"),
});

// tool output schema
module.exports.outputSchema = z.object({
    name: z.string().describe("Product name")
})

// tool logic executed by AI Agent
module.exports = function(context, callback) {
    const toolInputParams = context.get.toolInput();
    const { productCode } = toolInputParams
    const result = { name: "Product Name"}
    callback(null, result)
}
```

### Code Organization
Best practice would be to seperate your tools into multiple files.

### 1. Schema Definitions (`schema.js`)

Define your input and output schemas using Zod for robust validation:

```javascript
const inputSchema = z.object({
    search_query: z.string()
        .describe("Search Query to lookup products"),
    filter_query: z.string()
        .optional()
        .describe("Filter Query to refine search results"),
});

const outputSchema = z.object({
    products: z.array(productSchema)
        .describe("List of products matching the search query"),
    facets: z.array(facetItemSchema)
        .describe("List of facets available for filtering search results")
});
module.exports = { inputSchema, outputSchema }
```

**Key principles:**
- Use descriptive field names
- Add `.describe()` to explain each field's purpose
- Mark optional fields with `.optional()`
- Validate data types and constraints (URLs, min/max lengths, etc.)

### 2. Business Logic Handler (`handler.js`)

Separate your core business logic into dedicated handler functions:

```javascript
async function handler(inputParams) {
    const { search_query, filter_query } = inputParams;
    // Perform the actual work
    const response = await fetch(/* your API call */);
    const responseData = await response.json();
    return SearchResponse.fromDict(responseData);
}
module.exports = { handler }
```

### 4. Tool Execution Pattern

The final tool function to put it all together following this pattern:

```javascript
const { inputSchema, outputSchema } = require('./schema')
const { handler } = require('./handler')

module.exports = function (context, callback) {
    var toolInputParams = context.get.toolInput();
    
    handler(toolInputParams)
        .then((result) => {
            callback(null, result);
        })
        .catch((error) => {
            console.error("error in tool execution:", error);
            callback({
                error: error.message || "An error occurred during tool execution"
            });
        });
}
```

### 5. Bundling your tools

For any tools to be bundled and exported to Kibo's environment, they need to be registered in your `assets/src/agentic.tools.manifest.js` with a toolname example: `customSearchTool` and the relative location of the custom function js file.

example: 
```js
module.exports = {
  'customSearchTool': {
      actionName: 'embedded.agentic.tools',
      customFunction: require('./domains/tools/customSearchTool')
  }
}
```


## Deployment

1. Follow the steps provided in the [Kibo API Extension](https://docs.kibocommerce.com/help/getting-started-with-api-extensions) docs to upload your Agentic tools to Kibo's environment

### Agent Configuration
*Note: This step will be automated in the future*

For your Kibo Agent to be aware of your tool, you will need to manually [configure](https://kibo-ucp.github.io/Kibo.AgenticAdmin/userdocs/quickstart/#adding-tools) the tool in the Kibo Agentic Admin. 
You will need the tool's name, description, input schema and output schema. 

Run the following command which will build a local export with all of your tools
 
```bash
npx grunt toolschema
```


## Best Practices

### Schema Design
1. **Be Descriptive**: Use clear field names and detailed descriptions
2. **Validate Thoroughly**: Define appropriate constraints (string lengths, URL formats, etc.)
3. **Document Intent**: Explain what each field is for and how it should be used
4. **Handle Optionals**: Clearly mark which fields are required vs optional

### Error Handling
- Always wrap async operations in try/catch or use `.catch()`
- Provide meaningful error messages
- Log errors for debugging while returning user-friendly messages

### Separation of Concerns
- Keep tool definition separate from business logic
- Use dedicated handler functions for the actual work
- Define schemas in separate files for reusability

## Example Use Case

This pattern is ideal for:
- **Data Retrieval**: Fetching information from external services
- **Data Processing**: Transforming or analyzing data with structured inputs/outputs
- **Integration Services**: Connecting LLMs to existing business systems

The structured approach ensures LLMs can reliably call your tools with correct parameters and understand the responses they receive.
