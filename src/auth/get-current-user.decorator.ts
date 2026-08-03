import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract user information from the request object.
 * The user object is attached by Passport's authentication strategies.
 *
 * @example
 * // To get the entire user payload:
 * @GetCurrentUser() user: PayloadType
 *
 * // To get a specific property from the payload (e.g., 'sub' or 'refreshToken'):
 * @GetCurrentUser('sub') userId: string
 */
export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // If a specific property (data) is requested, return it. Otherwise, return the whole user object.
    return data ? request.user?.[data] : request.user;
  },
);