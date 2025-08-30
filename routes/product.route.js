import express, { Router } from "express";

const router = express.Router();

import {
  createProduct,
  listofProducts,
  deleteProduct,
} from "../controllers/product.controller.js";

router.post("/create_product", createProduct);
router.post("/listof_products", listofProducts);
router.delete("/delete_product/:id", deleteProduct);

export default router;
