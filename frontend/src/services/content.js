// Dùng để tạo dữ liệu mẫu khi chưa có API
export const mockContent = {
  home: {
    slug: 'home',
    title: 'Trang chủ',
    sections: [
      {
        type: 'hero',
        content: {
          heading: 'Nâng tầm không gian văn phòng với Decal nghệ thuật',
          subheading: 'Kiến tạo môi trường làm việc hiện đại, chuyên nghiệp thông qua các giải pháp kính và decal kiến trúc cao cấp.',
          image: 'https://lh3.googleusercontent.com/aida/AP1WRLsMWWVfJ4nINenQM6q8ysykxK3WT9rFr5khEnZ112GWlSzEjnRRU4s6q6GxDvaO8MCnXdHHDUbvu2lClXgMRoowYGCEazixFuDLWMo_CxE8U7agMQH5UP9qbZnxCFXP0gclfMQtVsuAD-mW1kKZbsgNNoPR73-v0eWp5REGgDHb0q6M6-IYUVz6s_1b1gdKOv60Sj0jep2hkgd16O04XgDmcmYjf071Fo3xGeY8M9L-4wBPuDfxJh_NGzu3',
          buttons: [
            { label: 'Nhận tư vấn ngay', variant: 'primary' },
            { label: 'Xem bộ sưu tập', variant: 'secondary' }
          ]
        },
        style: { backgroundColor: '#fbf9f9' }
      },
      // ... thêm các section khác
    ]
  }
};