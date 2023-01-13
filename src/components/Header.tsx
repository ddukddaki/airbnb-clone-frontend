import {
    Box,
    Button,
    HStack,
    IconButton,
    LightMode,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    Stack,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast,
    ToastId,
} from "@chakra-ui/react";
import LoginModal from "./LoginModal";
import { FaAirbnb, FaMoon, FaSun } from "react-icons/fa";
import SignUpModal from "./SignUpModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUser from "../lib/useUser";
import { logOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export default function Header() {
    const { userLoading, isLoggedIn, user } = useUser();
    const location = useLocation().pathname;
    const {
        isOpen: isLoginOpen,
        onClose: onLoginClose,
        onOpen: OnLoginOpen,
    } = useDisclosure();
    const {
        isOpen: isSignUpOpen,
        onClose: onSignUpClose,
        onOpen: OnSignUpOpen,
    } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const logoColor = useColorModeValue("red.500", "red.200");
    const Icon = useColorModeValue(FaMoon, FaSun);
    const toast = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const toastId = useRef<ToastId>();
    const mutation = useMutation(logOut, {
        onMutate: () => {
            toastId.current = toast({
                title: "Login out",
                description: "Sad to see you go...",
                status: "loading",
            });
        },
        onSuccess: () => {
            if (toastId.current) {
                toast.update(toastId.current, {
                    status: "success",
                    title: "Done!",
                    description: "See you later!",
                });
            }
            queryClient.refetchQueries(["me"]);
            queryClient.refetchQueries(["rooms"]);
            navigate("/");
        },
    });

    const onLogOut = async () => {
        mutation.mutate();
    };
    return (
        <Stack
            justifyContent={"space-between"}
            py={5}
            px={location === "/" ? 40 : 80}
            alignItems="center"
            direction={{
                sm: "column",
                md: "row",
            }}
            spacing={{
                sm: 4,
                md: 0,
            }}
            borderBottomWidth={1}
        >
            <Link to={"/"}>
                <Box color={logoColor}>
                    <FaAirbnb size={"48"} />
                </Box>
            </Link>
            <HStack>
                <IconButton
                    onClick={toggleColorMode}
                    variant={"ghost"}
                    aria-label="Toggle dark mode"
                    icon={<Icon />}
                />
                {!userLoading ? (
                    !isLoggedIn ? (
                        <>
                            <Button onClick={OnLoginOpen}>Log in</Button>
                            <LightMode>
                                <Button onClick={OnSignUpOpen} colorScheme={"red"}>
                                    Sign up
                                </Button>
                            </LightMode>
                        </>
                    ) : (
                        <Menu>
                            <MenuButton>
                                <Avatar name={user?.name} size={"md"} src={user?.avatar} />
                            </MenuButton>
                            <MenuList>
                                {user?.is_host ? (
                                    <>
                                        <Link to="/manage-bookings">
                                            <MenuItem>Manage bookings</MenuItem>
                                        </Link>
                                        <Link to="/rooms/upload">
                                            <MenuItem>Upload room</MenuItem>
                                        </Link>
                                    </>
                                ) : null}
                                <Link to="/mybookings">
                                    <MenuItem>My bookings</MenuItem>
                                </Link>
                                <MenuItem onClick={onLogOut}>Log out</MenuItem>
                            </MenuList>
                        </Menu>
                    )
                ) : null}
            </HStack>
            <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
            <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
        </Stack>
    );
}