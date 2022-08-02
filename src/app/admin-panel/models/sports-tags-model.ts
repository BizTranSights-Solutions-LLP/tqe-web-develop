import { Meta } from './meta';
    
export class sportsTags {
    badge: number;
    meta: Meta;
    result: result[];
};

class result {
    id: number;
    name: string;
    sports_tags: sports_tags[];

}

class sports_tags {
    id: number;
    is_free: number;
    name: string;
    type: string;
}

