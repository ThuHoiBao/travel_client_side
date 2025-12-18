// services/user/user.ts

import { api } from '../api.ts';
import { UserRequestDTO } from '../../dto/requestDTO/UserRequestDTO.ts';
import { UserUpdateRequestDTO } from '../../dto/requestDTO/UserUpdateRequestDTO.ts';

type UpdatePayload = UserUpdateRequestDTO | FormData;

export const getUserByIdApi = async (userID: number): Promise<UserRequestDTO> => {
    try {
        const response = await api.get(`/users/${userID}`);
        
        const userDto = UserRequestDTO.fromApiResponse(response.data);
        
        return userDto.toPlain() as any;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const updateUserApi = async (userID: number, updateData: UpdatePayload): Promise<UserRequestDTO> => {
    try {
        let response;
        
        if (updateData instanceof FormData) {
            response = await api.put(`/users/${userID}`, updateData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            response = await api.put(`/users/${userID}`, updateData.toPlain(), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const userDto = UserRequestDTO.fromApiResponse(response.data);
        console.log("UserDTO", userDto);
        
        return userDto.toPlain() as any;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const searchUsersApi = async (searchDTO: any, page: number, size: number) => {
    const response = await api.post(`/users/admin/search`, searchDTO, {
        params: { page, size }
    });
    // Map content sang DTO plain object
    const content = response.data.content.map((item: any) => UserRequestDTO.fromApiResponse(item).toPlain());
    return { ...response.data, content };
};

export const lockUnlockUserApi = async (userID: number, status: boolean, reason: string) => {
    const response = await api.post(`/users/admin/update-status`, { userID, status, reason });
    return UserRequestDTO.fromApiResponse(response.data).toPlain();
};