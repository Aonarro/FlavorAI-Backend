import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtUserPayload } from 'src/common/types/jwt.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeResponse } from './types/type';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateRecipeDto,
    user: JwtUserPayload,
  ): Promise<RecipeResponse> {
    const recipe = await this.prisma.recipe.create({
      data: {
        ...dto,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        ingredients: true,
        instructions: true,
        imageUrl: true,
        averageRating: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        ratings: {
          select: {
            value: true,
            userId: true,
          },
        },
      },
    });

    return recipe;
  }

  async findAll(): Promise<RecipeResponse[]> {
    const recipes = await this.prisma.recipe.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        ingredients: true,
        instructions: true,
        imageUrl: true,
        averageRating: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        ratings: {
          select: {
            value: true,
            userId: true,
          },
        },
      },
    });

    return recipes;
  }

  async findOne(id: string): Promise<RecipeResponse> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        ingredients: true,
        instructions: true,
        imageUrl: true,
        averageRating: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        ratings: {
          select: {
            value: true,
            userId: true,
          },
        },
      },
    });

    if (!recipe) throw new NotFoundException('Recipe not found');
    return recipe;
  }

  async findByUser(userId: string): Promise<RecipeResponse[]> {
    const recipes = await this.prisma.recipe.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        ingredients: true,
        instructions: true,
        imageUrl: true,
        averageRating: true,
        createdAt: true,
        updatedAt: true,
        ratings: {
          select: {
            value: true,
            userId: true,
          },
        },
      },
    });

    return recipes;
  }

  async search(query: string): Promise<RecipeResponse[]> {
    return this.prisma.recipe.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        ingredients: true,
        instructions: true,
        imageUrl: true,
        averageRating: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        ratings: {
          select: {
            value: true,
            userId: true,
          },
        },
      },
    });
  }

  async rate(recipeId: string, userId: string, value: number) {
    if (value < 1 || value > 5) {
      throw new BadRequestException('Rating must be between 1 и 5');
    }

    await this.prisma.rating.upsert({
      where: { userId_recipeId: { userId, recipeId } },
      update: { value },
      create: { userId, recipeId, value },
    });

    const ratings = await this.prisma.rating.findMany({
      where: { recipeId },
      select: { value: true, userId: true },
    });

    const averageRating =
      ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length || 0;

    const updatedRecipe = await this.prisma.recipe.update({
      where: { id: recipeId },
      data: { averageRating },
      select: {
        id: true,
        title: true,
        description: true,
        ingredients: true,
        instructions: true,
        imageUrl: true,
        averageRating: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        ratings: {
          select: {
            value: true,
            userId: true,
          },
        },
      },
    });

    const response: RecipeResponse = {
      ...updatedRecipe,
      user: updatedRecipe.user || undefined,
      ratings: updatedRecipe.ratings.map((r) => ({
        value: r.value,
        userId: r.userId,
      })),
    };

    return response;
  }
}
