// services/user/user.ts

import { api } from '../api.ts';
import { UserRequestDTO } from '../../dto/requestDTO/UserRequestDTO.ts';
import { UserUpdateRequestDTO } from '../../dto/requestDTO/UserUpdateRequestDTO.ts';


type UpdatePayload = UserUpdateRequestDTO | FormData;


/**
 * Lấy thông tin user theo ID
 * @param userID - ID của user (bắt buộc)
 * @returns Promise<UserRequestDTO> - Thông tin user
 */
export const getUserByIdApi = async (userID: number): Promise<UserRequestDTO> => {
    try {
        const response = await api.get(`/users/${userID}`);
        
        // Ánh xạ response data vào UserRequestDTO
        const userDto = UserRequestDTO.fromApiResponse(response.data);
        
        // Chuyển sang Plain object để dễ dùng trong React components
        return userDto.toPlain() as any;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

/**
 * Cập nhật thông tin user
 * @param userID - ID của user
 * @param updateData - Dữ liệu cập nhật (UpdatePayload: UserUpdateRequestDTO | FormData)
 * @returns Promise<UserRequestDTO> - Thông tin user sau khi cập nhật
 */
export const updateUserApi = async (userID: number, updateData: UpdatePayload): Promise<UserRequestDTO> => {
    try {
        let response;
        
        if (updateData instanceof FormData) {
           // Trường hợp này đã đúng và sẽ được sử dụng khi gửi FormData từ PersonalProfile.jsx
            response = await api.put(`/users/${userID}`, updateData);
        } else {
            // Trường hợp 2: Gửi JSON (chỉ cập nhật thông tin text)
            // updateData là UserUpdateRequestDTO, ta gọi toPlain() để lấy plain object JSON
            response = await api.put(`/users/${userID}`, updateData.toPlain());
        }

        // Ánh xạ response data vào UserRequestDTO
        const userDto = UserRequestDTO.fromApiResponse(response.data);
        
        // Trả về Plain object để dễ dùng trong React components
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