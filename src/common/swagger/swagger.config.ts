import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
export function configSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle("Project Management API DOCS")
        .setDescription("Project management API description")
        .setVersion("1.0")
        .build();
		
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-doc", app, document);
}
