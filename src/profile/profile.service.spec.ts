import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('ProfileService', () => {
  let service: ProfileService;
  let findUnique: jest.Mock;

  beforeEach(async () => {
    findUnique = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: {
            profile: { findUnique },
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the profile that belongs to the authenticated user', async () => {
    const profile = { id: 'profile-1', userId: 'user-1' };
    findUnique.mockResolvedValue(profile);

    await expect(service.findCurrent('user-1')).resolves.toEqual(profile);
    expect(findUnique).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    });
  });
});
