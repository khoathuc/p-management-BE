import { Injectable } from "@nestjs/common";
import { User, Workspace } from "@prisma/base";

@Injectable()
export class ContextService {
    private user: User;
    private workspace: Workspace;

    setUser(user: User) {
        this.user = user;
        return this;
    }

    getUser() {
        return this.user;
    }

    setWorkspace(workspace: Workspace) {
        this.workspace = workspace;
        return this;
    }

    getWorkspace() {
        return this.workspace;
    }
}
