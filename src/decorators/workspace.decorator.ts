import { createParamDecorator, ExecutionContext } from "@nestjs/common";

const CurrentWorkspace = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session.workspace;
})

export default CurrentWorkspace;