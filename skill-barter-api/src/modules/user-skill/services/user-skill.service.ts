import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSkill } from 'src/entities/user-skill.entity';
import { Repository } from 'typeorm';
import { CreateUserSkillDto } from '../dtos/create-user-skill.dto';
import { User } from 'src/entities/user.entity';
import { SkillService } from 'src/modules/skill/services/skill.service';
import { FilterUserSkillDto } from '../dtos/filter-user-skill.dto';
import { SortBy, SortType } from 'src/common/enums/sort.enum';

@Injectable()
export class UserSkillService {
  constructor(
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
    private readonly skillService: SkillService,
  ) {}

  async create(user: User, createUserSkillDto: CreateUserSkillDto) {
    const { skillId } = createUserSkillDto;

    const skill = await this.skillService.findById(skillId);

    const userSkill = this.userSkillRepository.create({
      user,
      skill,
    });
    try {
      await this.userSkillRepository.save(userSkill);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create UserSkill: ${error}`,
      );
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
      .where('userSkill.userId = :userId', { userId: user.id });

    if (skillId) {
      queryBuilder.andWhere('skill.id = :skillId', { skillId });
    }

    queryBuilder.orderBy(`userSkill.${sortBy}`, sortType);

    queryBuilder.skip(page * pageSize).take(pageSize);

    return queryBuilder.getMany();
  }
}
