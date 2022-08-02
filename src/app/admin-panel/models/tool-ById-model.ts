import { Meta } from './meta';
    
export class responseTool {
    badge: number;
    meta: Meta;
    result: result[];
};

class result {
    tool_url: string;
    author: author;
    description: string;
    created_at: string;
    id: number;   
    images: images[];
    is_allowed: number;
    meta_tags: meta_tags[];
    remaining_free_podcast_count: number;
    sports_tags: sports_tags;
    name: string;
}

class author {
    email: string;
    file_path: string;
    first_name: string;
    id: number;
    last_name: string;
}

class images {
    description: string;
    file_path: string;
    file_size: string;
    id: number;
    name: string;
    title: string;
}

class meta_tags {
    description: string;
    id: number;
    keyword: string;
    title: string;
}

class sports_tags {
    id: number;
    is_free: number;
    name: string; 
}



