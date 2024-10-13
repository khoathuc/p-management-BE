import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient as PrismaPmanager } from "../../prisma/generated/pmanager";

@Injectable()
export class PrismaPmanagerService extends PrismaPmanager implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}