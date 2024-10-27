import { User, Workspace } from "@prisma/base";

declare module 'express-session' {
  interface SessionData {
    user: User;
    workspace: Workspace;
  }
}