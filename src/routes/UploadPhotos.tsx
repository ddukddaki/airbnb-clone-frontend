import {
    Box,
    Button,
    Container,
    FormControl,
    Heading,
    Input,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { createPhoto, getUploadURL, uploadImage } from "../api";
import HostOnlyPage from "../components/HostOnlyPage";
import useHostOnlyPage from "../components/HostOnlyPage";
import ProtectedPage from "../components/ProtectedPage";

interface IForm {
    file: FileList;
    description: string;
}

interface IUploadURLResponse {
    id: string;
    uploadURL: string;
}

export default function UploadPhotos() {
    const { register, handleSubmit, watch, reset } = useForm<IForm>();
    const { roomPk } = useParams();
    const toast = useToast();
    const createPhotoMutation = useMutation(createPhoto, {
        onSuccess: () => {
            toast({
                status: "success",
                title: "Image uploaded!",
                description: "Feel free to upload more images.",
                isClosable: true,
            });
            reset();
        },
    });
    const uploadImageMutation = useMutation(uploadImage, {
        onSuccess: (data: any) => {
            if (roomPk) {
                createPhotoMutation.mutate({
                    description: watch("description"),
                    file: `https://imagedelivery.net/axdyTfJMBRGcaicd7Nj9nw/${data.result.id}/public`,
                    roomPk,
                });
            }
        },
    });
    const uploadURLMutation = useMutation(getUploadURL, {
        onSuccess: (data: any) => {
            uploadImageMutation.mutate({
                uploadURL: data.uploadURL,
                file: watch("file"),
            });
        },
    });
    const onSubmit = (data: any) => {
        uploadURLMutation.mutate();
    };
    return (
        <ProtectedPage>
            <HostOnlyPage>
                <Box
                    pb={40}
                    mt={10}
                    px={{
                        base: 10,
                        lg: 40,
                    }}
                >
                    <Container>
                        <Heading textAlign={"center"}>Upload a Photo</Heading>
                        <VStack
                            as={"form"}
                            onSubmit={handleSubmit(onSubmit)}
                            spacing={5}
                            mt={10}
                        >
                            <FormControl>
                                <Input {...register("file")} type="file" accept="image/*" />
                            </FormControl>
                            <FormControl>
                                <Input
                                    required
                                    {...register("description")}
                                    type="textarea"
                                    accept="image/*"
                                    placeholder="Write description of photo..."
                                />
                            </FormControl>
                            <Button
                                isLoading={
                                    createPhotoMutation.isLoading ||
                                    uploadImageMutation.isLoading ||
                                    uploadURLMutation.isLoading
                                }
                                type="submit"
                                w="full"
                                colorScheme={"red"}
                            >
                                Upload photos
                            </Button>
                        </VStack>
                    </Container>
                </Box>
            </HostOnlyPage>
        </ProtectedPage>
    );
}