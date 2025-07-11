const zod = require('zod');
const z = zod.z
const searchInputSchema = z.object({
    search_query: z.string()
        .describe("Search Query to lookup products"),
    filter_query: z.string()
        .optional()
        .describe("Filter Query to refine search results"),
})

const productSchema = z.object({
    title: z.string().describe("Product title"),
    description: z.string().describe("Product description"),
    price: z.number().describe("Product price"),
    url: z.string().url().min(1).max(2083).describe("Product URL"),
    thumb_image: z.string().url().min(1).max(2083).describe("Product thumbnail image URL"),
    department: z.string().describe("Product department")
})
const facetItemSchema = z.object({
    name: z.string()
        .describe("Name of the facet"),
    values: z.array(z.string()).describe("List of values for the facet")
})
const searchResultSchema = z.object({
    products: z.array(productSchema)
        .describe("List of products matching the search query"),
    facets: z.array(facetItemSchema)
        .describe("List of facets available for filtering search results")
});
module.exports = {
    searchInputSchema,
    productSchema,
    facetItemSchema,
    searchResultSchema
};