
import { SetMetadata } from '@nestjs/common';

// Key penanda metadata untuk endpoint publik
export const IS_PUBLIC_KEY = 'isPublic';

// Decorator custom @Public()
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);