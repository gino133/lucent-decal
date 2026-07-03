const Footer = () => {
  return (
    <footer className="w-full py-20 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-t border-on-surface/10">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="col-span-1">
          <div className="text-headline-md font-headline-md text-on-surface mb-6 uppercase">Lucent Glass</div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Định hình tương lai của không gian kiến trúc thông qua nghệ thuật kính và giải pháp decal sáng tạo.
          </p>
          <div className="flex space-x-4">
            <a className="text-on-surface-variant hover:text-secondary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
            <a className="text-on-surface-variant hover:text-secondary transition-colors" href="#"><span className="material-symbols-outlined">mail</span></a>
            <a className="text-on-surface-variant hover:text-secondary transition-colors" href="#"><span className="material-symbols-outlined">phone</span></a>
          </div>
        </div>
        {/* Thêm các cột khác nếu cần */}
        <div>
          <h4 className="font-label-bold text-label-bold text-on-surface mb-6 uppercase tracking-wider">Khám phá</h4>
          <ul className="space-y-4">
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Decal Văn Phòng</a></li>
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Kính Nghệ Thuật</a></li>
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Thi Công Trọn Gói</a></li>
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Dự án tùy chỉnh</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-bold text-label-bold text-on-surface mb-6 uppercase tracking-wider">Công ty</h4>
          <ul className="space-y-4">
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Về chúng tôi</a></li>
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Dự án tiêu biểu</a></li>
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Chính sách bảo mật</a></li>
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Điều khoản sử dụng</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-bold text-label-bold text-on-surface mb-6 uppercase tracking-wider">Cập nhật</h4>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">Đăng ký nhận thông tin về các xu hướng kiến trúc kính mới nhất.</p>
          <div className="flex">
            <input className="bg-surface-container-lowest border border-outline px-4 py-2 w-full rounded-l-lg focus:outline-none focus:border-secondary-fixed" placeholder="Email của bạn" type="email" />
            <button className="bg-secondary-fixed text-on-secondary-fixed px-4 rounded-r-lg hover:bg-secondary-fixed-dim transition-colors">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto mt-20 pt-8 border-t border-on-surface/5 flex flex-col md:flex-row justify-between items-center text-on-surface-variant font-label-bold text-label-bold">
        <p>© 2024 Lucent Glass &amp; Decals. Sự chính xác trong từng tấm kính.</p>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <span>Thiết kế với độ chính xác kiến trúc</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;