import {
    Box,
    Button,
    Grid,
    HStack,
    Image,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaCamera, FaPencilAlt, FaRegHeart, FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

interface IRoomProps {
    imageUrl: string;
    rating: number;
    price: number;
    description: string;
    category: string;
    pk: number;
    isOwner: boolean;
}

export default function Room({
    imageUrl,
    rating,
    price,
    description,
    category,
    pk,
    isOwner,
}: IRoomProps) {
    const gray = useColorModeValue("gray.600", "gray.300");
    const navigate = useNavigate();
    const onCameraClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate(`/rooms/${pk}/photos`);
    };
    const onPencilClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate(`/rooms/${pk}/modify`);
        window.location.reload();
    };
    return (
        <Link to={`/rooms/${pk}`}>
            <VStack
                spacing={-0.3}
                alignItems={{
                    sm: "center",
                    md: "flex-start",
                }}
            >
                <Box w={"100%"}>
                    <Box position={"relative"} rounded="2xl" overflow={"hidden"} mb={3}>
                        {imageUrl !== undefined ? (
                            <Image h={240} w={"100%"} src={imageUrl} objectFit={"cover"} />
                        ) : (
                            <Box
                                backgroundColor={"gray.400"}
                                w={"100%"}
                                h={240}
                                display={"flex"}
                                justifyContent="center"
                                alignItems={"center"}
                            >
                                <Text fontSize={"20px"} as={"b"} color={"white"}>
                                    No Image
                                </Text>
                            </Box>
                        )}
                        {isOwner ? (
                            <Box>
                                <Button
                                    variant={"unstyled"}
                                    position={"absolute"}
                                    top={0}
                                    right={10}
                                    color="white"
                                    onClick={onPencilClick}
                                >
                                    <FaPencilAlt size="20px" />
                                </Button>
                                <Button
                                    variant={"unstyled"}
                                    position={"absolute"}
                                    top={0}
                                    right={0}
                                    color="white"
                                    onClick={onCameraClick}
                                >
                                    <FaCamera size="20px" />
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                variant={"unstyled"}
                                position={"absolute"}
                                top={0}
                                right={0}
                                color="white"
                            >
                                <FaRegHeart size="20px" />
                            </Button>
                        )}
                    </Box>
                    <Box w={"100%"}>
                        <Grid gap={2} templateColumns={"6fr 1fr"}>
                            <Text as={"b"} noOfLines={1} fontSize="md">
                                {description}
                            </Text>
                            <HStack spacing={1}>
                                <FaStar size={15} />
                                <Text>{rating}</Text>
                            </HStack>
                        </Grid>
                        <Text fontSize={"sm"} color={gray}>
                            {category}
                        </Text>
                    </Box>
                    <Text fontSize={"sm"} color={gray}>
                        <Text as="b">₩{price}</Text> / 박
                    </Text>
                </Box>
            </VStack>
        </Link>
    );
}