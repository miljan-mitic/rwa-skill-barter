import {
  BadRequestException,
  NotFoundException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSkill } from 'src/entities/user-skill.entity';
import { Repository } from 'typeorm';
import { CreateUserSkillDto } from '../dtos/create-user-skill.dto';
import { User } from 'src/entities/user.entity';
import { SkillService } from 'src/modules/skill/services/skill.service';
import { FilterUserSkillDto } from '../dtos/filter-user-skill.dto';
import { SortBy, SortType } from 'src/common/enums/sort.enum';
import { UpdateUserSkillDto } from '../dtos/update-user-skill.dto';

@Injectable()
export class UserSkillService {
  constructor(
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
    private readonly skillService: SkillService,
  ) {}

  async create(user: User, createUserSkillDto: CreateUserSkillDto) {
    const { skillId, description } = createUserSkillDto;

    const skill = await this.skillService.findById(skillId);

    const userSkill = await this.userSkillRepository.findOneBy({
      user: { id: user.id },
      skill: { id: skill.id },
    });

    if (userSkill) {
      throw new BadRequestException('User already has this skill');
    }

    const newUserSkill = this.userSkillRepository.create({
      user,
      skill,
      description,
    });
    try {
      await this.userSkillRepository.save(newUserSkill);
    } catch (error) {
      console.warn('USER SKILL SERVICE - CREATE USER SKILL:', error);
      throw new InternalServerErrorException('Unexpected error');
    }
    return newUserSkill;
  }

  async updateUserSkill(
    user: User,
    id: number,
    updateUserSkillDto: UpdateUserSkillDto,
  ) {
    const { description } = updateUserSkillDto;

    const userSkill = await this.userSkillRepository.findOneBy({
      id,
      user: { id: user.id },
    });

    if (!userSkill) {
      throw new NotFoundException('User skill not found');
    }

    userSkill.description = description;

    try {
      await this.userSkillRepository.save(userSkill);
    } catch (error) {
      console.warn('USER SKILL SERVICE - UPDATE USER SKILL:', error);
      throw new InternalServerErrorException('Unexpected error');
    }

    return userSkill;
  }

  async getUserSkills(user: User, filterUserSkillDto: FilterUserSkillDto) {
    const {
      skillId,
      page = 0,
      pageSize = 10,
      sortBy = SortBy.CREATED_AT,
      sortType = SortType.ASC,
    } = filterUserSkillDto;

    const queryBuilder = this.userSkillRepository
      .createQueryBuilder('userSkill')
      .leftJoinAndSelect('userSkill.skill', 'skill')
      .andWhere('userSkill.userId = :userId', { userId: user.id });

    if (skillId) {
      queryBuilder.andWhere('skill.id = :skillId', { skillId });
    }

    queryBuilder.orderBy(`userSkill.${sortBy}`, sortType);

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

  async getUserSkillById(user: User, id: number) {
    const userSkill = await this.userSkillRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['skill.category'],
    });

    if (!userSkill) {
      throw new NotFoundException('User skill not found');
    }

    return userSkill;
  }

  deleteUserSkill(user: User, id: number) {
    return this.userSkillRepository.delete({ id, user: { id: user.id } });
  }
}
