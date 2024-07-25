import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { generateUsername } from 'unique-username-generator'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserModelExtension {
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  extend = Prisma.defineExtension((client) =>
    client.$extends({
      model: {
        user: {
          async generateUniqueUsername(): Promise<string> {
            let username = ''
            let isUnique = false

            while (!isUnique) {
              username = generateUsername('-', 2, 20)
              const existingUser = await this.user.findUnique({ where: { username } })
              isUnique = !existingUser
            }

            return username
          },
          async create({ data, ...arguments_ }: Prisma.UserCreateArgs): Promise<User> {
            const { password } = data
            const hashedPassword = await this.hashPassword(password)
            return this.user.create({ data: { ...data, password: hashedPassword }, ...arguments_ })
          },
          async update({ data, ...arguments_ }: Prisma.UserUpdateArgs) {
            if (data.password) {
              data.password = await this.hashPassword(data.password)
            }
            return client.user.update({ data, ...arguments_ })
          },
        },
      },
    }),
  )
}
