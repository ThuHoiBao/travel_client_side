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
        
        return userDto.toPlain() as any;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};