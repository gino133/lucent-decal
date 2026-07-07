export default function CheckoutSuccessPage({ searchParams }) {
  return (
    <div className="pt-40 pb-20 text-center px-margin-mobile">
      <span className="material-symbols-outlined text-6xl text-green-500">check_circle</span>
      <h1 className="font-heading text-2xl font-bold mt-4">Đặt hàng thành công!</h1>
      <p className="text-on-background/60 mt-2">
        Mã đơn hàng: <strong>{searchParams?.code}</strong>. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
      </p>
    </div>
  );
}
