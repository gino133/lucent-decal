const Menu = require('../models/Menu');

exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({ name: req.params.name });
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { name, items } = req.body;
    let menu = await Menu.findOne({ name });
    if (menu) {
      menu.items = items;
      await menu.save();
    } else {
      menu = await Menu.create({ name, items });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};