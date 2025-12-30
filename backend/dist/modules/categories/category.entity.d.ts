export declare class Category {
    id: string;
    title: string;
    banner?: string;
    shortDesc?: string;
    position: number;
    parent?: Category | null;
    parentId?: string | null;
    children?: Category[];
}
