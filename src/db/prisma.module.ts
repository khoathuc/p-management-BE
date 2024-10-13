import { Global, Module } from "@nestjs/common";
import { PrismaBaseService } from "./prisma.base.service";
import { PrismaPmanagerService } from "./prisma.pmanager.service";

@Global()
@Module({
    providers: [PrismaBaseService, PrismaPmanagerService],
    exports: [PrismaBaseService, PrismaPmanagerService],
})
export class PrismaModule {}
