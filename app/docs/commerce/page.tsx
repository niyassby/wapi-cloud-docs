import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Commerce & Catalogs — wapi-cloud docs" };

export default function CommercePage() {
  return (
    <>
      <PageHeader
        eyebrow="API reference"
        title="Commerce & Catalogs"
        description="Manage product catalogs, create and update catalog inventory, configure WhatsApp commerce settings, and send interactive shopping messages."
      />

      <p>
        The WhatsApp Cloud API commerce suite consists of three focused modules:
      </p>
      <ul>
        <li>
          <code>whatsapp.catalogs</code> — List and inspect Meta product catalogs and send product messages.
        </li>
        <li>
          <code>whatsapp.products</code> — Create, list, update, and delete products within a catalog.
        </li>
        <li>
          <code>whatsapp.commerceSettings</code> — Toggle catalog visibility and the in-chat shopping cart.
        </li>
      </ul>

      <h2>whatsapp.catalogs</h2>
      <p>
        Manage Meta product catalogs attached to your Meta Business Manager and send interactive catalog messages.
      </p>

      <h3>list</h3>
      <MethodSignature>{"whatsapp.catalogs.list(): Promise<WhatsappResponse<PaginatedResult<WhatsappCatalog>>>"}</MethodSignature>
      <p>
        Lists catalogs owned by the configured Meta Business Manager account. Requires <code>businessId</code> (your Meta Business Manager ID, not the WABA ID) in the client constructor.
      </p>
      <CodeBlock
        filename="catalogs.ts"
        lang="ts"
        code={`const { data, error } = await whatsapp.catalogs.list();

if (error) {
  console.error("Failed to list catalogs:", error.message);
} else {
  data.items.forEach((c) => {
    console.log(c.id, c.name, c.product_count, c.vertical);
  });
}`}
      />

      <h3>get</h3>
      <MethodSignature>{"whatsapp.catalogs.get(catalogId: string): Promise<WhatsappResponse<WhatsappCatalog>>"}</MethodSignature>
      <p>
        Fetches metadata for a specific catalog by ID. Works with a known <code>catalogId</code> even if <code>businessId</code> is omitted in the config.
      </p>
      <CodeBlock
        lang="ts"
        code={`const { data: catalog, error } = await whatsapp.catalogs.get("1234567890");
if (catalog) {
  console.log(catalog.name, catalog.product_count);
}`}
      />

      <h3>listConnectedToWaba</h3>
      <MethodSignature>{"whatsapp.catalogs.listConnectedToWaba(businessAccountId: string): Promise<WhatsappResponse<{ data: WhatsappCatalog[] }>>"}</MethodSignature>
      <p>
        Checks which catalog(s) are connected to your WhatsApp Business Account (WABA) for sending product messages.
      </p>
      <CodeBlock
        lang="ts"
        code={`const { data } = await whatsapp.catalogs.listConnectedToWaba(process.env.WA_WABA_ID!);
console.log("Connected catalogs:", data?.data);`}
      />

      <h3>Catalog message sending helpers</h3>
      <p>
        <code>whatsapp.catalogs</code> provides convenient delegates to the messages module for sending products to customers:
      </p>
      <CodeBlock
        filename="send-products.ts"
        lang="ts"
        code={`// 1. Send a single product message
await whatsapp.catalogs.sendProduct("15551234567", {
  catalogId: "1234567890",
  productRetailerId: "SKU-1001",
  body: "Check out our latest espresso machine!",
  footer: "Free shipping available",
});

// 2. Send a multi-product list message (up to 30 products across 10 sections)
await whatsapp.catalogs.sendProductList("15551234567", {
  catalogId: "1234567890",
  header: "Summer Menu",
  body: "Select an item to view details or add to your cart:",
  footer: "In stock now",
  sections: [
    {
      title: "Hot Drinks",
      productRetailerIds: ["COFFEE-LATTE", "COFFEE-CAPPUCCINO"],
    },
    {
      title: "Pastries",
      productRetailerIds: ["PASTRY-CROISSANT", "PASTRY-MUFFIN"],
    },
  ],
});

// 3. Send entire catalog view message
await whatsapp.catalogs.sendCatalog("15551234567", {
  body: "Explore our complete store catalog:",
  footer: "Tap View catalog below",
  thumbnailProductRetailerId: "COFFEE-LATTE", // optional thumbnail
});

// 4. Send a swipeable product carousel (2 to 10 products)
await whatsapp.catalogs.sendProductCarousel("15551234567", {
  body: "Featured products on sale this week:",
  cards: [
    { catalogId: "1234567890", productRetailerId: "SKU-1001" },
    { catalogId: "1234567890", productRetailerId: "SKU-1002" },
    { catalogId: "1234567890", productRetailerId: "SKU-1003" },
  ],
});`}
      />

      <h2>whatsapp.products</h2>
      <p>
        Manage the product items inside a Meta catalog directly via the Graph API.
      </p>

      <h3>list</h3>
      <MethodSignature>{"whatsapp.products.list(catalogId: string, params?: ListProductsParams): Promise<WhatsappResponse<PaginatedResult<WhatsappProduct>>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const { data: products, error } = await whatsapp.products.list("1234567890", {
  limit: 50,
});

if (products) {
  products.items.forEach((p) => {
    console.log(p.retailer_id, p.name, p.price, p.currency, p.availability);
  });
}`}
      />

      <h3>get</h3>
      <MethodSignature>{"whatsapp.products.get(productId: string): Promise<WhatsappResponse<WhatsappProduct>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const { data: product } = await whatsapp.products.get("prod_987654");
console.log(product?.name, product?.price, product?.availability);`}
      />

      <h3>create</h3>
      <MethodSignature>{"whatsapp.products.create(catalogId: string, input: CreateProductInput): Promise<WhatsappResponse<{ id: string }>>"}</MethodSignature>
      <CodeBlock
        filename="create-product.ts"
        lang="ts"
        code={`const { data, error } = await whatsapp.products.create("1234567890", {
  retailerId: "SKU-1004",
  name: "Ceramic Coffee Mug (12oz)",
  description: "Handcrafted ceramic mug with heat-resistant handle.",
  price: 1999, // in minor currency units (e.g. $19.99 = 1999 cents)
  currency: "USD",
  imageUrl: "https://example.com/images/mug-12oz.jpg",
  url: "https://example.com/products/ceramic-mug",
  availability: "in stock",
  condition: "new",
  brand: "ArtisanCraft",
  category: "Home & Garden > Kitchen & Dining > Tableware > Drinkware > Mugs",
});

if (error) console.error("Error creating product:", error.message);
else console.log("Created product ID:", data.id);`}
      />

      <h3>update</h3>
      <MethodSignature>{"whatsapp.products.update(productId: string, patch: UpdateProductInput): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.products.update("prod_987654", {
  price: 1799,
  availability: "in stock",
});`}
      />

      <h3>delete</h3>
      <MethodSignature>{"whatsapp.products.delete(productId: string): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const { data } = await whatsapp.products.delete("prod_987654");
console.log("Deleted:", data?.success);`}
      />

      <h2>whatsapp.commerceSettings</h2>
      <p>
        Check and update the commerce configuration for your WhatsApp phone number.
      </p>

      <h3>get</h3>
      <MethodSignature>{"whatsapp.commerceSettings.get(opts?: { phoneNumberId?: string }): Promise<WhatsappResponse<CommerceSettings>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const { data: settings } = await whatsapp.commerceSettings.get();
console.log("Catalog visible:", settings?.is_catalog_visible);
console.log("Cart enabled:", settings?.is_cart_enabled);`}
      />

      <h3>update</h3>
      <MethodSignature>{"whatsapp.commerceSettings.update(input: UpdateCommerceSettingsInput, opts?: { phoneNumberId?: string }): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.commerceSettings.update({
  isCatalogVisible: true,
  isCartEnabled: true,
});`}
      />

      <h2>Type reference</h2>
      <ParamTable
        rows={[
          {
            name: "retailerId",
            type: "string",
            required: true,
            description: "Your SKU or product identifier. Must match productRetailerId when sending messages.",
          },
          {
            name: "price",
            type: "number",
            required: true,
            description: "Price in the smallest currency unit (e.g. cents: 1999 for $19.99).",
          },
          {
            name: "availability",
            type: '"in stock" | "out of stock" | "preorder" | "available for order" | "discontinued"',
            description: "Inventory status for the product.",
          },
          {
            name: "condition",
            type: '"new" | "refurbished" | "used"',
            description: "Condition of the item.",
          },
          {
            name: "isCatalogVisible",
            type: "boolean",
            description: "Controls whether the catalog icon appears on your WhatsApp Business profile.",
          },
          {
            name: "isCartEnabled",
            type: "boolean",
            description: "Controls whether customers can add products to an in-chat cart and submit order messages.",
          },
        ]}
      />
    </>
  );
}
