import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, RecipesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
