const Page = require('../models/Page');

// Lấy tất cả pages (cho admin)
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().select('slug title').sort('slug');
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy một page theo slug
exports.getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo hoặc cập nhật page
exports.upsertPage = async (req, res) => {
  try {
    const { slug, title, sections } = req.body;
    let page = await Page.findOne({ slug });
    if (page) {
      page.title = title;
      page.sections = sections;
      await page.save();
    } else {
      page = await Page.create({ slug, title, sections });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa page
exports.deletePage = async (req, res) => {
  try {
    await Page.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};