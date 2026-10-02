import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/db/client';

describe('User CRUD Integration Tests', () => {
  // Reset database before each test run
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  // Disconnect database after all tests complete
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/users (Create)', () => {
    it('should create a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Alice Smith', email: 'alice@example.com', role: 'admin' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe('alice@example.com');
    });

    it('should return 400 on invalid email format', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Alice Smith', email: 'invalid-email-format' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Failure');
    });

    it('should return 409 conflict when creating user with duplicate email', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'Alice Smith', email: 'alice@example.com' });

      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Alice Duplicate', email: 'alice@example.com' });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already exists');
    });
  });

  describe('GET /api/users (List & Filter)', () => {
    beforeEach(async () => {
      await prisma.user.createMany({
        data: [
          { name: 'John Admin', email: 'john@admin.com', role: 'admin' },
          { name: 'Bob User', email: 'bob@user.com', role: 'user' },
          { name: 'Charlie User', email: 'charlie@user.com', role: 'user' },
        ],
      });
    });

    it('should list all users with pagination metadata', async () => {
      const res = await request(app).get('/api/users');

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(3);
      expect(res.body.meta.total).toBe(3);
    });

    it('should filter users by role', async () => {
      const res = await request(app).get('/api/users?role=admin');

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(1);
      expect(res.body.items[0].email).toBe('john@admin.com');
    });

    it('should search users by name or email keyword', async () => {
      const res = await request(app).get('/api/users?search=Charlie');

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(1);
      expect(res.body.items[0].name).toBe('Charlie User');
    });
  });

  describe('GET /api/users/:id (Read Details)', () => {
    it('should return user details for a valid ID', async () => {
      const created = await prisma.user.create({
        data: { name: 'David', email: 'david@example.com' },
      });

      const res = await request(app).get(`/api/users/${created.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(created.id);
    });

    it('should return 404 for a non-existent user ID', async () => {
      const res = await request(app).get('/api/users/non-existent-uuid');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/users/:id (Update)', () => {
    it('should partially update user details', async () => {
      const created = await prisma.user.create({
        data: { name: 'Eve', email: 'eve@example.com', role: 'user' },
      });

      const res = await request(app)
        .patch(`/api/users/${created.id}`)
        .send({ role: 'admin' });

      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe('admin');
      expect(res.body.data.name).toBe('Eve');
    });
  });

  describe('DELETE /api/users/:id (Delete)', () => {
    it('should delete a user and return 204 status', async () => {
      const created = await prisma.user.create({
        data: { name: 'Frank', email: 'frank@example.com' },
      });

      const deleteRes = await request(app).delete(`/api/users/${created.id}`);
      expect(deleteRes.status).toBe(204);

      const fetchRes = await request(app).get(`/api/users/${created.id}`);
      expect(fetchRes.status).toBe(404);
    });
  });
});