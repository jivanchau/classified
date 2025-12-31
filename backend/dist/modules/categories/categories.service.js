"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./category.entity");
let CategoriesService = class CategoriesService {
    constructor(categoriesRepo) {
        this.categoriesRepo = categoriesRepo;
    }
    toSlug(value) {
        return (value || '')
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    async findAllTree() {
        const categories = await this.categoriesRepo.find({
            relations: ['parent'],
            order: { position: 'ASC', title: 'ASC' }
        });
        return this.buildTree(categories);
    }
    async findOneTree(id) {
        const tree = await this.findAllTree();
        const node = this.findNode(tree, id);
        if (!node)
            throw new common_1.NotFoundException('Category not found');
        return node;
    }
    async create(dto) {
        var _a, _b;
        const parent = await this.resolveParent((_a = dto.parentId) !== null && _a !== void 0 ? _a : null);
        const position = await this.getNextPosition((_b = dto.parentId) !== null && _b !== void 0 ? _b : null);
        const slug = this.toSlug(dto.slug || dto.title);
        const category = this.categoriesRepo.create({
            title: dto.title,
            banner: dto.banner,
            shortDesc: dto.shortDesc,
            slug,
            icon: dto.icon,
            status: dto.status || 'active',
            parent,
            position
        });
        const saved = await this.categoriesRepo.save(category);
        return this.findOneTree(saved.id);
    }
    async update(id, dto) {
        var _a, _b, _c;
        const category = await this.findEntity(id);
        if (dto.parentId !== undefined) {
            await this.ensureValidParent(id, (_a = dto.parentId) !== null && _a !== void 0 ? _a : null);
            category.parent = await this.resolveParent((_b = dto.parentId) !== null && _b !== void 0 ? _b : null);
            category.position = await this.getNextPosition((_c = dto.parentId) !== null && _c !== void 0 ? _c : null);
        }
        if (dto.title !== undefined) {
            category.title = dto.title;
            if (!dto.slug && !category.slug) {
                category.slug = this.toSlug(dto.title);
            }
        }
        if (dto.slug !== undefined) {
            category.slug = this.toSlug(dto.slug || category.title);
        }
        if (dto.banner !== undefined) {
            category.banner = dto.banner;
        }
        if (dto.shortDesc !== undefined) {
            category.shortDesc = dto.shortDesc;
        }
        if (dto.icon !== undefined) {
            category.icon = dto.icon;
        }
        if (dto.status !== undefined) {
            category.status = dto.status;
        }
        const saved = await this.categoriesRepo.save(category);
        return this.findOneTree(saved.id);
    }
    async remove(id) {
        const category = await this.findEntity(id);
        await this.categoriesRepo.remove(category);
        return { id };
    }
    async reorder(items) {
        var _a;
        if (!items.length) {
            return this.findAllTree();
        }
        const ids = items.map(item => item.id);
        const categories = await this.categoriesRepo.find({ where: { id: (0, typeorm_2.In)(ids) } });
        if (categories.length !== ids.length) {
            throw new common_1.NotFoundException('One or more categories were not found');
        }
        const allCategories = await this.categoriesRepo.find({ relations: ['parent'] });
        const currentStructure = new Map();
        allCategories.forEach(cat => { var _a; return currentStructure.set(cat.id, { parentId: ((_a = cat.parent) === null || _a === void 0 ? void 0 : _a.id) || null }); });
        items.forEach(item => {
            var _a;
            currentStructure.set(item.id, { parentId: (_a = item.parentId) !== null && _a !== void 0 ? _a : null });
        });
        currentStructure.forEach((value, nodeId) => {
            var _a;
            let current = value.parentId;
            const visited = new Set();
            while (current) {
                if (current === nodeId) {
                    throw new common_1.BadRequestException('Cannot move category under its descendant');
                }
                if (visited.has(current)) {
                    throw new common_1.BadRequestException('Invalid category hierarchy detected');
                }
                visited.add(current);
                current = ((_a = currentStructure.get(current)) === null || _a === void 0 ? void 0 : _a.parentId) || null;
            }
        });
        const categoriesMap = new Map(categories.map(cat => [cat.id, cat]));
        const parentMap = new Map(allCategories.map(cat => [cat.id, cat]));
        for (const item of items) {
            const category = categoriesMap.get(item.id);
            if (!category)
                continue;
            category.position = (_a = item.position) !== null && _a !== void 0 ? _a : 0;
            if (item.parentId) {
                const parent = parentMap.get(item.parentId);
                if (!parent)
                    throw new common_1.NotFoundException('Parent category not found');
                category.parent = parent;
            }
            else {
                category.parent = null;
            }
        }
        await this.categoriesRepo.save(Array.from(categoriesMap.values()));
        return this.findAllTree();
    }
    buildTree(categories) {
        const map = new Map();
        const roots = [];
        categories.forEach(cat => {
            var _a, _b, _c, _d;
            map.set(cat.id, {
                id: cat.id,
                title: cat.title,
                banner: cat.banner || null,
                shortDesc: cat.shortDesc || null,
                slug: cat.slug || this.toSlug(cat.title),
                icon: cat.icon || null,
                status: cat.status || 'active',
                parentId: (_c = (_a = cat.parentId) !== null && _a !== void 0 ? _a : (_b = cat.parent) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : null,
                position: (_d = cat.position) !== null && _d !== void 0 ? _d : 0,
                children: []
            });
        });
        map.forEach(node => {
            if (node.parentId) {
                const parent = map.get(node.parentId);
                if (parent) {
                    parent.children.push(node);
                }
                else {
                    roots.push(node);
                }
            }
            else {
                roots.push(node);
            }
        });
        const sortChildren = (list) => {
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
    findNode(nodes, id) {
        for (const node of nodes) {
            if (node.id === id)
                return node;
            const found = this.findNode(node.children, id);
            if (found)
                return found;
        }
        return undefined;
    }
    collectDescendants(node, set) {
        for (const child of node.children) {
            set.add(child.id);
            this.collectDescendants(child, set);
        }
    }
    async ensureValidParent(id, parentId) {
        if (!parentId)
            return;
        if (parentId === id) {
            throw new common_1.BadRequestException('Category cannot be its own parent');
        }
        const tree = await this.findAllTree();
        const current = this.findNode(tree, id);
        if (!current)
            throw new common_1.NotFoundException('Category not found');
        const descendants = new Set();
        this.collectDescendants(current, descendants);
        if (descendants.has(parentId)) {
            throw new common_1.BadRequestException('Cannot move category under its descendant');
        }
    }
    async resolveParent(parentId) {
        if (!parentId)
            return null;
        const parent = await this.categoriesRepo.findOne({ where: { id: parentId } });
        if (!parent)
            throw new common_1.NotFoundException('Parent category not found');
        return parent;
    }
    async findEntity(id) {
        const category = await this.categoriesRepo.findOne({ where: { id }, relations: ['parent'] });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async getNextPosition(parentId) {
        const qb = this.categoriesRepo.createQueryBuilder('category').select('COALESCE(MAX(category.position), 0)', 'max');
        if (parentId) {
            qb.where('category.parent_id = :parentId', { parentId });
        }
        else {
            qb.where('category.parent_id IS NULL');
        }
        const result = await qb.getRawOne();
        return (Number(result === null || result === void 0 ? void 0 : result.max) || 0) + 1;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map