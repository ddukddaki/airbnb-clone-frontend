import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    Spinner,
    Text,
    Textarea,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaBed, FaDollarSign, FaToilet } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAmenities,
    getCategories,
    getRoom,
    IModifyRoomVariables,
    IUploadRoomVariables,
    modifyRoom,
    uploadRoom,
} from "../api";
import HostOnlyPage from "../components/HostOnlyPage";
import ProtectedPage from "../components/ProtectedPage";
import { IAmenity, ICategory, IRoomDetail } from "../types";

interface IForm {
    name: string;
    country: string;
    city: string;
    price: number;
    rooms: number;
    toilets: number;
    description: string;
    address: string;
    pet_friendly: boolean;
    kind: string;
    amenities: number[];
    category: ICategory;
}

export default function UploadRoom() {
    const { roomPk } = useParams();
    const { register, handleSubmit } = useForm<IModifyRoomVariables>();
    const toast = useToast();
    const navigate = useNavigate();
    const mutation = useMutation(modifyRoom, {
        onSuccess: (data: IRoomDetail) => {
            if (!mutation.isLoading) {
                toast({
                    status: "success",
                    title: "Room successfully modified",
                });
                navigate(`/rooms/${data.id}`);
            }
        },
    });
    const { data: roomInfo, isLoading: isRoomInfoLoading } = useQuery<IForm>(
        ["roomInfo", roomPk],
        getRoom
    );
    const selected_amenities = roomInfo?.amenities;
    const { data: amenities, isLoading: isAmenitiesLoading } = useQuery<
        IAmenity[]
    >(["amenities"], getAmenities);
    const { data: categories, isLoading: isCategoriesLoading } = useQuery<
        ICategory[]
    >(["categories"], getCategories);
    const onSubmit = (data: IModifyRoomVariables) => {
        if (roomPk) {
            data["roomPk"] = roomPk;
            mutation.mutate(data);
        }
    };
    return (
        <ProtectedPage>
            <HostOnlyPage>
                {isRoomInfoLoading ||
                    isAmenitiesLoading ||
                    isCategoriesLoading ? null : (
                    <Box
                        pb={40}
                        mt={10}
                        px={{
                            base: 10,
                            lg: 40,
                        }}
                    >
                        <Container>
                            <Heading textAlign={"center"}>Modify Room</Heading>
                            <VStack
                                spacing={10}
                                as="form"
                                onSubmit={handleSubmit(onSubmit)}
                                mt={5}
                            >
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        defaultValue={roomInfo?.name}
                                        {...register("name")}
                                        required
                                        type="text"
                                    ></Input>
                                    <FormHelperText>Write the name of your room.</FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Country</FormLabel>
                                    <Input
                                        defaultValue={roomInfo?.country}
                                        {...register("country")}
                                        required
                                        type="text"
                                    ></Input>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>City</FormLabel>
                                    <Input
                                        defaultValue={roomInfo?.city}
                                        {...register("city")}
                                        required
                                        type="text"
                                    ></Input>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Address</FormLabel>
                                    <Input
                                        defaultValue={roomInfo?.address}
                                        {...register("address")}
                                        required
                                        type="text"
                                    ></Input>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Price</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon children={<FaDollarSign />} />
                                        <Input
                                            defaultValue={roomInfo?.price}
                                            {...register("price")}
                                            required
                                            type="number"
                                            min={0}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Rooms</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon children={<FaBed />} />
                                        <Input
                                            defaultValue={roomInfo?.rooms}
                                            {...register("rooms")}
                                            required
                                            type="number"
                                            min={0}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Toilets</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon children={<FaToilet />} />
                                        <Input
                                            defaultValue={roomInfo?.toilets}
                                            {...register("toilets")}
                                            required
                                            type="number"
                                            min={0}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        {...register("description")}
                                        defaultValue={roomInfo?.description}
                                    />
                                </FormControl>
                                <FormControl>
                                    <Checkbox
                                        defaultChecked={roomInfo?.pet_friendly}
                                        {...register("pet_friendly")}
                                    >
                                        Pet friendly
                                    </Checkbox>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Kind of room</FormLabel>
                                    <Select
                                        defaultValue={roomInfo?.kind}
                                        {...register("kind")}
                                        placeholder="Choose a kind"
                                    >
                                        <option value="entire_place">Entire Place</option>
                                        <option value="private_room">Private Room</option>
                                        <option value="shared_room">Shared Room</option>
                                    </Select>
                                    <FormHelperText>
                                        What kind of room are you renting?
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        defaultValue={roomInfo?.category.pk}
                                        {...register("category")}
                                        placeholder="Choose a Category"
                                    >
                                        {categories?.map((category) => (
                                            <option key={category.pk} value={category.pk}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        What category describes your room?
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Amenities</FormLabel>
                                    <Grid templateColumns={"1fr 1fr"} gap={5}>
                                        {amenities?.map((amenity) => (
                                            <Box key={amenity.pk}>
                                                <Checkbox
                                                    defaultChecked={selected_amenities?.includes(
                                                        amenity.pk
                                                    )}
                                                    value={amenity.pk}
                                                    {...register("amenities")}
                                                >
                                                    {amenity.name}
                                                </Checkbox>
                                                <FormHelperText>{amenity.description}</FormHelperText>
                                            </Box>
                                        ))}
                                    </Grid>
                                </FormControl>
                                {mutation.isError ? (
                                    <Text color={"red.500"}>Something went wrong</Text>
                                ) : null}
                                <Button
                                    type="submit"
                                    isLoading={mutation.isLoading}
                                    colorScheme={"red"}
                                    size="lg"
                                    w="100%"
                                >
                                    Modify Room
                                </Button>
                            </VStack>
                        </Container>
                    </Box>
                )}
            </HostOnlyPage>
        </ProtectedPage>
    );
}