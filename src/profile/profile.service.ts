import { Injectable, NotFoundException } from '@nestjs/common';
import { AvatarSource } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { removeSingleFile } from '../common/utils/remove-file';
import {
  CreateProfileDto,
  ReadProfileDto,
  UpdateProfileDto,
} from './dto/profile.dto';

const PROFILE_UPLOAD_PATH = './uploads/profile';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateProfileDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    const acceptedFile = await this.resolveAcceptedFile(existingProfile, file);
    const { file: _file, ...profileData } = dto;

    try {
      const profile = await this.prisma.profile.upsert({
        where: { userId },
        create: {
          ...profileData,
          userId,
          ...(acceptedFile
            ? {
                avatarUrl: acceptedFile.filename,
                avatarSource: AvatarSource.LOCAL,
              }
            : {}),
        },
        update: {
          ...profileData,
          ...(acceptedFile
            ? {
                avatarUrl: acceptedFile.filename,
                avatarSource: AvatarSource.LOCAL,
              }
            : {}),
        },
      });

      await this.removeReplacedLocalAvatar(existingProfile, acceptedFile);
      return profile;
    } catch (error) {
      if (acceptedFile) await removeSingleFile(acceptedFile.path);
      throw error;
    }
  }

  async findAll(query: ReadProfileDto) {
    const skip = query?.skip ?? 0;
    const limit = query?.limit ?? 100;
    const where = query?.search
      ? {
          OR: [
            { bio: { contains: query.search } },
            { phone: { contains: query.search } },
            { address: { contains: query.search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.profile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.profile.count({ where }),
    ]);

    return { total, skip, limit, data };
  }

  async findCurrent(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile pengguna belum tersedia');
    }

    return profile;
  }

  async findOne(id: string, userId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: { id, userId },
    });

    if (!profile) {
      throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
    }
    return profile;
  }

  async update(
    id: string,
    dto: UpdateProfileDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const existingProfile = await this.prisma.profile.findFirst({
      where: { id, userId },
    });

    if (!existingProfile) {
      if (file) await removeSingleFile(file.path);
      throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
    }

    const acceptedFile = await this.resolveAcceptedFile(existingProfile, file);
    const { file: _file, ...profileData } = dto;

    try {
      const profile = await this.prisma.profile.update({
        where: { id },
        data: {
          ...profileData,
          ...(acceptedFile
            ? {
                avatarUrl: acceptedFile.filename,
                avatarSource: AvatarSource.LOCAL,
              }
            : {}),
        },
      });

      await this.removeReplacedLocalAvatar(existingProfile, acceptedFile);
      return profile;
    } catch (error) {
      if (acceptedFile) await removeSingleFile(acceptedFile.path);
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: { id, userId },
    });

    if (!profile) {
      throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
    }

    await this.prisma.profile.delete({ where: { id } });

    if (profile.avatarSource === AvatarSource.LOCAL && profile.avatarUrl) {
      await removeSingleFile(`${PROFILE_UPLOAD_PATH}/${profile.avatarUrl}`);
    }

    return { message: `Data dengan id : ${id} berhasil dihapus..!` };
  }

  private async resolveAcceptedFile(
    profile: { avatarSource: AvatarSource | null } | null,
    file?: Express.Multer.File,
  ) {
    if (!file) return undefined;

    if (profile?.avatarSource && profile.avatarSource !== AvatarSource.LOCAL) {
      await removeSingleFile(file.path);
      return undefined;
    }

    return file;
  }

  private async removeReplacedLocalAvatar(
    profile: {
      avatarSource: AvatarSource | null;
      avatarUrl: string | null;
    } | null,
    acceptedFile?: Express.Multer.File,
  ) {
    if (
      acceptedFile &&
      profile?.avatarSource === AvatarSource.LOCAL &&
      profile.avatarUrl
    ) {
      await removeSingleFile(`${PROFILE_UPLOAD_PATH}/${profile.avatarUrl}`);
    }
  }
}
