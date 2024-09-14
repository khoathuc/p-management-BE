import { UnsupportedMediaTypeException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import { extname } from "path";

export function getMulterOptions(
    destination: string, 
    fileSizeLimit: number, 
    mimetypes: string[]
  ): MulterOptions {
    return {
      storage: diskStorage({
        // The destination for uploaded files
        destination: destination,

        // The name of the uploaded file
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
      }),

      limits: {
        // The max file size
        fileSize: fileSizeLimit,
      },

      // Ensure file type is valid
      fileFilter: (req, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (mimetypes.some((m) => file.mimetype.includes(m))) {
          callback(null, true);
        } else {
          callback(
            new UnsupportedMediaTypeException(
              `File type is not matching: ${mimetypes.join(', ')}`
            ),
            false
          );
        }
      },
    };
  }