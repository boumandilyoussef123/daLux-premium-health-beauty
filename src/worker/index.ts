import { Env, Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for frontend
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Get all categories
app.get("/api/categories", async (c) => {
  try {
    const db = c.env.DB;
    const categories = await db
      .prepare("SELECT * FROM categories ORDER BY name")
      .all();
    return c.json(categories.results);
  } catch (error) {
    return c.json({ error: `Failed to fetch categories ${error}` }, 500);
  }
});

// Get all products or filter by category
app.get("/api/products", async (c) => {
  try {
    const db = c.env.DB;
    const categoryId = c.req.query("category");
    const featured = c.req.query("featured");
    const search = c.req.query("search");

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (categoryId) {
      conditions.push("p.category_id = ?");
      params.push(categoryId);
    }

    if (featured === "true") {
      conditions.push("p.is_featured = 1");
    }

    if (search) {
      conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.created_at DESC";

    const products = await db
      .prepare(query)
      .bind(...params)
      .all();
    return c.json(products.results);
  } catch (error) {
    return c.json({ error: `Failed to fetch products ${error}` }, 500);
  }
});

// Get single product
app.get("/api/products/:id", async (c) => {
  try {
    const db = c.env.DB;
    const productId = c.req.param("id");

    const product = await db
      .prepare(
        `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `
      )
      .bind(productId)
      .first();

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json(product);
  } catch (error) {
    return c.json({ error: `Failed to fetch product${error}` }, 500);
  }
});

// Add to cart
app.post("/api/cart", async (c) => {
  try {
    const db = c.env.DB;
    const { sessionId, productId, quantity = 1 } = await c.req.json();

    // Check if item already exists in cart
    const existingItem = await db
      .prepare(
        "SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?"
      )
      .bind(sessionId, productId)
      .first();

    if (existingItem) {
      // Update quantity
      await db
        .prepare(
          "UPDATE cart_items SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        )
        .bind(quantity, existingItem.id)
        .run();
    } else {
      // Add new item
      await db
        .prepare(
          "INSERT INTO cart_items (session_id, product_id, quantity) VALUES (?, ?, ?)"
        )
        .bind(sessionId, productId, quantity)
        .run();
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: `Failed to add to cart ${error}` }, 500);
  }
});

// Get cart items
app.get("/api/cart/:sessionId", async (c) => {
  try {
    const db = c.env.DB;
    const sessionId = c.req.param("sessionId");

    const cartItems = await db
      .prepare(
        `
      SELECT ci.*, p.name, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ?
    `
      )
      .bind(sessionId)
      .all();

    return c.json(cartItems.results);
  } catch (error) {
    return c.json({ error: `Failed to fetch cart ${error}` }, 500);
  }
});

// Update cart item quantity
app.put("/api/cart/:id", async (c) => {
  try {
    const db = c.env.DB;
    const itemId = c.req.param("id");
    const { quantity } = await c.req.json();

    if (quantity <= 0) {
      await db
        .prepare("DELETE FROM cart_items WHERE id = ?")
        .bind(itemId)
        .run();
    } else {
      await db
        .prepare(
          "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        )
        .bind(quantity, itemId)
        .run();
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: `Failed to update cart ${error}` }, 500);
  }
});

// Remove cart item
app.delete("/api/cart/:id", async (c) => {
  try {
    const db = c.env.DB;
    const itemId = c.req.param("id");

    await db.prepare("DELETE FROM cart_items WHERE id = ?").bind(itemId).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: `Failed to remove from cart ${error}` }, 500);
  }
});

export default app;
