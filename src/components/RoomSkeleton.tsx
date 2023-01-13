import { Box, Grid, Skeleton, SkeletonText } from "@chakra-ui/react";

export default function RoomSkeleton() {
    return (
        <Box>
            <Skeleton height={240} rounded="2xl" mb={6} />
            <Grid mb={2} templateColumns={"5fr 1fr"}>
                <SkeletonText w={"80%"} noOfLines={1} />
                <SkeletonText w={"50%"} noOfLines={1} />
            </Grid>
            <SkeletonText mt={3} height={5} w={"30%"} noOfLines={1} />
            <SkeletonText height={5} w={"40%"} noOfLines={1} />
        </Box>
    );
}
