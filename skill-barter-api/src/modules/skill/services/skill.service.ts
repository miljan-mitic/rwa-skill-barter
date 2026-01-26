import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/entities/skill.entity';
import { Repository } from 'typeorm';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { CategoryService } from 'src/modules/category/services/category.service';
import { FilterSkillDto } from '../dtos/filter-skill.dto';
import { SortBy, SortType } from 'src/common/enums/sort.enum';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    private readonly categoryService: CategoryService,
  ) {}
  async create(createSkillDto: CreateSkillDto) {
    const { categoryId } = createSkillDto;

    const category = await this.categoryService.findById(categoryId);

    const skill = this.skillRepository.create({ ...createSkillDto, category });

    try {
      await this.skillRepository.save(skill);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create Skill: ${error}`,
      );
    }

    return skill;
  }

  async findById(id: number) {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  async getSkills(filterSkillDto: FilterSkillDto) {
    const {
      categoryId,
      page = 0,
      pageSize = 10,
      sortBy = SortBy.CREATED_AT,
      sortType = SortType.ASC,
    } = filterSkillDto;
    const queryBuilder = this.skillRepository.createQueryBuilder('skill');

    if (categoryId !== undefined) {
      queryBuilder.andWhere('skill.categoryId = :categoryId', { categoryId });
    }

    queryBuilder.orderBy(`skill.${sortBy}`, sortType);

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
