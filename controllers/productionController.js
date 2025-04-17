// controllers/productController.js
const supabase = require('../config/supabase');
const { Product } = require('../models');


exports.createProduct = async (req, res) => {
  try {
    console.log("req.files:", req.files);

    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(`products/${Date.now()}-${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) return res.status(400).json({ error: 'Image upload failed', details: error });

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    const { name, price, description, category_id, stock } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      category_id,
      stock,
      image: imageUrls.length > 0 ? imageUrls : null,
    });

    console.log("Final product object:", product);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error during product creation:", error);
    res.status(500).json({ error: 'Server error' });
  }
};




exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({ products });
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
    console.log("Update request for product ID:", id);

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, description, category_id, stock } = req.body;
    const imageUrls = [];

    // Upload new images if available
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(`products/${Date.now()}-${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) {
          console.error('Image upload failed:', error);
          return res.status(400).json({ error: 'Image upload failed', details: error });
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    // Update fields and images
    await product.update({
      name: name ?? product.name,
      price: price ?? product.price,
      description: description ?? product.description,
      category_id: category_id ?? product.category_id,
      stock: stock ?? product.stock,
      image: imageUrls.length > 0 ? imageUrls : product.image, // Replace only if new images are uploaded
    });

    res.json(product);
  } catch (error) {
    console.error("Error during product update:", error);
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

