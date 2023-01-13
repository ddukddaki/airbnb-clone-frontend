import { Grid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api";
import Room from "../components/Room";
import RoomSkeleton from "../components/RoomSkeleton";
import { IRoomList } from "../types";
import { Helmet } from "react-helmet";

export default function Home() {
  const { isLoading, data } = useQuery<IRoomList[]>(["rooms"], getRooms);
  return (
    <Grid
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
      columnGap={4}
      rowGap={8}
      templateColumns={{
        sm: "1fr",
        md: "1fr 1fr",
        lg: "repeat(3, 1fr)",
        xl: "repeat(5,1fr)",
      }}
    >
      <Helmet>
        <title>{data ? "Home" : "Loading..."}</title>
      </Helmet>
      {isLoading ? (
        <>
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
        </>
      ) : null}
      {data?.map((room) => (
        <Room
          key={room.pk}
          pk={room.pk}
          isOwner={room.is_owner}
          imageUrl={room.photos[0]?.file}
          rating={room.rating}
          price={room.price}
          description={room.name}
          category={room.category.name}
        />
      ))}
    </Grid>
  );
}
