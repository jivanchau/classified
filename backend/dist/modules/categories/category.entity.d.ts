export declare class Category {
    id: string;
    title: string;
    banner?: string;
    shortDesc?: string;
    slug?: string;
    icon?: string;
    status: 'active' | 'inactive';
    position: number;
    parent?: Category | null;
    parentId?: string | null;
    children?: Category[];
}
