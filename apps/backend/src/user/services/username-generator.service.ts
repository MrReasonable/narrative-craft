import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { generateUsername } from 'unique-username-generator'

@Injectable()
export class UsernameGeneratorService {
  constructor(private prisma: PrismaService) {}

  async generateUniqueUsername(): Promise<string> {
    let username = ''
    let isUnique = false

    while (!isUnique) {
      username = generateUsername('-', 2, 20)
      const existingUser = await this.prisma.user.findUnique({ where: { username } })
      isUnique = !existingUser
    }

    return username
  }
}
