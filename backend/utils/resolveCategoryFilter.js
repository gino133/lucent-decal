const mongoose = require("mongoose");
const Category = require("../models/Category");

// Link ngoài website gửi category dưới dạng SLUG (vd: "van-go"),
// nhưng dữ liệu Product/Project/Post lưu category dưới dạng ObjectId.
// Hàm này nhận giá trị category từ query string (có thể là slug HOẶC id)
// và trả về ObjectId tương ứng để lọc đúng, hoặc null nếu không tìm thấy.
async function resolveCategoryId(categoryParam) {
  if (!categoryParam) return undefined; // không lọc theo danh mục
  if (mongoose.Types.ObjectId.isValid(categoryParam)) return categoryParam;
  const cat = await Category.findOne({ slug: categoryParam });
  return cat ? cat._id : null; // null = có truyền nhưng không khớp danh mục nào -> trả rỗng
}

module.exports = { resolveCategoryId };
