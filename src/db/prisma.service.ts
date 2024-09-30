import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaLogging } from "@providers/logger/logging.prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(private readonly prismaLogging: PrismaLogging) {
        super();
        this.$use(prismaLogging.logQuery);
    }
    async onModuleInit() {
        await this.$connect();
    }
}