import { useEffect, useState } from 'react';
import { getPage } from '../services/api';
import SectionRenderer from '../components/SectionRenderer';

const Contact = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPage('lien-he')
      .then(res => setPageData(res.data))
      .catch(() => setPageData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-32 text-center">Đang tải...</div>;
  if (!pageData) return <div className="pt-32 text-center">Không tìm thấy trang</div>;

  return (
    <main className="pt-20">
      {pageData.sections?.map(section => (
        <SectionRenderer key={section._id || section.order} section={section} />
      ))}
    </main>
  );
};

export default Contact;