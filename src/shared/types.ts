import z from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  original_price: z.number().nullable(),
  image_url: z.string().nullable(),
  category_id: z.number().nullable(),
  category_name: z.string().nullable(),
  stock_quantity: z.number(),
  is_featured: z.number(), // SQLite boolean as 0/1
  rating: z.number(),
  review_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CartItemSchema = z.object({
  id: z.number(),
  session_id: z.string(),
  product_id: z.number(),
  quantity: z.number(),
  name: z.string(),
  price: z.number(),
  image_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
