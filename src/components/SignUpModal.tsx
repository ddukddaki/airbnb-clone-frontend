import {
    Box,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import SocialLogin from "./SocialLogin";
import {
    FaUserNinja,
    FaLock,
    FaEnvelope,
    FaUserSecret,
    FaCheck,
    FaPhone,
} from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "../api";
import { useForm } from "react-hook-form";

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}
interface IForm {
    name: string;
    phone_nb: string;
    email: string;
    username: string;
    password: string;
    password_check: string;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IForm>();
    const toast = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation(signUp, {
        onMutate: () => {
            console.log("mutation stating");
        },
        onSuccess: (data) => {
            toast({
                title: "Welcome!",
                status: "success",
            });
            onClose();
            reset();
            queryClient.refetchQueries(["me"]);
        },
        onError: (error) => {
            console.log("mutation has an error");
        },
    });
    const onSubmit = ({
        name,
        phone_nb,
        email,
        username,
        password,
        password_check,
    }: IForm) => {
        mutation.mutate({
            name,
            phone_nb,
            email,
            username,
            password,
            password_check,
        });
    };
    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sign up</ModalHeader>
                <ModalCloseButton />
                <ModalBody as={"form"} onSubmit={handleSubmit(onSubmit)}>
                    <VStack>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color={"gray.500"}>
                                        <FaUserSecret />
                                    </Box>
                                }
                            ></InputLeftElement>
                            <Input
                                {...register("name", { required: true })}
                                variant={"filled"}
                                placeholder="Name"
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color={"gray.500"}>
                                        <FaPhone />
                                    </Box>
                                }
                            ></InputLeftElement>
                            <Input
                                {...register("phone_nb", { required: true })}
                                variant={"filled"}
                                placeholder="Phone Number"
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color={"gray.500"}>
                                        <FaEnvelope />
                                    </Box>
                                }
                            ></InputLeftElement>
                            <Input
                                {...register("email", { required: true })}
                                variant={"filled"}
                                placeholder="Email"
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color={"gray.500"}>
                                        <FaUserNinja />
                                    </Box>
                                }
                            ></InputLeftElement>
                            <Input
                                {...register("username", { required: true })}
                                variant={"filled"}
                                placeholder="Username"
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color={"gray.500"}>
                                        <FaLock />
                                    </Box>
                                }
                            ></InputLeftElement>
                            <Input
                                {...register("password", { required: true })}
                                type={"password"}
                                variant={"filled"}
                                placeholder="Password"
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color={"gray.500"}>
                                        <FaCheck />
                                    </Box>
                                }
                            ></InputLeftElement>
                            <Input
                                {...register("password_check", { required: true })}
                                type={"password"}
                                variant={"filled"}
                                placeholder="Password Check"
                            />
                        </InputGroup>
                    </VStack>
                    <Button
                        isLoading={mutation.isLoading}
                        type="submit"
                        marginTop={4}
                        colorScheme={"red"}
                        w="100%"
                    >
                        Sign up
                    </Button>
                    {mutation.isError ? (
                        <Text color={"red.500"} textAlign="center" fontSize={"sm"} mt={5}>
                            Check your email or password
                        </Text>
                    ) : null}
                    <SocialLogin />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
