export declare class CreateCategoryDto {
    title: string;
    banner?: string;
    shortDesc?: string;
    slug?: string;
    icon?: string;
    status?: 'active' | 'inactive';
    parentId?: string | null;
}
