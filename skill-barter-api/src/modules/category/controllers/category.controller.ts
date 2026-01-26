import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { FilterCategoryDto } from '../dtos/filter-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCategories(@Query() filterCategoryDto: FilterCategoryDto) {
    return this.categoryService.getCategories(filterCategoryDto);
  }
}
