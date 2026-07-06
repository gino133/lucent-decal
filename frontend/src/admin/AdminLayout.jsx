// Thêm import PageList
import PageList from './PageList';

// Trong phần routes của admin:
<Route index element={<Dashboard />} />
<Route path="pages" element={<PageList />} />           {/* Danh sách */}
<Route path="pages/:slug?" element={<PageEditor />} />  {/* Chi tiết (sửa mới) */}