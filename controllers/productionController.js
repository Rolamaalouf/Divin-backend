// controllers/productController.js
const supabase = require('../config/supabase');
const { Product } = require('../models');

exports.createProduct = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(`products/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
          contentType: req.file.mimetype,
        });
      
      if (error) return res.status(400).json({ error: 'Image upload failed', details: error });
      
      const { publicURL } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);
      imageUrl = publicURL;
    }
    
    const { name, price, description, category_id, stock } = req.body;
    const product = await Product.create({
      name,
      price,
      description,
      category_id,
      stock,
      image: imageUrl,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    const updatedProduct = await Product.findByPk(id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
