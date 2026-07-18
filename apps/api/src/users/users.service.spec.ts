import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock, createMockUser } from '@valorasec/test-utils';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const moduleFixture = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleFixture.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── getProfile ────────────────────────────────────────────────────────

  describe('getProfile', () => {
    it('should return user profile without password hash', async () => {
      const mockUser = createMockUser();
      // Explicitly omit passwordHash from the resolved mock
      const safeUser: Record<string, unknown> = { ...mockUser };
      delete safeUser.passwordHash;
      prisma.user.findUnique.mockResolvedValue(safeUser);

      const result = await service.getProfile('user-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@valorasec.dev');
      expect((result as Record<string, unknown>).passwordHash).toBeUndefined();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('non-existent')).rejects.toThrow(NotFoundException);
      await expect(service.getProfile('non-existent')).rejects.toThrow('User not found');
    });
  });

  // ─── updateProfile ─────────────────────────────────────────────────────

  describe('updateProfile', () => {
    it('should update and return user name', async () => {
      const updatedUser = createMockUser({ name: 'Updated Name' });
      const safeUser: Record<string, unknown> = { ...updatedUser };
      delete safeUser.passwordHash;
      prisma.user.update.mockResolvedValue(safeUser);

      const result = await service.updateProfile('user-1', {
        name: 'Updated Name',
      });

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Name');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { name: 'Updated Name' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should update and return user avatar', async () => {
      const updatedUser = createMockUser({ avatarUrl: 'https://example.com/avatar.png' });
      const safeUser: Record<string, unknown> = { ...updatedUser };
      delete safeUser.passwordHash;
      prisma.user.update.mockResolvedValue(safeUser);

      const result = await service.updateProfile('user-1', {
        avatarUrl: 'https://example.com/avatar.png',
      });

      expect(result.avatarUrl).toBe('https://example.com/avatar.png');
    });

    it('should update both name and avatarUrl', async () => {
      const updatedUser = createMockUser({
        name: 'New Name',
        avatarUrl: 'https://example.com/photo.jpg',
      });
      const safeUser: Record<string, unknown> = { ...updatedUser };
      delete safeUser.passwordHash;
      prisma.user.update.mockResolvedValue(safeUser);

      const result = await service.updateProfile('user-1', {
        name: 'New Name',
        avatarUrl: 'https://example.com/photo.jpg',
      });

      expect(result.name).toBe('New Name');
      expect(result.avatarUrl).toBe('https://example.com/photo.jpg');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { name: 'New Name', avatarUrl: 'https://example.com/photo.jpg' },
        select: expect.any(Object),
      });
    });
  });
});
