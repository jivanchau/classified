export declare class UpdateCategoryDto {
    title?: string;
    banner?: string;
    shortDesc?: string;
    slug?: string;
    icon?: string;
    status?: 'active' | 'inactive';
    parentId?: string | null;
}
