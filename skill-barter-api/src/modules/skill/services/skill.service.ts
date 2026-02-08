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
import { User } from 'src/entities/user.entity';
import { UserSkill } from 'src/entities/user-skill.entity';

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
      console.warn('SKILL SERVICE - CREATE SKILL:', error);
      throw new InternalServerErrorException('Unexpected error');
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

  async getSkills(user: User, filterSkillDto: FilterSkillDto) {
    const {
      categoryId,
      userSkills,
      search,
      page = 0,
      pageSize = 10,
      sortBy = SortBy.CREATED_AT,
      sortType = SortType.ASC,
    } = filterSkillDto;
    const queryBuilder = this.skillRepository.createQueryBuilder('skill');

    if (categoryId !== undefined) {
      queryBuilder.andWhere('skill.categoryId = :categoryId', { categoryId });
    }

    if (userSkills !== undefined) {
      queryBuilder
        .leftJoin(
          UserSkill,
          'userSkill',
          'userSkill.skillId = skill.id AND userSkill.userId = :userId',
          {
            userId: user.id,
          },
        )
        .andWhere(`userSkill.id IS ${userSkills ? 'NOT' : ''} NULL`);
    }

    if (search) {
      queryBuilder.andWhere('skill.name ILIKE :name', { name: `%${search}%` });
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
