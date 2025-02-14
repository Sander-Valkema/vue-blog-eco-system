import { ImgHTMLAttributes } from "vue"

export const DESC: string = 'descending'
export const ASC: string = 'ascending'

/**
 * Blog item data
 * 
 * id           - id of blog
 * title        - title of blog
 * image        - image of blog
 * intro        - intro text for blog list page
 * description  - description for article page
 * tags         - tags of blog. These tags are used for the tags component
 * date         - date of blog. Only accepts unix timestamps
 */
export interface BlogItem {
    id: number,
    title: string,
    image?: ImgHTMLAttributes,
    intro?: string,
    description?: string,    
    tags?: string[],
    date?: number
}

/**
 * Bloglist main configuration
 * 
 * blogData         - array of blogs
 * className        - name of class in root html tag of blog item
 * colMobile        - total columns in mobile view. Default is 1
 * colTablet        - total columns in tablet view. Default is 2
 * colDesktop       - total columns in desktop view. Default is 3
 * showResults      - show total results banner. Default is true
 * pagination       - configuration for pagination component
 * sort             - configuration for sort component
 * tags             - configuration for tags component
 * search           - configuration for search component
 */
export interface BlogList {
    blogData: BlogItem[],
    className?: string,
    colMobile?: 1|2|3,
    colTablet?: 1|2|3,
    colDesktop?: 1|2|3,    
    showResults?: boolean,
    pagination?: PaginationParams,
    sort?: SortParams
    tags?: TagsParams
    search?: SearchParams
}

/**
 * Pagination component configuration
 * 
 * maxItemsPerPage   - maximum visible items per page.
 * show              - show pagination component.
 * maxPageNumbers    - maximum of page numbers in pagination.
 * showNextPrev      - show next and previous buttons in pagination.
 * showFirstLast     - show first and last buttons in pagination.
 */
export interface PaginationParams {    
    maxItemsPerPage: number,
    show: boolean,
    maxPageNumbers: 3|5|7|9,
    showNextPrev: boolean,
    showFirstLast: boolean
}

/**
 * Pagination component helper interface.
 * 
 * pageRange        - range of pagination page numbers
 * pos              - position of pagination
 */
export interface paginationData {
    pageRange: number[], 
    pos: 'at start'|'at end'|'middle'|'none'|'first'|'last'
}

/**
 * Sort component configuration
 * 
 * show     - show sort component. Default is true
 * keys     - keys from BlogItem interface you want to make sortable.
 */
export interface SortParams {
    show: boolean,
    keys: Extract<keyof BlogItem, string>[],
}

/**
 * Sort keys data
 * 
 * SortKey          - name of key
 * SortDirection    - direction of sorting
 */
export type SortKeyDirection = [
    sortKey: string,
    sortDirection: typeof ASC| typeof DESC     
]

/**
 * Tags component configuration
 * 
 * show     - show tags component. Default is true
 * max      - set a maximum for the amount of visible tags.
 */
export interface TagsParams {
    show: boolean,
    max: number
}

/**
 * Search component configuration
 * 
 * show         - show search component. Default is true
 * debounceTime - time to debounce the search results. In milliseconds
 */
export interface SearchParams {
    show: boolean,
    debounceTime: number
}

/**
 * Item filters. These parameter are used to filter the items from the blog components
 * 
 * sort     - current sort key data
 * page     - current page number
 * search   - search word
 * tags     - list of active tags 
 */
export interface Filter {
    sort?: SortKeyDirection,
    search?: string,
    tags?: string[],
    page?: number,
}
