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
  let userCreate: jest.Mock;
  let userUpdate: jest.Mock;

  beforeEach(async () => {
    jwtSign = jest
      .fn()
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');
    userFindUnique = jest.fn();
    userCreate = jest.fn();
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
              create: userCreate,
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

  it('stores the registrant name in profile instead of user', async () => {
    userFindUnique.mockResolvedValue(null);
    userCreate.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });
    userUpdate.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });

    await service.register({
      email: 'USER@example.com',
      name: ' User Name ',
      password: 'secret12',
      passwordConfirmation: 'secret12',
    });

    expect(userCreate).toHaveBeenCalledWith({
      data: {
        email: 'user@example.com',
        password: expect.any(String),
        provider: 'LOCAL',
        profile: {
          create: {
            name: 'User Name',
          },
        },
      },
    });
  });

  it('returns safe account fields without profile after a successful login', async () => {
    const password = await bcrypt.hash('correct-password', 10);

    userFindUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password,
      provider: 'LOCAL',
    });
    userUpdate.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });

    await expect(
      service.login({
        email: 'USER@example.com',
        password: 'correct-password',
      }),
    ).resolves.toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    });

    expect(userUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        select: {
          id: true,
          email: true,
        },
      }),
    );
  });

  it('rotates refresh tokens without loading or returning the profile', async () => {
    const hashedRefreshToken = await bcrypt.hash('old-refresh-token', 10);
    userFindUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
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
