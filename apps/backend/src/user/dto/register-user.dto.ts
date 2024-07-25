import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsStrongPassword } from 'class-validator'

export class RegisterUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user (must be unique)',
  })
  @IsEmail()
  public readonly email: string

  @ApiProperty({
    example: 'Password123!',
    description:
      'The password of the user. Must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  public readonly password: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }
}
