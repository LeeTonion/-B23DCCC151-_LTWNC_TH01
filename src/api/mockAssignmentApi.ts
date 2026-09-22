/**
 * MOCK API GIẢ LẬP
 * File: src/api/mockAssignmentApi.ts
 * 
 * Giả lập API server với Promise, setTimeout, lưu cache vào LocalStorage
 */

import type { ApiResponse } from '../types/api.types';
import type { Assignment, CreateAssignmentDTO, UpdateAssignmentDTO } from '../types/assignment.types';
import { LocalStorageManager } from '../utils/storage';

const STORAGE_KEY = 'student_deadline_tracker_data_v1';
const storage = new LocalStorageManager<Assignment[]>(STORAGE_KEY, []);

// Danh sách dữ liệu mẫu ban đầu
function createInitialSampleData(): Assignment[] {
  const now = new Date();
  
  // Hàm tạo thời gian tương đối so với hiện tại
  const addHours = (hours: number): string => {
    const d = new Date(now.getTime() + hours * 60 * 60 * 1000);
    return d.toISOString();
  };

  const addDays = (days: number, hour: number = 23, minute: number = 59): string => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  return [
    {
      id: 'asg-01',
      subject: 'Lập trình Web Nâng Cao',
      title: 'Lab 4 — Triển khai Redux Toolkit và Custom Hooks',
      description: 'Hoàn thiện tính năng quản lý danh sách sản phẩm yêu thích và student deadline tracker.',
      dueDate: addHours(6), // Sắp đến hạn trong 6 tiếng (URGENT)
      priority: 'HIGH',
      isCompleted: false,
      completedAt: null,
      createdAt: addDays(-3),
      updatedAt: addDays(-3),
    },
    {
      id: 'asg-02',
      subject: 'Cơ sở Dữ liệu Phân tán',
      title: 'Bài tập Lớn — Thiết kế Sharding & Replication MongoDB',
      description: 'Viết báo cáo đánh giá hiệu năng giữa Master-Slave và Raft consensus.',
      dueDate: addDays(2, 17, 0), // Còn 2 ngày (WARNING)
      priority: 'HIGH',
      isCompleted: false,
      completedAt: null,
      createdAt: addDays(-5),
      updatedAt: addDays(-5),
    },
    {
      id: 'asg-03',
      subject: 'Trí tuệ Nhân tạo',
      title: 'Assignment 2 — Thuật toán tìm kiếm A* và MiniMax Game Caro',
      description: 'Cài đặt thuật toán cắt tỉa Alpha-Beta Pruning trên giao diện React / Canvas.',
      dueDate: addDays(5, 23, 59), // Còn 5 ngày (NORMAL)
      priority: 'MEDIUM',
      isCompleted: false,
      completedAt: null,
      createdAt: addDays(-2),
      updatedAt: addDays(-2),
    },
    {
      id: 'asg-04',
      subject: 'Kiến trúc Phần mềm',
      title: 'Tiểu luận — Phân tích Microservices vs Modular Monolith',
      description: 'Trình bày ca sử dụng thực tế của Uber và Netflix khi chuyển dịch kiến trúc.',
      dueDate: addHours(-26), // Quá hạn 1 ngày (OVERDUE)
      priority: 'MEDIUM',
      isCompleted: false,
      completedAt: null,
      createdAt: addDays(-7),
      updatedAt: addDays(-7),
    },
    {
      id: 'asg-05',
      subject: 'An toàn Thông tin',
      title: 'Thực hành — Phân tích lỗ hổng SQL Injection & XSS',
      description: 'Khai thác mẫu trên môi trường DVWA và đề xuất giải pháp phòng thủ.',
      dueDate: addDays(-4), // Đã hoàn thành (COMPLETED)
      priority: 'LOW',
      isCompleted: true,
      completedAt: addDays(-4, 20, 30),
      createdAt: addDays(-10),
      updatedAt: addDays(-4),
    },
    {
      id: 'asg-06',
      subject: 'Mạng Máy tính Nâng Cao',
      title: 'Cấu hình Định tuyến OSPF & BGP trên GNS3',
      description: 'Mô phỏng mạng liên vùng autonomous system và kiểm tra failover link.',
      dueDate: addDays(7, 12, 0), // Còn 7 ngày
      priority: 'LOW',
      isCompleted: false,
      completedAt: null,
      createdAt: addDays(-1),
      updatedAt: addDays(-1),
    },
  ];
}

export const mockAssignmentApi = {
  /** Lấy toàn bộ danh sách bài tập (có delay mô phỏng mạng) */
  async getAllAssignments(): Promise<ApiResponse<Assignment[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = storage.get();
        if (!data || data.length === 0) {
          data = createInitialSampleData();
          storage.set(data);
        }
        resolve({
          success: true,
          data,
          message: 'Lấy danh sách bài tập thành công',
          timestamp: new Date().toISOString(),
          statusCode: 200,
        });
      }, 500); // 500ms delay
    });
  },

  /** Thêm bài tập mới */
  async createAssignment(dto: CreateAssignmentDTO): Promise<ApiResponse<Assignment>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = storage.get();
        const now = new Date().toISOString();
        const newAssignment: Assignment = {
          ...dto,
          id: `asg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          isCompleted: false,
          completedAt: null,
          createdAt: now,
          updatedAt: now,
        };

        const updated = [newAssignment, ...current];
        storage.set(updated);

        resolve({
          success: true,
          data: newAssignment,
          message: 'Thêm bài tập mới thành công',
          timestamp: now,
          statusCode: 201,
        });
      }, 350);
    });
  },

  /** Đổi trạng thái hoàn thành */
  async toggleAssignment(id: string): Promise<ApiResponse<Assignment>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const current = storage.get();
        const index = current.findIndex((item) => item.id === id);

        if (index === -1) {
          reject(new Error(`Không tìm thấy bài tập có id: ${id}`));
          return;
        }

        const target = current[index];
        const nextCompleted = !target.isCompleted;
        const now = new Date().toISOString();

        const updatedItem: Assignment = {
          ...target,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? now : null,
          updatedAt: now,
        };

        current[index] = updatedItem;
        storage.set(current);

        resolve({
          success: true,
          data: updatedItem,
          message: nextCompleted ? 'Đã đánh dấu hoàn thành' : 'Đã bỏ đánh dấu hoàn thành',
          timestamp: now,
          statusCode: 200,
        });
      }, 250);
    });
  },

  /** Cập nhật bài tập */
  async updateAssignment(id: string, dto: UpdateAssignmentDTO): Promise<ApiResponse<Assignment>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const current = storage.get();
        const index = current.findIndex((item) => item.id === id);

        if (index === -1) {
          reject(new Error(`Không tìm thấy bài tập có id: ${id}`));
          return;
        }

        const now = new Date().toISOString();
        const updatedItem: Assignment = {
          ...current[index],
          ...dto,
          updatedAt: now,
        };

        current[index] = updatedItem;
        storage.set(current);

        resolve({
          success: true,
          data: updatedItem,
          message: 'Cập nhật bài tập thành công',
          timestamp: now,
          statusCode: 200,
        });
      }, 300);
    });
  },

  /** Xóa bài tập */
  async deleteAssignment(id: string): Promise<ApiResponse<{ id: string }>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const current = storage.get();
        const exists = current.some((item) => item.id === id);

        if (!exists) {
          reject(new Error(`Không tìm thấy bài tập có id: ${id}`));
          return;
        }

        const filtered = current.filter((item) => item.id !== id);
        storage.set(filtered);

        resolve({
          success: true,
          data: { id },
          message: 'Xóa bài tập thành công',
          timestamp: new Date().toISOString(),
          statusCode: 200,
        });
      }, 250);
    });
  },

  /** Reset về dữ liệu mẫu mặc định */
  async resetToSampleData(): Promise<ApiResponse<Assignment[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fresh = createInitialSampleData();
        storage.set(fresh);
        resolve({
          success: true,
          data: fresh,
          message: 'Đã khôi phục dữ liệu mẫu',
          timestamp: new Date().toISOString(),
          statusCode: 200,
        });
      }, 300);
    });
  },
};
