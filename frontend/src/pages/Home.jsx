import { useEffect, useState } from 'react';
import { getPage } from '../services/api';
import SectionRenderer from '../components/SectionRenderer';

const Home = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPage('home')
      .then(res => setPageData(res.data))
      .catch(err => {
        console.error('Failed to load home page', err);
        // Fallback: tạo dữ liệu mẫu từ file HTML (nếu cần)
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-32 text-center">Đang tải...</div>;
  if (!pageData) return <div className="pt-32 text-center">Không tìm thấy trang chủ</div>;

  return (
    <main className="pt-20">
      {pageData.sections?.map(section => (
        <SectionRenderer key={section._id || section.order} section={section} />
      ))}
    </main>
  );
};

export default Home;