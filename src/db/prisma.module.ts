import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaLogging } from "@providers/logger/logging.prisma";

@Global()
@Module({
    providers: [PrismaService, PrismaLogging],
    exports: [PrismaService],
})
export class PrismaModule {}
