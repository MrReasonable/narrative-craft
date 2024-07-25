import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { RegisterUserCommand } from './commands/register-user.command'
import { CommandBus } from '@nestjs/cqrs'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const command = new RegisterUserCommand(registerUserDto.email, registerUserDto.password)

    await this.commandBus.execute(command)
    return { message: 'User registered successfully' }
  }
}
