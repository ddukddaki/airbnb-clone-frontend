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
import { FaUserNinja, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
    QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    IUsernameLoginError,
    IUsernameLoginSuccess,
    IUsernameLoginVariables,
    usernameLogIn,
} from "../api";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IForm {
    username: string;
    password: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IForm>();
    const toast = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        IUsernameLoginSuccess,
        IUsernameLoginError,
        IUsernameLoginVariables
    >(usernameLogIn, {
        onMutate: () => {
            console.log("mutation starting");
        },
        onSuccess: (data) => {
            toast({
                title: "Welcome back!",
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
    const onSubmit = ({ username, password }: IForm) => {
        mutation.mutate({ username, password });
    };
    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Log in</ModalHeader>
                <ModalCloseButton />
                <ModalBody as={"form"} onSubmit={handleSubmit(onSubmit)}>
                    <VStack>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color={"gray.500"}>
                                        <FaUserNinja />
                                    </Box>
                                }
                            ></InputLeftElement>
                            <Input
                                isInvalid={Boolean(errors.username?.message)}
                                required
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
                                isInvalid={Boolean(errors.password?.message)}
                                required
                                {...register("password", { required: true })}
                                variant={"filled"}
                                placeholder="Password"
                                type={"password"}
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
                        Log in
                    </Button>
                    {mutation.isError ? (
                        <Text color={"red.500"} textAlign="center" fontSize={"sm"} mt={5}>
                            Username or Password are wrong
                        </Text>
                    ) : null}
                    <SocialLogin />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}