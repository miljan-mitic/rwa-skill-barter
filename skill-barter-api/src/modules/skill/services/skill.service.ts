import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/entities/skill.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { CategoryService } from 'src/modules/category/services/category.service';
import { FilterSkillDto } from '../dtos/filter-skill.dto';
import { SortType } from 'src/common/enums/sort.enum';
import { User } from 'src/entities/user.entity';
import { UserSkill } from 'src/entities/user-skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}
  async create(createSkillDto: CreateSkillDto) {
    const { categoryId, name } = createSkillDto;

    const existing = await this.skillRepository.findOneBy({ name });
    if (existing) {
      throw new ConflictException(`Skill with name "${name}" already exists`);
    }

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
      sortBy = 'createdAt',
      sortType = SortType.ASC,
    } = filterSkillDto;
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .leftJoinAndSelect('skill.category', 'category');

    if (categoryId !== undefined) {
      queryBuilder.andWhere('category.Id = :categoryId', { categoryId });
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

  async deleteMany(findOptionsWhere: FindOptionsWhere<Skill>) {
    return this.skillRepository.delete(findOptionsWhere);
  }

  async deleteSkill(id: number) {
    const deletedResult = await this.skillRepository.delete({ id });

    if (!deletedResult.affected) {
      throw new NotFoundException('Skill not found');
    }

    return deletedResult;
  }
}
