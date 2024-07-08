import Card from "./tailus-ui/card";
import { Button } from "./tailus-ui/button";
import { Text } from "@/tailus-ui/typography/text";
import { Link } from "@/tailus-ui/typography/link";
import { Caption } from "@/tailus-ui/typography/caption";
import { Title } from "@/tailus-ui/typography/title";

import Input from "@/tailus-ui/input";
import Label from "@/tailus-ui/label";
import Separator from "@/tailus-ui/separator";
import { ComponentProps } from "react";

export function LoginForm() {
    return (
        <Card
            className="relative h-fit p-1 shadow-xl shadow-gray-950/10"
            variant="mixed"
        >
            <div data-rounded="large" className="p-10">
                <div>
                    <Title size="xl" className="mb-1">
                        Sign In to Tailus UI
                    </Title>
                    <Text className="my-0" size="sm">
                        Welcome back! Sign in to continue
                    </Text>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button.Root
                        variant="outlined"
                        intent="gray"
                        size="sm"
                        className="w-full"
                    >
                        <Button.Icon type="leading" size="xs">
                            <GoogleIcon />
                        </Button.Icon>
                        <Button.Label>Github</Button.Label>
                    </Button.Root>
                    <Button.Root
                        variant="outlined"
                        intent="gray"
                        size="sm"
                        className="w-full"
                    >
                        <Button.Icon type="leading" size="xs">
                            <MicrosoftIcon />
                        </Button.Icon>
                        <Button.Label>Microsoft</Button.Label>
                    </Button.Root>
                </div>

                <form className="mx-auto mt-8 space-y-6">
                    <div className="space-y-6 rounded-[--btn-radius] shadow-sm shadow-gray-500/5">
                        <div className="relative my-6 grid items-center gap-3 [grid-template-columns:1fr_auto_1fr]">
                            <Separator className="h-px border-b" />
                            <Caption as="span" className="block" size="sm">
                                Or continue with
                            </Caption>
                            <Separator className="h-px border-b" />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2.5">
                                <Label size="sm" htmlFor="email">
                                    Your email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    variant="outlined"
                                    size="md"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <Label size="sm" htmlFor="password">
                                        Password
                                    </Label>
                                    <Link href="#" size="sm">
                                        Forgot your Password ?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    variant="outlined"
                                    size="md"
                                />
                            </div>
                        </div>
                    </div>

                    <Button.Root className="w-full">
                        <Button.Label>Sign In</Button.Label>
                    </Button.Root>
                </form>
            </div>
            <Card
                variant="soft"
                data-shade="925"
                className="rounded-[calc(var(--card-radius)-0.25rem)] dark:bg-gray-925"
            >
                <Caption className="my-0" size="sm" align="center">
                    Don't have an account ?{" "}
                    <Link
                        intent="neutral"
                        size="sm"
                        variant="underlined"
                        href="/examples/forms/register1"
                    >
                        Create account
                    </Link>
                </Caption>
            </Card>
        </Card>
    );
}

const GoogleIcon = (props: ComponentProps<"svg">) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
        <path
            fill="#ffc107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
        ></path>
        <path
            fill="#ff3d00"
            d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
        ></path>
        <path
            fill="#4caf50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
        ></path>
        <path
            fill="#1976d2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
        ></path>
    </svg>
);
const MicrosoftIcon = (props: ComponentProps<"svg">) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z"></path>
        <path fill="#80cc28" d="M256 121.666H134.335V0H256z"></path>
        <path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z"></path>
        <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z"></path>
    </svg>
);
