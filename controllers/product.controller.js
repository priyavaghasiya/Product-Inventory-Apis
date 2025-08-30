import productSchema from "../model/product.model.js";
import categorySchema from "../model/category.model.js";

//create product
export const createProduct = async (req, res) => {
  try {
    const productData = new productSchema({
      product_name: req.body.product_name,
      category_id: req.body.category_id,
      description: req.body.description,
      quantity: req.body.quantity,
    });
    const createData = await productData.save();

    res.status(201).json(createData);
  } catch (error) {
    res.status(404).json({ msg: "Something went wrong", err: error.message });
  }
};

//list of products with search and filters
export const listofProducts = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, categories } = req.body;

    let query = {};

    if (search && search.trim() !== "") {
      query.product_name = { $regex: search.trim(), $options: "i" };
    }

    if (categories && categories.length > 0) {
      query.category_id = { $in: categories };
    }

    const total = await productSchema.countDocuments(query);
    const products = await productSchema.find(query).skip(skip).limit(limit);

    console.log("Products Found:", products);

    const results = await Promise.all(
      products.map(async (product) => {
        const categoryIds = product.category_id;

        const categories = await categorySchema.find(
          { _id: { $in: categoryIds } },
          { name: 1 }
        );

        return {
          _id: product._id,
          product_name: product.product_name,
          category_names: categories.map((c) => c.name).join(","),
          description: product.description,
          quantity: product.quantity,
          created_at: product.created_at,
          __v: product.__v,
        };
      })
    );

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      products: results,
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", err: error.message });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
    await productSchema
      .findByIdAndDelete({ _id: req.params.id })
      .then((_) =>
        res.status(200).json({ msg: "Product deleted successfully" })
      )
      .catch((err) => res.status(400).json({ msg: "Something went wrong" }));
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};
