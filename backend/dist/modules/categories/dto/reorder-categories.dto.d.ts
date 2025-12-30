export declare class CategoryOrderDto {
    id: string;
    parentId?: string | null;
    position: number;
}
export declare class ReorderCategoriesDto {
    items: CategoryOrderDto[];
}
