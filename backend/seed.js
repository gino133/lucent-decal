require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Page = require('./models/Page');
const Menu = require('./models/Menu');
const Setting = require('./models/Setting');
const Product = require('./models/Product');
const Project = require('./models/Project');

// Dữ liệu mẫu cho trang chủ (home)
const homeSections = [
  {
    type: 'hero',
    order: 0,
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
  {
    type: 'intro',
    order: 1,
    content: {
      heading: 'Độ chính xác trong từng milimet',
      text: 'Tại Lucent Glass, chúng tôi không chỉ cung cấp decal, chúng tôi kiến tạo trải nghiệm không gian. Với công nghệ cắt laser hiện đại và chất liệu decal cao cấp nhập khẩu, mỗi dự án là một sự cam kết về chất lượng và tính thẩm mỹ tuyệt đối.',
      stats: [
        { value: '12+', label: 'Năm kinh nghiệm' },
        { value: '500+', label: 'Dự án hoàn thành' }
      ],
      image1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6B6mGyAB8s4L08XdAahkP3x61aLW04HLGePAyxspONS9vQjXbvki_xkBelcDMFA1zEzrBAZWzYDDdVuWb8pjd42o6uwwHy5y-QQnX4FHDn0ydv-HYKs68gxtTu3xxgZyy6D5U6Yj6uvwJYQufEA8in165Uxe6k8nHN5grcqNmLgEuGSbThR05H6W5p-Pyujk1mr-TO-Xk2VcqcWyngv9tkwlqQoIhM5QPoxBDjkNCF1ayt_g1qAzHVbFepSkUE7akdqJI8Vn7fqVz',
      image2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnV0PrAt9LScAuwJ_6CzhVKfyXPaT_r6gafHPjRdSNLhhbXtQRU7ov7LMosd0jcT_t_k0Vw7BuPM3oqxPMdwL7HQysjzrtn0uAxbosrWPGl5I9DE3zoWaH6q9ojQtqORnqMNjS3sekpflLsOEWwxGpXgHNHvsyjaX-1kUvgX9JjRogHC-DSEKjBUVg4j_BWGcShZc8wIfpq3edO2G5Vo8Fu9GF0qxqY1Yhb2Uu3eEif_GuZ27LDe0TcGqIZbeUqEyVaY3i5U5FKDeZ'
    },
    style: { backgroundColor: '#fbf9f9' }
  },
  {
    type: 'product-grid',
    order: 2,
    content: {
      title: 'Sản Phẩm Mới Nhất',
      subtitle: 'Những mẫu thiết kế được ưa chuộng nhất cho không gian hiện đại.',
      viewAllLink: '/san-pham',
      products: [
        {
          name: 'Decal Mờ Sọc Dọc',
          description: 'Kiến tạo sự riêng tư tinh tế cho văn phòng.',
          price: '450.000đ / m²',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz-Kl01Uc9mG8frxcyQSc7n8fOjqNcNLBYqSHDZ3mkdfcW3rWmnO1es_2QlRZt4X7quO184MQ6y2spBPOVChymrfM5RYkloV8-ZMweUjM-7Dwn-0FmoGhirHIym0GfI2E7Uc-mDTCXDHD79ADxQEmZINdwGVN46ygFIWuBz1Joo0IbjCWzkHgbYbuiCguuMpQ5GmrClSjcR3wRF2pINQkbAwycs5QG2zHZiIKo9lff-eJDz2xDWUmx8WwgTEgU_LfzZiVYyK4TS0Fo',
          badge: 'Mới'
        },
        {
          name: 'Decal Cát Mờ Cao Cấp',
          description: 'Bề mặt mịn màng, độ bền vượt trội.',
          price: '380.000đ / m²',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsY-jVGOh9SxC4btoSkn3gadpgrqC3rLnwsUCwIgFPs84y_6MZErGwTnzMfrhaNI4WoH__U-25SdVHheWmSDJlMge1j76TYxXqkU1zdlptBirLqPMdsGkNqMdT6cpZJZueCCuTj1KDq6bPc1Ep2v4kYME820_2kYW8HkhWiG9-rPfVpVPfVrZSgYivbD5VORo4VQ9Ozz63NXjuQdYbCRZyufq0Xba18uTIM593tqF_7ix6aegU7uIPV7594Dz_5cZyxNbvk0gOmd8y'
        },
        {
          name: 'Decal Hoa Văn Nghệ Thuật',
          description: 'Điểm nhấn sáng tạo cho không gian hiện đại.',
          price: '520.000đ / m²',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0erwYI94Jtz0Xj5qQnm--cWG9dpkLwJcbGPtXs3bAYZk8Lw0F-tB54PDhlDIGqlFsfMywCcGVmRCiDsi2vZfRzLleIscOKvfE80YSHaod2wmlyVzBg_NKo1VPUzJ2txaeQQZbPTWyFlL9zv9AVmip5WEc0Eoe7JRSko2IRFbuGmIHi9zyfrc8flOSLub7uCiAn-lZr8PM69TQ-f1PiasLSF2ckfqKIYn6y_4fszpbKiO1HU6dpCK0tOwciIpM182fA__dk5BTRNjA'
        }
      ]
    }
  },
  {
    type: 'project-grid',
    order: 3,
    content: {
      title: 'Dự án tiêu biểu',
      subtitle: 'Khám phá cách chúng tôi thay đổi diện mạo các công trình kiến trúc.',
      viewAllLink: '/du-an',
      projects: [
        {
          name: 'Alpha Tech HQ',
          category: 'Văn phòng',
          description: 'Decal kính họa tiết hình học tùy chỉnh cho các phòng họp riêng tư.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoxCCWh5Pk9MgAzmadW6vP-nQjldiA5JSkol-3Xvb6cVRitfV3UNu63oD_xendeV1ejDWqVFmY_gGLjN3ElnOwQ32KtgWdu1QZvV2OEQhI0DZKEuC_e5-ljYzoP2hC7na0PsynUndrXhbs9IrHrYkzbaf-FmkWwM95kG_Xf4sWmOz4jHcAHzQUFJgOld27fmByM5WLbZww13C1TWxskGvspeD5cTax0VD16CFwyfohTmq0rIGB8UgzQR0yMCMg4LkGiW1uuD2hOE7f'
        },
        {
          name: 'Trung tâm Tài chính Toàn cầu',
          category: 'Thương mại',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNZihRBgRDqysOpgwgpXsrlOhBfCANmperFoiPDO3DgHOVeJPtItgacaCUTOmwqfhrQJLj_aS14H5pg3iPWxGWKaCibsuXbrB94X2nwdDq1nYj5-CquAbnMKSk1Z2_u4RyvwtEDLBigYnckibDixX5rdZ5fCvkp6wbjLSBomcw0Q86InWeZMefDW4rTlZLfXY5DYyc0nqFJDQtdwEhoUHv4chpdTaZmzzQRFIS5-t-A7M9J1IklWMyDuAtIXlYV8ir04Jk36pAEubR'
        },
        {
          name: 'Showroom Lumina',
          category: 'Thương mại',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsY-jVGOh9SxC4btoSkn3gadpgrqC3rLnwsUCwIgFPs84y_6MZErGwTnzMfrhaNI4WoH__U-25SdVHheWmSDJlMge1j76TYxXqkU1zdlptBirLqPMdsGkNqMdT6cpZJZueCCuTj1KDq6bPc1Ep2v4kYME820_2kYW8HkhWiG9-rPfVpVPfVrZSgYivbD5VORo4VQ9Ozz63NXjuQdYbCRZyufq0Xba18uTIM593tqF_7ix6aegU7uIPV7594Dz_5cZyxNbvk0gOmd8y'
        }
      ]
    }
  },
  {
    type: 'cta',
    order: 4,
    content: {
      heading: 'Bạn đã sẵn sàng để thay đổi không gian?',
      subheading: 'Liên hệ ngay để nhận khảo sát miễn phí và báo giá chi tiết cho giải pháp decal kính nghệ thuật chuyên nghiệp nhất.',
      buttons: [
        { label: 'Nhận tư vấn ngay', variant: 'primary' },
        { label: 'Tải PDF báo giá', variant: 'secondary' }
      ]
    }
  }
];

// Menu mẫu
const menuItems = [
  { label: 'Trang chủ', link: '/', order: 0 },
  { label: 'Giới thiệu', link: '/gioi-thieu', order: 1 },
  { label: 'Sản phẩm', link: '/san-pham', order: 2 },
  { label: 'Dự án', link: '/du-an', order: 3 },
  { label: 'Hồ sơ', link: '/ho-so', order: 4 },
  { label: 'Liên hệ', link: '/lien-he', order: 5 }
];

// Dữ liệu cài đặt mẫu
const settingsData = {
  typography: {
    headingFont: 'Montserrat',
    bodyFont: 'Inter',
    headingSize: '64',
    bodySize: '16'
  }
};

// Hàm seed
const seedDatabase = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ (tuỳ chọn)
    // await Page.deleteMany({});
    // await Menu.deleteMany({});
    // await Setting.deleteMany({});

    // Tạo trang home
    let homePage = await Page.findOne({ slug: 'home' });
    if (!homePage) {
      homePage = new Page({
        slug: 'home',
        title: 'Trang chủ',
        sections: homeSections
      });
      await homePage.save();
      console.log('✅ Home page created');
    } else {
      // Cập nhật nếu đã tồn tại
      homePage.sections = homeSections;
      await homePage.save();
      console.log('✅ Home page updated');
    }

    // Tạo menu
    let menu = await Menu.findOne({ name: 'main-menu' });
    if (!menu) {
      menu = new Menu({
        name: 'main-menu',
        items: menuItems
      });
      await menu.save();
      console.log('✅ Menu created');
    } else {
      menu.items = menuItems;
      await menu.save();
      console.log('✅ Menu updated');
    }

    // Tạo settings
    let setting = await Setting.findOne({ key: 'typography' });
    if (!setting) {
      setting = new Setting({
        key: 'typography',
        value: settingsData.typography
      });
      await setting.save();
      console.log('✅ Settings created');
    } else {
      setting.value = settingsData.typography;
      await setting.save();
      console.log('✅ Settings updated');
    }

    console.log('🎉 Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
