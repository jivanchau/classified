import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export interface CategoryTreeNode {
    id: string;
    title: string;
    banner?: string | null;
    shortDesc?: string | null;
    parentId: string | null;
    position: number;
    children: CategoryTreeNode[];
}
interface CategoryOrderInput {
    id: string;
    parentId?: string | null;
    position: number;
}
export declare class CategoriesService {
    private readonly categoriesRepo;
    constructor(categoriesRepo: Repository<Category>);
    findAllTree(): Promise<CategoryTreeNode[]>;
    findOneTree(id: string): Promise<CategoryTreeNode>;
    create(dto: CreateCategoryDto): Promise<CategoryTreeNode>;
    update(id: string, dto: UpdateCategoryDto): Promise<CategoryTreeNode>;
    remove(id: string): Promise<{
        id: string;
    }>;
    reorder(items: CategoryOrderInput[]): Promise<CategoryTreeNode[]>;
    private buildTree;
    private findNode;
    private collectDescendants;
    private ensureValidParent;
    private resolveParent;
    private findEntity;
    private getNextPosition;
}
export {};
