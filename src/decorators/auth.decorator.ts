import { createParamDecorator, ExecutionContext } from "@nestjs/common";

const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session.user;
})

export default AuthUser;