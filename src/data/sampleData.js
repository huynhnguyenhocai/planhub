/**
 * Sample data for PlanHub (Vietnamese)
 * Auto-generates dates relative to today for realistic demo
 */
import { DEFAULT_CATEGORIES } from './constants';
import { formatDateKey } from '../utils/dateUtils';

function daysFromNow(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return formatDateKey(d);
}

export function getSampleData() {
  const today = formatDateKey(new Date());

  const categories = [...DEFAULT_CATEGORIES];

  const tasks = [
    {
      id: 'task-1',
      title: 'Họp team buổi sáng',
      description: 'Review sprint backlog và phân chia task mới cho tuần này',
      date: today,
      timeSlot: 'morning',
      categoryId: 'cat-3',
      color: '#3B82F6',
      progress: 100,
      status: 'completed',
      dismissed: false,
    },
    {
      id: 'task-2',
      title: 'Viết báo cáo tuần',
      description: 'Tổng hợp kết quả công việc tuần qua và kế hoạch tuần tới',
      date: today,
      timeSlot: 'afternoon',
      categoryId: 'cat-3',
      color: '#8B5CF6',
      progress: 60,
      status: 'in_progress',
      dismissed: false,
    },
    {
      id: 'task-3',
      title: 'Tập gym',
      description: 'Cardio 30 phút + tập cơ vai và lưng',
      date: today,
      timeSlot: 'evening',
      categoryId: 'cat-1',
      color: '#10B981',
      progress: 0,
      status: 'not_started',
      dismissed: false,
    },
    {
      id: 'task-4',
      title: 'Đọc sách "Atomic Habits"',
      description: 'Đọc chương 5-6, ghi chú ý chính',
      date: daysFromNow(1),
      timeSlot: 'evening',
      categoryId: 'cat-1',
      color: '#F59E0B',
      progress: 30,
      status: 'in_progress',
      dismissed: false,
    },
    {
      id: 'task-5',
      title: 'Review code PR #42',
      description: 'Review pull request feature authentication từ đội dev',
      date: daysFromNow(1),
      timeSlot: 'morning',
      categoryId: 'cat-3',
      color: '#3B82F6',
      progress: 0,
      status: 'not_started',
      dismissed: false,
    },
    {
      id: 'task-6',
      title: 'Gửi invoice cho khách hàng',
      description: 'Gửi hóa đơn tháng 5 cho 3 khách hàng: A, B, C',
      date: daysFromNow(-1),
      timeSlot: 'morning',
      categoryId: 'cat-3',
      color: '#EF4444',
      progress: 50,
      status: 'in_progress',
      dismissed: false,
    },
    {
      id: 'task-7',
      title: 'Mua quà sinh nhật',
      description: 'Sinh nhật bạn Hà vào cuối tuần, cần mua quà trước thứ 6',
      date: daysFromNow(-2),
      timeSlot: 'afternoon',
      categoryId: 'cat-1',
      color: '#EC4899',
      progress: 0,
      status: 'not_started',
      dismissed: false,
    },
    {
      id: 'task-8',
      title: 'Chuẩn bị slide thuyết trình',
      description: 'Slide cho buổi pitching sản phẩm mới tuần sau',
      date: daysFromNow(2),
      timeSlot: 'morning',
      categoryId: 'cat-3',
      color: '#8B5CF6',
      progress: 20,
      status: 'in_progress',
      dismissed: false,
    },
    {
      id: 'task-9',
      title: 'Dọn dẹp nhà cửa',
      description: 'Lau nhà, giặt đồ, sắp xếp bàn làm việc',
      date: daysFromNow(3),
      timeSlot: 'morning',
      categoryId: 'cat-1',
      color: '#06B6D4',
      progress: 0,
      status: 'not_started',
      dismissed: false,
    },
    {
      id: 'task-10',
      title: 'Xử lý phát sinh server',
      description: 'Server production bị lag, cần check logs và optimize',
      date: today,
      timeSlot: 'adhoc',
      categoryId: 'cat-4',
      color: '#EF4444',
      progress: 40,
      status: 'in_progress',
      dismissed: false,
    },
    {
      id: 'task-11',
      title: 'Lên kế hoạch marketing',
      description: 'Brainstorm chiến dịch quảng cáo Q3',
      date: daysFromNow(4),
      timeSlot: 'afternoon',
      categoryId: 'cat-3',
      color: '#F59E0B',
      progress: 0,
      status: 'not_started',
      dismissed: false,
    },
    {
      id: 'task-12',
      title: 'Học tiếng Anh online',
      description: 'Buổi học IELTS Speaking trên Zoom',
      date: daysFromNow(2),
      timeSlot: 'evening',
      categoryId: 'cat-1',
      color: '#84CC16',
      progress: 0,
      status: 'not_started',
      dismissed: false,
    },
  ];

  const ideas = [
    {
      id: 'idea-1',
      title: 'App theo dõi thói quen',
      note: 'Tạo một ứng dụng đơn giản để theo dõi thói quen hàng ngày. Dùng streak system để tạo động lực. Có thể dùng React Native.',
      tags: ['mobile', 'productivity'],
      categoryId: 'cat-2',
      thumbnail: null,
      createdAt: daysFromNow(-5) + 'T10:00:00',
    },
    {
      id: 'idea-2',
      title: 'Blog cá nhân về tech',
      note: 'Viết blog chia sẻ kiến thức lập trình, review công nghệ mới. Dùng Next.js + MDX. Có thể monetize bằng ads.',
      tags: ['blog', 'tech'],
      categoryId: 'cat-2',
      thumbnail: null,
      createdAt: daysFromNow(-3) + 'T14:30:00',
    },
    {
      id: 'idea-3',
      title: 'Dự án freelance quản lý kho',
      note: 'Khách hàng cần hệ thống quản lý kho hàng nhỏ. Tech stack: React + Supabase. Budget khoảng 15-20tr.',
      tags: ['freelance', 'business'],
      categoryId: 'cat-3',
      thumbnail: null,
      createdAt: daysFromNow(-1) + 'T09:15:00',
    },
    {
      id: 'idea-4',
      title: 'Khóa học online lập trình',
      note: 'Tạo khóa học React từ cơ bản đến nâng cao trên Udemy. Target: beginner Việt Nam. Cần quay video và soạn bài tập.',
      tags: ['education', 'business'],
      categoryId: 'cat-2',
      thumbnail: null,
      createdAt: daysFromNow(-7) + 'T16:00:00',
    },
    {
      id: 'idea-5',
      title: 'Podcast công nghệ tiếng Việt',
      note: 'Mỗi tuần 1 episode 30 phút, phỏng vấn các dev Việt Nam. Cần mua mic và setup studio đơn giản tại nhà.',
      tags: ['media', 'tech'],
      categoryId: 'cat-2',
      thumbnail: null,
      createdAt: daysFromNow(-10) + 'T11:45:00',
    },
  ];

  const settings = {
    theme: 'light',
    sidebarCollapsed: false,
  };

  return { categories, tasks, ideas, settings };
}
