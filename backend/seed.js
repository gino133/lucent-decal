require('dotenv').config();
const connectDB = require('./config/db');
const Page = require('./models/Page');
const Product = require('./models/Product');
const Project = require('./models/Project');
const Menu = require('./models/Menu');

const seedData = async () => {
  await connectDB();
  try {
    // Xóa dữ liệu cũ (tùy chọn)
    // await Page.deleteMany({});
    // await Product.deleteMany({});
    // await Project.deleteMany({});
    // await Menu.deleteMany({});

    // Tạo trang chủ
    const homePage = new Page({
      slug: 'home',
      title: 'Trang chủ',
      sections: [ /* Dữ liệu JSON ở trên */ ]
    });
    await homePage.save();
    console.log('✅ Home page seeded');

    // Tạo menu
    const mainMenu = new Menu({
      name: 'main-menu',
      items: [
        { label: 'Trang chủ', link: '/', order: 0 },
        { label: 'Giới thiệu', link: '/gioi-thieu', order: 1 },
        { label: 'Sản phẩm', link: '/san-pham', order: 2 },
        { label: 'Dự án', link: '/du-an', order: 3 },
        { label: 'Hồ sơ', link: '/ho-so', order: 4 },
        { label: 'Liên hệ', link: '/lien-he', order: 5 }
      ]
    });
    await mainMenu.save();
    console.log('✅ Menu seeded');

    // Tạo sản phẩm mẫu
    const products = [
      {
        name: 'Decal Mờ Sọc Dọc',
        slug: 'decal-mo-soc-doc',
        description: 'Kiến tạo sự riêng tư tinh tế cho văn phòng.',
        price: 450000,
        category: 'frosted',
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCz-Kl01Uc9mG8frxcyQSc7n8fOjqNcNLBYqSHDZ3mkdfcW3rWmnO1es_2QlRZt4X7quO184MQ6y2spBPOVChymrfM5RYkloV8-ZMweUjM-7Dwn-0FmoGhirHIym0GfI2E7Uc-mDTCXDHD79ADxQEmZINdwGVN46ygFIWuBz1Joo0IbjCWzkHgbYbuiCguuMpQ5GmrClSjcR3wRF2pINQkbAwycs5QG2zHZiIKo9lff-eJDz2xDWUmx8WwgTEgU_LfzZiVYyK4TS0Fo'],
        badge: 'Mới',
        inStock: true
      },
      // Thêm các sản phẩm khác...
    ];

    for (const product of products) {
      await Product.findOneAndUpdate({ slug: product.slug }, product, { upsert: true });
    }
    console.log('✅ Products seeded');

    // Tạo dự án mẫu
    const projects = [
      {
        name: 'Alpha Tech HQ',
        slug: 'alpha-tech-hq',
        category: 'Văn phòng',
        location: 'Quận 1, TP. Hồ Chí Minh',
        year: 2023,
        description: 'Decal kính họa tiết hình học tùy chỉnh cho các phòng họp riêng tư.',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoxCCWh5Pk9MgAzmadW6vP-nQjldiA5JSkol-3Xvb6cVRitfV3UNu63oD_xendeV1ejDWqVFmY_gGLjN3ElnOwQ32KtgWdu1QZvV2OEQhI0DZKEuC_e5-ljYzoP2hC7na0PsynUndrXhbs9IrHrYkzbaf-FmkWwM95kG_Xf4sWmOz4jHcAHzQUFJgOld27fmByM5WLbZww13C1TWxskGvspeD5cTax0VD16CFwyfohTmq0rIGB8UgzQR0yMCMg4LkGiW1uuD2hOE7f',
        images: [],
        stats: { 'Diện tích': '2000m²', 'Phòng': '45+' }
      }
      // Thêm các dự án khác...
    ];

    for (const project of projects) {
      await Project.findOneAndUpdate({ slug: project.slug }, project, { upsert: true });
    }
    console.log('✅ Projects seeded');

    console.log('🎉 Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
