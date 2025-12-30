import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<import("./categories.service").CategoryTreeNode[]>;
    findOne(id: string): Promise<import("./categories.service").CategoryTreeNode>;
    create(dto: CreateCategoryDto): Promise<import("./categories.service").CategoryTreeNode>;
    reorder(dto: ReorderCategoriesDto): Promise<import("./categories.service").CategoryTreeNode[]>;
    update(id: string, dto: UpdateCategoryDto): Promise<import("./categories.service").CategoryTreeNode>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
