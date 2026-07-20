const mongoose = require("mongoose");
const Category = require("../models/Category");

// Ngoài site gửi category bằng slug (vd "van-go"), nhưng DB lưu bằng ObjectId.
// Hàm này nhận cả 2 kiểu, trả về đúng ObjectId để lọc, null nếu không khớp.
async function resolveCategoryId(categoryParam) {
  if (!categoryParam) return undefined;
  if (mongoose.Types.ObjectId.isValid(categoryParam)) return categoryParam;
  const cat = await Category.findOne({ slug: categoryParam });
  return cat ? cat._id : null;
}

module.exports = { resolveCategoryId };
