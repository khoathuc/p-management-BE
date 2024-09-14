import { ReactNode } from "react";
import * as React from 'react';
import {
    Body,
    Container,
    Hr,
    Html,
    Link,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

interface EmailLayoutProps {
    children?: ReactNode;
}

const EmailLayout = ({ children }: EmailLayoutProps) => {
    return (
        <Html>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#25c2a0",
                            },
                        },
                    },
                }}
            >
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid bg-white border-[#f0f0f0] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section>{children}</Section>
                        <Section>
                            <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />
                            <Text className="my-0 text-center text-xs text-[#666666]">
                                <Link className="block">
                                    &reg; P Management
                                </Link>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default EmailLayout;
