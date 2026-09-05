import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Unit test tidak perlu memuat Prisma Client atau membuka koneksi database.
jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtSign: jest.Mock;
  let userFindUnique: jest.Mock;
  let userUpdate: jest.Mock;

  beforeEach(async () => {
    jwtSign = jest
      .fn()
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');
    userFindUnique = jest.fn();
    userUpdate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jwtSign,
            signAsync: jest.fn(),
            verify: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: userFindUnique,
              create: jest.fn(),
              update: userUpdate,
            },
            profile: {
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the user profile after a successful login', async () => {
    const password = await bcrypt.hash('correct-password', 10);
    const profile = {
      id: 'profile-1',
      userId: 'user-1',
      bio: 'Coffee lover',
    };

    userFindUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
      password,
      provider: 'LOCAL',
    });
    userUpdate.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
      profile,
    });

    await expect(
      service.login({
        email: 'USER@example.com',
        password: 'correct-password',
      }),
    ).resolves.toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: 'user-1', profile },
    });

    expect(userUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        select: {
          id: true,
          email: true,
          name: true,
          profile: true,
        },
      }),
    );
  });

  it('rotates refresh tokens without loading or returning the profile', async () => {
    const hashedRefreshToken = await bcrypt.hash('old-refresh-token', 10);
    userFindUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
      hashedRt: hashedRefreshToken,
    });
    userUpdate.mockResolvedValue({ id: 'user-1' });

    await expect(
      service.refreshTokens('user-1', 'old-refresh-token'),
    ).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    expect(userUpdate).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { hashedRt: expect.any(String) },
    });
  });
});
