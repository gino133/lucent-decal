// Bọc route async lại để lỗi tự nhảy qua middleware xử lý lỗi chung,
// không thì 1 lỗi quên try/catch có thể làm sập cả server.
// Dùng: router.get("/", asyncHandler(async (req, res) => { ... }));
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
