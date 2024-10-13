import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient as PrismaBase } from "../../prisma/generated/base";

@Injectable()
export class PrismaBaseService extends PrismaBase implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}