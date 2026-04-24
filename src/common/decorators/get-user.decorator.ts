import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Si pasamos un argumento (ej: @GetUser('id')), devolvemos solo esa propiedad
    return data ? user?.[data] : user;
  },
);
