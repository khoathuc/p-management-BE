// mail.service.ts
import * as nodemailer from "nodemailer";
import { Injectable } from "@nestjs/common";
import { render } from "@react-email/components";

type EmailProps = {
    from?: string;
    to: string;
    subject: string;
    template?: string;
    html?:string;
    text?: string;
};

@Injectable()
export class EmailService {
    // Setup Nodemailer transporter
    private _transporter;

    constructor() {
        this._transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST as string, // Ensure the type is string
            port: parseInt(process.env.SMTP_PORT as string, 10), // Convert port to a number
            auth: {
                user: process.env.SMTP_USER as string, // Ensure the type is string
                pass: process.env.SMTP_PASSWORD as string, // Ensure the type is string
            },
        });
    }

    /**
     * @desc check if email is enabled
     * @returns 
     */
    isEnable = () => {
        return process.env.SMTP_HOST;
    };


    /**
     * @desc generate email from template
     * @param template 
     * @returns 
     */
    private async generateEmail(template) {
        return await render(template);
    }


    /**
     * @desc send email
     * @param {EmailProps} options
     * @returns 
     */
    async sendEmail(options: EmailProps) {
        if (!this.isEnable()) {
            return;
        }

        let html = "";
        if(options.template){
            html = await this.generateEmail(options.template);
        }
        if(options.html){
            html = options.html;
        }
        

        const emailDefaults = {
            from: process.env.SMTP_FROM,
        };

        await this._transporter.sendMail({
            ...emailDefaults,
            ...options,
            html,
        });
    }
}