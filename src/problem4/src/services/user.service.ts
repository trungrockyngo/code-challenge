import { UserRepository } from '../repositories/user.repository';
import { 
  CreateUserSchema, 
  UpdateUserSchema, 
  UserFilterSchema 
} from '../models/user.schema';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(input: unknown) {
    const validatedData = CreateUserSchema.parse(input);
    try {
      return await this.userRepository.create(validatedData);
    } catch (error: any) {
      // P2002 is Prisma's unique constraint violation code
      if (error.code === 'P2002') {
        throw new ConflictError(`User with email '${validatedData.email}' already exists.`);
      }
      throw error;
    }
  }

  async listUsers(rawFilters: unknown) {
    const validatedFilters = UserFilterSchema.parse(rawFilters);
    return await this.userRepository.findAll(validatedFilters);
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID '${id}' not found.`);
    }
    return user;
  }

  async updateUser(id: string, input: unknown) {
    const validatedData = UpdateUserSchema.parse(input);
    await this.getUserById(id); // Ensures entity exists
    return await this.userRepository.update(id, validatedData);
  }

  async deleteUser(id: string) {
    await this.getUserById(id); // Ensures entity exists
    await this.userRepository.delete(id);
  }
}