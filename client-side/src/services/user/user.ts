//services/user/user.ts
import { api } from '../api.ts';
import { UserRequestDTO } from '../../dto/requestDTO/UserRequestDTO.ts';
import { UserUpdateRequestDTO } from '../../dto/requestDTO/UserUpdateRequestDTO.ts';

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
 * @param updateData - Dữ liệu cập nhật (UserUpdateRequestDTO)
 * @returns Promise<UserRequestDTO> - Thông tin user sau khi cập nhật
 */
export const updateUserApi = async (userID: number, updateData: UserUpdateRequestDTO): Promise<UserRequestDTO> => {
    try {
        const response = await api.put(`/users/${userID}`, updateData.toPlain());
        
        // Ánh xạ response data vào UserRequestDTO
        const userDto = UserRequestDTO.fromApiResponse(response.data);
        
        // Chuyển sang Plain object để dễ dùng trong React components
        return userDto.toPlain() as any;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

