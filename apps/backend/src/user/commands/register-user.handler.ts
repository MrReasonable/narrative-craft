import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RegisterUserCommand } from './register-user.command'
import { PrismaService } from '../../prisma/prisma.service'
import { UsernameGeneratorService } from '@user/services/username-generator.service'
import { ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private prisma: PrismaService,
    private usernameGenerator: UsernameGeneratorService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const { email, password } = command

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      throw new ConflictException('Email already exists')
    }

    // Generate a unique username
    const username = await this.usernameGenerator.generateUniqueUsername()

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12) // Increased to 12 rounds for better security

    // Create user
    await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })
  }
}
