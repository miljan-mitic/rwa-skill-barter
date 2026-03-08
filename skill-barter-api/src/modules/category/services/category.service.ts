import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { FilterCategoryDto } from '../dtos/filter-category.dto';
import { SortType } from 'src/common/enums/sort.enum';
import { SkillService } from 'src/modules/skill/services/skill.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly skillService: SkillService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const existing = await this.categoryRepository.findOneBy({
      name,
    });

    if (existing) {
      throw new ConflictException(
        `Category with name "${name}" already exists`,
      );
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async getCategories(filterCategoryDto: FilterCategoryDto) {
    const {
      search,
      page = 0,
      pageSize = 10,
      sortBy = 'createdAt',
      sortType = SortType.ASC,
    } = filterCategoryDto;
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (search) {
      queryBuilder.andWhere('category.name ILIKE :name', {
        name: `%${search}%`,
      });
    }

    queryBuilder.orderBy(`category.${sortBy}`, sortType);
    queryBuilder.skip(page * pageSize).take(pageSize);

    const [count, items] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.getMany(),
    ]);

    return {
      items,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
      currentPage: page,
    };
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.skillService.deleteMany({ category: { id } });

    return this.categoryRepository.delete({ id });
  }
}
