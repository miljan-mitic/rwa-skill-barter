import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { FilterCategoryDto } from '../dtos/filter-category.dto';
import { SortBy, SortType } from 'src/common/enums/sort.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
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
      page = 0,
      pageSize = 10,
      name,
      sortBy = SortBy.CREATED_AT,
      sortType = SortType.ASC,
    } = filterCategoryDto;
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (name) {
      queryBuilder.where('category.name ILIKE :name', { name: `%${name}%` });
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
}
