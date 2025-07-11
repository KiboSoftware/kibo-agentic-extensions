class ProductSummary {
    /**
     * Represents a product summary with essential details.
     * @param {string} title - The product's display name as shown on the website.
     * @param {string} description - A short marketing or product description.
     * @param {number} price - The current price or sale price of the product.
     * @param {string} url - Canonical URL linking to the product's page.
     * @param {string} thumbnail_image - URL pointing to the product's thumbnail image.
     */
    constructor(title, description, price, url, thumbnail_image, product_type = null) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.url = url;
        this.thumbnail_image = thumbnail_image;
    }

    static fromDict(data) {
        return new ProductSummary(
            data.title || "",
            data.description || "",
            data.price || 0.0,
            data.url || "",
            data.thumb_image || ""
        );
    }
}

class SearchResponse {
    /**
     * Represents a search response containing products and facets.
     * @param {ProductSummary[]} products - List of products matching the search query.
     * @param {FacetItem[]} facets - List of facets available for filtering search results.
     */
    constructor(products, facets) {
        this.products = products;
        this.facets = facets;
    }

    static fromDict(responseDict) {
        const facets = [];
        const facetFields = responseDict.facet_counts?.facet_fields || {};
        const data = responseDict.response || {};

        for (const [key, values] of Object.entries(facetFields)) {
            if (Array.isArray(values)) {
                const facetItem = FacetItem.fromDict(key, values);
                facets.push(facetItem);
            }
        }

        const products = (data.docs || []).map(product => ProductSummary.fromDict(product));

        return new SearchResponse(products, facets);
    }
}

class FacetItem {
    /**
     * Represents a facet item with name and values.
     * @param {string} name - The name of the facet item.
     * @param {string[]} values - List of values associated with the facet item.
     */
    constructor(name, values) {
        this.name = name;
        this.values = values;
    }

    static fromDict(name, data) {
        const values = data
            .filter(value => typeof value === 'object' && value.name)
            .map(value => value.name);
        return new FacetItem(name, values);
    }
}


class CategoryFacetList {
    /**
     * Represents a list of categorical facet groups.
     * @param {CategoryFacetGroup[]} items - List of categorical facets for products.
     */
    constructor(items) {
        this.items = items;
    }
}

class FacetCollection {
    /**
     * Represents a collection of facets.
     * @param {FacetItem[]} facets - List of facets available for filtering search results.
     */
    constructor(facets) {
        this.facets = facets;
    }
}

class SearchInput {
    /**
     * Represents search input parameters.
     * @param {string} search_query - Search query to find products (e.g., 'Cabernet').
     * @param {string} filter_query - Comma separated list of facetName:facetValue used to Filter query.
     */
    constructor(search_query, filter_query) {
        this.search_query = search_query;
        this.filter_query = filter_query;
    }
}

module.exports = {
    ProductSummary,
    SearchResponse,
    FacetItem,
    CategoryFacetList,
    FacetCollection,
    SearchInput
};