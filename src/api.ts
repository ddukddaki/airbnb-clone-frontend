import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import Cookie from "js-cookie";
import { formatDate } from "./lib/utils";
import { IBooking } from "./routes/RoomDetail";

const instance = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/v1/"
            : "https://airbnbclone-fwep.onrender.com/api/v1",
    withCredentials: true,
});

export const getRooms = () =>
    instance.get("rooms/").then((response) => response.data);

// export async function getRooms() {
//   const response = await instance.get(`rooms/`);
//   return response.data;
// }

export const getRoom = ({ queryKey }: QueryFunctionContext) => {
    const [_, roomPk] = queryKey;
    return instance.get(`rooms/${roomPk}`).then((response) => response.data);
};

export const getRoomReviews = ({ queryKey }: QueryFunctionContext) => {
    const [_, roomPk] = queryKey;
    return instance
        .get(`rooms/${roomPk}/reviews`)
        .then((response) => response.data);
};

export const getMe = () =>
    instance.get(`users/me`).then((response) => response.data);

export const logOut = () =>
    instance
        .post(`users/log-out`, null, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);

// backend로 code 전달
export const githubLogIn = (code: string) =>
    instance
        .post(
            `/users/github`,
            { code },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.status);

export const kakaoLogIn = (code: string) =>
    instance
        .post(
            `/users/kakao`,
            { code },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.status);

export interface naverLoginVariables {
    code: string;
    state: string | null;
}

export const naverLogIn = ({ code, state }: naverLoginVariables) =>
    instance
        .post(
            `users/naver`,
            { code, state },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.status);

export interface IUsernameLoginVariables {
    username: string;
    password: string;
}

export interface IUsernameLoginSuccess {
    ok: string;
}
export interface IUsernameLoginError {
    error: string;
}
export const usernameLogIn = ({
    username,
    password,
}: IUsernameLoginVariables) =>
    instance
        .post(
            `users/log-in`,
            { username, password },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.data);

export interface ISignUpVariables {
    name: string;
    phone_nb: string;
    email: string;
    username: string;
    password: string;
    password_check: string;
}
export const signUp = ({
    name,
    phone_nb,
    email,
    username,
    password,
    password_check,
}: ISignUpVariables) =>
    instance
        .post(
            `users/`,
            { name, phone_nb, email, username, password, password_check },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.data);

export const getAmenities = () =>
    instance.get(`rooms/amenities`).then((response) => response.data);

export const getCategories = () =>
    instance.get(`categories`).then((response) => response.data);

export interface IUploadRoomVariables {
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
    category: number;
}

export interface IModifyRoomVariables {
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
    category: number;
    roomPk: string;
}

export const uploadRoom = (variables: IUploadRoomVariables) =>
    instance
        .post(`rooms/`, variables, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);

export const modifyRoom = (variables: IModifyRoomVariables) =>
    instance
        .put(`rooms/${variables.roomPk}`, variables, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);

export const getUploadURL = () =>
    instance
        .post(`medias/photos/get-url`, null, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);

export interface IUploadImageVaraibles {
    file: FileList;
    uploadURL: string;
}

export const uploadImage = ({ file, uploadURL }: IUploadImageVaraibles) => {
    const form = new FormData();
    form.append("file", file[0]);
    return axios
        .post(uploadURL, form, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => response.data);
};

export interface ICreatePhotoVariables {
    description: string;
    file: string;
    roomPk: string;
}

export const createPhoto = ({
    description,
    file,
    roomPk,
}: ICreatePhotoVariables) =>
    instance
        .post(
            `rooms/${roomPk}/photos`,
            { description, file },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.data);

type CheckBookingQueryKey = [string, string?, Date[]?];

export const checkBooking = ({
    queryKey,
}: QueryFunctionContext<CheckBookingQueryKey>) => {
    const [_, roomPk, dates] = queryKey;
    if (dates) {
        const [firstDate, secondDate] = dates;
        const checkIn = formatDate(firstDate);
        const checkOut = formatDate(secondDate);
        return instance
            .get(
                `rooms/${roomPk}/bookings/check?check_in=${checkIn}&check_out=${checkOut}`
            )
            .then((response) => response.data);
    }
};

export const getRoomInfo = (roomPk: string) =>
    instance.get(`rooms/${roomPk}`).then((response) => response.data);

export const createBooking = (variables: IBooking) =>
    instance
        .post(`rooms/${variables.pk}/bookings`, variables, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.status);

export const getBookings = () =>
    instance.get("bookings/me").then((response) => response.data);

export const getManageBookings = () =>
    instance.get("bookings/manage").then((response) => response.data);

export const cancelBooking = (bookingPk: number) =>
    instance
        .post(`bookings/me/${bookingPk}/cancel`, null, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.status);
