import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService, TypeOrmModule],
})
export class RoleModule { }

