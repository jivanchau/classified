import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoriesRepo: Repository<Category>) {}

  async findAllTree(): Promise<CategoryTreeNode[]> {
    const categories = await this.categoriesRepo.find({
      relations: ['parent'],
      order: { position: 'ASC', title: 'ASC' }
    });
    return this.buildTree(categories);
  }

  async findOneTree(id: string): Promise<CategoryTreeNode> {
    const tree = await this.findAllTree();
    const node = this.findNode(tree, id);
    if (!node) throw new NotFoundException('Category not found');
    return node;
  }

  async create(dto: CreateCategoryDto) {
    const parent = await this.resolveParent(dto.parentId ?? null);
    const position = await this.getNextPosition(dto.parentId ?? null);
    const category = this.categoriesRepo.create({
      title: dto.title,
      banner: dto.banner,
      shortDesc: dto.shortDesc,
      parent,
      position
    });
    const saved = await this.categoriesRepo.save(category);
    return this.findOneTree(saved.id);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findEntity(id);

    if (dto.parentId !== undefined) {
      await this.ensureValidParent(id, dto.parentId ?? null);
      category.parent = await this.resolveParent(dto.parentId ?? null);
      category.position = await this.getNextPosition(dto.parentId ?? null);
    }

    if (dto.title !== undefined) {
      category.title = dto.title;
    }

    if (dto.banner !== undefined) {
      category.banner = dto.banner;
    }

    if (dto.shortDesc !== undefined) {
      category.shortDesc = dto.shortDesc;
    }

    const saved = await this.categoriesRepo.save(category);
    return this.findOneTree(saved.id);
  }

  async remove(id: string) {
    const category = await this.findEntity(id);
    await this.categoriesRepo.remove(category);
    return { id };
  }

  async reorder(items: CategoryOrderInput[]) {
    if (!items.length) {
      return this.findAllTree();
    }

    const ids = items.map(item => item.id);
    const categories = await this.categoriesRepo.find({ where: { id: In(ids) } });
    if (categories.length !== ids.length) {
      throw new NotFoundException('One or more categories were not found');
    }

    const allCategories = await this.categoriesRepo.find({ relations: ['parent'] });
    const currentStructure = new Map<string, { parentId: string | null }>();
    allCategories.forEach(cat => currentStructure.set(cat.id, { parentId: cat.parent?.id || null }));

    items.forEach(item => {
      currentStructure.set(item.id, { parentId: item.parentId ?? null });
    });

    currentStructure.forEach((value, nodeId) => {
      let current = value.parentId;
      const visited = new Set<string>();
      while (current) {
        if (current === nodeId) {
          throw new BadRequestException('Cannot move category under its descendant');
        }
        if (visited.has(current)) {
          throw new BadRequestException('Invalid category hierarchy detected');
        }
        visited.add(current);
        current = currentStructure.get(current)?.parentId || null;
      }
    });

    const categoriesMap = new Map<string, Category>(categories.map(cat => [cat.id, cat]));
    const parentMap = new Map<string, Category>(allCategories.map(cat => [cat.id, cat]));

    for (const item of items) {
      const category = categoriesMap.get(item.id);
      if (!category) continue;
      category.position = item.position ?? 0;
      if (item.parentId) {
        const parent = parentMap.get(item.parentId);
        if (!parent) throw new NotFoundException('Parent category not found');
        category.parent = parent;
      } else {
        category.parent = null;
      }
    }

    await this.categoriesRepo.save(Array.from(categoriesMap.values()));
    return this.findAllTree();
  }

  private buildTree(categories: Category[]): CategoryTreeNode[] {
    const map = new Map<string, CategoryTreeNode>();
    const roots: CategoryTreeNode[] = [];

    categories.forEach(cat => {
      map.set(cat.id, {
        id: cat.id,
        title: cat.title,
        banner: cat.banner || null,
        shortDesc: cat.shortDesc || null,
        parentId: cat.parentId ?? cat.parent?.id ?? null,
        position: cat.position ?? 0,
        children: []
      });
    });

    map.forEach(node => {
      if (node.parentId) {
        const parent = map.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    const sortChildren = (list: CategoryTreeNode[]) => {
      list.sort((a, b) => {
        if (a.position === b.position) {
          return a.title.localeCompare(b.title);
        }
        return a.position - b.position;
      });
      list.forEach(child => sortChildren(child.children));
    };

    sortChildren(roots);
    return roots;
  }

  private findNode(nodes: CategoryTreeNode[], id: string): CategoryTreeNode | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = this.findNode(node.children, id);
      if (found) return found;
    }
    return undefined;
  }

  private collectDescendants(node: CategoryTreeNode, set: Set<string>) {
    for (const child of node.children) {
      set.add(child.id);
      this.collectDescendants(child, set);
    }
  }

  private async ensureValidParent(id: string, parentId: string | null) {
    if (!parentId) return;
    if (parentId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }
    const tree = await this.findAllTree();
    const current = this.findNode(tree, id);
    if (!current) throw new NotFoundException('Category not found');
    const descendants = new Set<string>();
    this.collectDescendants(current, descendants);
    if (descendants.has(parentId)) {
      throw new BadRequestException('Cannot move category under its descendant');
    }
  }

  private async resolveParent(parentId: string | null) {
    if (!parentId) return null;
    const parent = await this.categoriesRepo.findOne({ where: { id: parentId } });
    if (!parent) throw new NotFoundException('Parent category not found');
    return parent;
  }

  private async findEntity(id: string) {
    const category = await this.categoriesRepo.findOne({ where: { id }, relations: ['parent'] });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  private async getNextPosition(parentId: string | null) {
    const qb = this.categoriesRepo.createQueryBuilder('category').select('COALESCE(MAX(category.position), 0)', 'max');
    if (parentId) {
      qb.where('category.parent_id = :parentId', { parentId });
    } else {
      qb.where('category.parent_id IS NULL');
    }
    const result = await qb.getRawOne<{ max: string }>();
    return (Number(result?.max) || 0) + 1;
  }
}
