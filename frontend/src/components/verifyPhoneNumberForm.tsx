import React, { useState, useEffect } from "react";
import {
    Container,
    Button,
    Input,
    Stack,
    FormControl,
    InputGroup,
    InputLeftElement,
    Text,
    FormErrorMessage,
    Icon,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { smsCodePattern } from "@/utils";
import { LockIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

type FormData = {
    smsCode: string;
};

type VerifyPhoneNumberFormProps = {
    context: "register" | "resetPassword";
    phoneNumber: string | null;
};

const VerifyPhoneNumberForm: React.FC<VerifyPhoneNumberFormProps> = ({ context, phoneNumber }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(30);
    const router = useRouter();

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isButtonDisabled) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(interval!);
                        setIsButtonDisabled(false);
                        return 30;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isButtonDisabled]);

    const handleSendNewCode = () => {
        setIsButtonDisabled(true);
        // Logika wysyłania nowego kodu
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        // Logika weryfikacji kodu
        console.log(data);
        if (context === "register") {
            router.push("/auth/login");
        } else if (context === "resetPassword" && phoneNumber) {
            router.push(`/auth/set-new-password?phoneNumber=${phoneNumber}`);
        }
    };

    return (
        <Container as="form" maxW="sm" onSubmit={handleSubmit(onSubmit)}>
            <Stack
                gap={4}
                rounded="md"
                p={4}
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
            >
                <Text fontSize="xl" textAlign="center">Enter verification code we sent to your mobile</Text>
                <FormControl isInvalid={!!errors.smsCode}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <LockIcon color="gray.400" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Code"
                            aria-label="Code"
                            {...register("smsCode", {
                                required: "SMS code is required",
                                pattern: smsCodePattern,
                            })}
                        />
                    </InputGroup>
                    <FormErrorMessage>{errors.smsCode && errors.smsCode.message}</FormErrorMessage>
                </FormControl>
                <Button
                    variant="solid"
                    onClick={handleSendNewCode}
                    isDisabled={isButtonDisabled}
                    border="1px"
                >
                    {isButtonDisabled ? `Send new code (${timer}s)` : "Send new code"}
                </Button>
                <Button type="submit" variant="solid" border="1px">
                    Verify code
                </Button>
            </Stack>
        </Container>
    );
};

export default VerifyPhoneNumberForm;