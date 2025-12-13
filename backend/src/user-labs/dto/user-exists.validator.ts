import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/users/user.entity";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@Injectable()
@ValidatorConstraint({ async: true })
export class UserExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async validate(userId: number, args: ValidationArguments) {
    if (!userId) return false;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return !!user;
  }

  defaultMessage(args: ValidationArguments) {
    return "User with id '$value' does not exist.";
  }
}