import { Product } from "./product.model";

export interface SearchResults {
    products: Product[]; // List of products found in the search
    categories: string[]; // Array of category names; you may define a specific interface for categories if needed
}
