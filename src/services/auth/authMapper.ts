import { SignUpDTO } from "./authResource";

export const getSignUpDTO = (data: SignUpDTO) => {
    return {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        birthday: data.birthday,
    };
};

export const getSigUpResponse = (data: any) => {
    return {
        name: data.name,
        email: data.email,
        birthday: new Date (data.birthday),
        password: data.password,
        confirmPassword: data.confirmPassword,
    };
};