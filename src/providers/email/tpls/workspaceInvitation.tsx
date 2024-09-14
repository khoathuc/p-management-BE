import * as React from 'react';
import { Button, Section, Heading, Text } from "@react-email/components";
import EmailLayout from "./layout";

interface workspaceInvitationProps {
    inviterEmail: string;
    workspaceName: string;
    link: string;
}

export default function workspaceInvitation({
    workspaceName,
    link,
}: workspaceInvitationProps) {
    return (
        <EmailLayout>
            <Section className="text-center">
                <Text>
                    You have been invited to join your team in the Workspace
                </Text>
                <Heading as="h2">{workspaceName}</Heading>
                <Text>
                    You can now collaborate with others in this Workspace
                </Text>
                <Button
                    href={link}
                    className="mt-[16px] rounded-[8px] bg-brand px-[40px] py-[12px] font-semibold text-white"
                >
                    Access Workspace
                </Button>
            </Section>
        </EmailLayout>
    );
}
