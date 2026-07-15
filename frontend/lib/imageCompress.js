const MAX_DIMENSION = 1920; // px cạnh dài nhất, đủ nét cho web mà nhẹ hơn nhiều ảnh gốc
const JPEG_QUALITY = 0.82;

// nén/resize ảnh ngay trên trình duyệt trước khi upload — ảnh điện thoại hay nặng
// 5-15MB, dễ timeout khi server yếu, nén xuống vài trăm KB thì ổn định hơn hẳn
export function compressImage(file) {
  return new Promise((resolve) => {
    if (file.type === "image/gif" || file.size < 400 * 1024) return resolve(file);

    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) return resolve(file);
            resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
          },
          "image/jpeg",
          JPEG_QUALITY
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
