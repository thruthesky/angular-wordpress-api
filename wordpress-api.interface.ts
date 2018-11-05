

export const INVALID_EMAIL = 'invalid_email';
export const INVALID_USERNAME = 'invalid_username';
export const INCORRECT_PASSWORD = 'incorrect_password';
export const NO_FILE_SELECTED = 'no_file_selected';



export interface UserCreate {
    username: string; // Login name for the user. Required: 1
    name?: string; // 	Display name for the user.
    first_name?: string; // First name for the user.
    last_name?: string; // Last name for the user.
    email: string; // The email address for the user. Required: 1
    url?: string; // URL of the user.
    description?: string; // Description of the user.
    locale?: string; // Locale for the user. One of: , en_US
    nickname?: string; // The nickname for the user.
    slug?: string; // An alphanumeric identifier for the user.
    roles?: string; // Roles assigned to the user.
    password: string; // Password for the user (never included). Required: 1
    meta?: string; // Meta fields.
}

export interface UserUpdate {
    id?: number;      // user id
    username?: string; // Login name for the user. Required: 1
    name?: string; // 	Display name for the user.
    first_name?: string; // First name for the user.
    last_name?: string; // Last name for the user.
    email?: string; // The email address for the user. Required: 1
    url?: string; // URL of the user.
    description?: string; // Description of the user.
    locale?: string; // Locale for the user. One of: , en_US
    nickname?: string; // The nickname for the user.
    slug?: string; // An alphanumeric identifier for the user.
    roles?: string; // Roles assigned to the user.
    password?: string; // Password for the user (never included). Required: 1
    meta?: string; // Meta fields.
}

export interface UserResponse {
    avatar_urls: {};
    capabilities: {};
    description: string;
    email: string;
    extra_capabilities: {};
    first_name: string;
    id: number;
    last_name: string;
    link: string;
    locale: string;
    meta: Array<any>;
    name: string;
    nickname: string;
    register_date: string;
    roles: Array<string>;
    security_code: string;
    slug: string;
    url: string;
    username: string;
    _links: {};
}


export interface PostCreate {
    date?: string; // The date the object was published, in the site's timezone.
    date_gmt?: string; // The date the object was published, as GMT.
    slug?: string; // An alphanumeric identifier for the object unique to its type.
    status?: string; // A named status for the object. One of: publish, future, draft, pending, private
    password?: string; // A password to protect access to the content and excerpt.
    title?: string; // The title for the object.
    content?: string; // The content for the object.
    author?: string; // The ID for the author of the object.
    excerpt?: string; // The excerpt for the object.
    featured_media?: string; // The ID of the featured media for the object.
    comment_status?: string; // Whether or not comments are open on the object. One of: open, closed
    ping_status?: string; // Whether or not the object can be pinged. One of: open, closed
    format?: string; // The format for the object. One of: standard, aside, chat, gallery, link, image, quote, status, video, audio
    meta?: string; // Meta fields.
    sticky?: string; // Whether or not the object should be treated as sticky.
    template?: string; // The theme file to use to display the object. One of:
    categories?: string; // The terms assigned to the object in the category taxonomy.
    tags?: string; // The terms assigned to the object in the post_tag taxonomy.

    files: Array<string>;       // Hack for WP REST API. This is file id ( wp_posts.ID ) to connect uploaded files to the post.
}

export interface PostUpdate {
    id: string; // post ID to edit
    title: string; //
    content: string; //
    files: Array<string>;
}



export interface PostList {
    context?: string;    // Scope under which the request is made; determines fields present in response.
                        // Default: view
                        // One of: view, embed, edit

    page?: number;           // Current page of the collection. Default: 1
    per_page?: number;       // Maximum number of items to be returned in result set. Default: 10
    search?: string;         // Limit results to those matching a string.
    after?: string;          // Limit response to posts published after a given ISO8601 compliant date.
    author?: string;         // Limit result set to posts assigned to specific authors.
    author_exclude?: string; // Ensure result set excludes posts assigned to specific authors.
    before?: string;         // Limit response to posts published before a given ISO8601 compliant date.
    exclude?: string;        // Ensure result set excludes specific IDs.
    include?: string;        // Limit result set to specific IDs.
    offset?: string;         // Offset the result set by a specific number of items.
    order?: string;          // Order sort attribute ascending or descending. Default: desc. One of: asc, desc
    orderby?: string;        // Sort collection by object attribute. Default: date
                            // One of: author, date, id, include, modified, parent, relevance, slug, title
    slug?: string;           // Limit result set to posts with one or more specific slugs.
    status?: string;         // Limit result set to posts assigned one or more statuses. Default: publish
    categories?: string;     // Limit result set to all items that have the specified term assigned in the categories taxonomy.
                                // ex) "713,12"
    categories_exclude?: string ;    // Limit result set to all items except those
                                    // that have the specified term assigned in the categories taxonomy.
    tags?: string;           // Limit result set to all items that have the specified term assigned in the tags taxonomy.
    tags_exclude?: string;   // Limit result set to all items except those that have the specified term assigned in the tags taxonomy.
    sticky?: string;         // Limit result set to items that are sticky.
}




export interface WordpressApiConfig {
    url: string;
    sessionStorage: string; // cookie or localStorage
}

export interface WordpressApiError {
    code: string;
    message: string;
}


export interface Category {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    parent: number;
    meta: Array<any>;   // Not avaiable on `getSystemSettings()`
    _links: any;        // Not avaiable on `getSystemSettings()`
}
export type Categories = Array<Category>;

export interface ShortCategory {
    term_id: string;
    name: string;
    slug: string;
}
export type ShortCategories = Array<ShortCategory>;


/**
 * system settings;
 */
export interface SystemSettings {
    default_domains?: Array<string>;
    max_sites?: number;
    max_domains?: number;
    categories?: Categories;
    site?: Site;
}


export interface Domain {
    domain: string;
    reason: string;
    status: string;
}

export interface Site {
    idx?: string;               // site.idx
    domain?: string;            // Needed to create a site.
    domains?: Array<Domain>;    // Avaiable on response
    name?: string;              // site name
    author?: string;            // Blog poster/writer name. mostly blog owner's nickname.
    description?: string;
    keywords?: string;
    categories?: ShortCategories;

    // HTML for site head.
    // @see https://docs.google.com/document/d/1nOEJVDilLbF0sNCkkRGcDwdT3rDLZp3h59oQ77BIdp4/edit#heading=h.bn3bu2qkurcu
    head?: string;
}




export interface Sites {
    max_domains: number;
    max_sites: number;
    available_domains: number;
    available_sites: number;
    no_of_domains_in_progress: number;
    sites: Array<Site>;
}


export interface DomainAdd {
    idx_site: string;
    domain: string;
}





export interface CategoryCrud {
    idx_site?: string;           // site.idx
    name: string;               // category name
    term_id?: string;           // available on response and used on rename
    orders?: string;            // available only on reponse
}


export interface Attachment {
    guid: string; // url
    thumbnail_url: string; // only avaialable if media type is image.
    id: string; // id of uploaded file. wp_posts.ID
    // status: string; //
    // author: string; // author ID
    // type: string; // post type
    media_type: 'file' | 'image';
    mime_type: string; // mime type i.e) 'image/jpeg'.
    name: string; // uploaded file name
    // post: string; // The ID for the associated post of the attachment.
}




export interface Comment {
    comment_ID?: string;        // update only
    comment_post_ID: string;            // post ID that the comment belongs to.
    comment_parent?: string;            // comment parent ID
    readonly comment_author?: string;
    comment_date?: string;
    comment_content: string;
    readonly user_id?: string;           // user id of the author
    depth?: string;
    show: '' | 'edit' | 'reply';    // client only. show reply/edit box
    files: Array<string> | Array<Attachment>;
}


/**
 * Customized to reduce the size
 */
export interface Post {
    id: string;
    date: string;
    // date_gmt: string;
    guid: string;
    modified: string;
    // modified_gmt: string;
    slug: string;
    // status: string;
    // type: string;
    // link: string;
    title: string;
    content: string;
    // excerpt: string;
    // protected: boolean;
    author: string;
    // featured_media: number;
    // comment_status: string;
    // ping_status: string;
    // sticky: boolean;
    // template: string;
    // format: string;
    meta: Array<any>;
    categories: Array<number>;
    // tags: Array<string>;
    files: Array<Attachment>;
    _links: any;

    view: boolean; // avaialabe only on client.

    comments: Array<Comment>; // comments.
}
export type Posts = Array<Post>;

