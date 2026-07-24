import mongoose from "mongoose";
import MenuItem from "../../../models/menu.model";
import { MenuItemMongoRepository } from "../../../repository/menu.repository";

const getMockMenuItem = (overrides = {}) => ({
  name: "Default Item",
  price: 10,
  category: "Main",
  description: "Default description",
  preparationTime: 15,
  restaurantId: new mongoose.Types.ObjectId(),
  isAvailable: true,
  ...overrides,
});

describe("MenuItemMongoRepository", () => {
  const menuItemRepository = new MenuItemMongoRepository();
  const restaurantId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    await MenuItem.deleteMany({});
  });

  test("should create a new menu item", async () => {
    const testItem = getMockMenuItem({
      name: "Pizza Margherita",
      price: 12.99,
      category: "Main",
      restaurantId,
    });

    const created = await menuItemRepository.create(testItem as any);

    expect(created).toBeDefined();
    expect(created).toHaveProperty("_id");
    expect(created.name).toBe(testItem.name);
  });

  test("should find menu items by restaurantId", async () => {
    await MenuItem.create([
      getMockMenuItem({ name: "Burger", price: 8, category: "Main", restaurantId }),
      getMockMenuItem({ name: "Fries", price: 3, category: "Sides", restaurantId }),
    ]);

    const items = await menuItemRepository.findByRestaurantId(restaurantId.toString());
    expect(items).toHaveLength(2);
  });

  test("should find menu items by category", async () => {
    await MenuItem.create([
      getMockMenuItem({ name: "Pasta", price: 10, category: "Main", restaurantId }),
      getMockMenuItem({ name: "Ice Cream", price: 4, category: "Dessert", restaurantId }),
    ]);

    const desserts = await menuItemRepository.findByCategory(restaurantId.toString(), "Dessert");
    expect(desserts).toHaveLength(1);
    expect(desserts[0].name).toBe("Ice Cream");
  });

  test("should find available menu items only", async () => {
    await MenuItem.create([
      getMockMenuItem({ name: "Soda", price: 2, category: "Drinks", restaurantId, isAvailable: true }),
      getMockMenuItem({ name: "Special Wine", price: 50, category: "Drinks", restaurantId, isAvailable: false }),
    ]);

    const available = await menuItemRepository.findAvailable(restaurantId.toString());
    expect(available).toHaveLength(1);
    expect(available[0].name).toBe("Soda");
  });

  test("should update a menu item", async () => {
    const item = await MenuItem.create(
      getMockMenuItem({ name: "Taco", price: 5, category: "Main", restaurantId })
    );

    const updated = await menuItemRepository.update(item._id.toString(), { price: 6 });
    expect(updated).not.toBeNull();
    expect(updated?.price).toBe(6);
  });

  test("should delete a menu item", async () => {
    const item = await MenuItem.create(
      getMockMenuItem({ name: "Soup", price: 4, category: "Starter", restaurantId })
    );

    const success = await menuItemRepository.delete(item._id.toString());
    const found = await MenuItem.findById(item._id);

    expect(success).toBe(true);
    expect(found).toBeNull();
  });
});