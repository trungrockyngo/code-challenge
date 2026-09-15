import { PrismaClient, User, Prisma } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO, UserFilters } from '../models/user.schema';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserDTO): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async findAll(filters: UserFilters) {
    const { role, search, page, limit } = filters;
    const skip = (page - 1) * limit;

    // Build standard Prisma filter object dynamically
    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit },
    };
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }
}