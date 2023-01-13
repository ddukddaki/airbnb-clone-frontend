import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import GithubConfirm from "./routes/GithubConfirm";
import Home from "./routes/Home";
import KakaoConfirm from "./routes/KakaoConfirm";
import ManageBookings from "./routes/ManageBookings";
import ModifyRoom from "./routes/ModifyRoom";
import MyBookings from "./routes/MyBookings";
// import NaverConfirm from "./routes/NaverConfirm";
import NotFound from "./routes/NotFound";
import RoomDetail from "./routes/RoomDetail";
import UploadPhotos from "./routes/UploadPhotos";
import UploadRoom from "./routes/UploadRoom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "mybookings",
                element: <MyBookings />,
            },
            {
                path: "manage-bookings",
                element: <ManageBookings />,
            },
            {
                path: "rooms/upload",
                element: <UploadRoom />,
            },
            {
                path: "rooms/:roomPk",
                element: <RoomDetail />,
            },
            {
                path: "rooms/:roomPk/photos",
                element: <UploadPhotos />,
            },
            {
                path: "rooms/:roomPk/modify",
                element: <ModifyRoom />,
            },
            {
                path: "social",
                children: [
                    {
                        path: "github",
                        element: <GithubConfirm />,
                    },
                    {
                        path: "kakao",
                        element: <KakaoConfirm />,
                    },
                    // {
                    //     path: "naver",
                    //     element: <NaverConfirm />,
                    // },
                ],
            },
        ],
    },
]);

export default router;
