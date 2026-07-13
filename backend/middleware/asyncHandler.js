// Bọc quanh mỗi route "async (req,res) => {...}" để tự động bắt lỗi và
// chuyển sang middleware xử lý lỗi chung (trả JSON rõ ràng cho client),
// thay vì để lỗi "rơi tự do" thành unhandledRejection có thể ảnh hưởng cả server.
// Cách dùng: router.get("/", asyncHandler(async (req, res) => { ... }));
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
