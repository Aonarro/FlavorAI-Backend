import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtUserPayload } from 'src/common/types/jwt.type';

@Controller('recipes')
export class RecipesController {
  constructor(private recipeService: RecipesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRecipeDto, @User() user: JwtUserPayload) {
    return this.recipeService.create(dto, user);
  }

  @Get()
  findAll() {
    return this.recipeService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.recipeService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/list')
  findMyRecipes(@User() user: JwtUserPayload) {
    return this.recipeService.findByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/rate')
  rate(
    @Param('id') recipeId: string,
    @Body('value') value: number,
    @User() user: JwtUserPayload,
  ) {
    return this.recipeService.rate(recipeId, user.id, value);
  }
}
