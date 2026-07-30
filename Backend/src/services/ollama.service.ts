import axios from "axios";
import MenuItem from "../models/menu.model";

export async function askOllama(prompt: string) {
    const lowerPrompt = prompt.toLowerCase();

    const isBudgetQuery = /cheap|budget|affordable|low.?cost|inexpensive/.test(
        lowerPrompt
    );

    const priceMatch = lowerPrompt.match(/under\s*\$?(\d+)/);
    const maxPrice = priceMatch ? Number(priceMatch[1]) : null;

    let query = MenuItem.find({ isAvailable: true });

    if (maxPrice) {
        query = query.where("price").lte(maxPrice);
    }

    if (isBudgetQuery) {
        query = query.sort({ price: 1 }); // cheapest first
    }

    const menuItems = await query
        .populate("restaurantId", "restaurantName")
        .limit(15)
        .select("name price description category restaurantId")
        .lean();

    const context = menuItems
        .map((item: any) => {
const restaurantName =
    item.restaurantId?.restaurantName ?? "Unknown restaurant";
                return `- ${item.name} ($${item.price}) at ${restaurantName} [${item.category}] — ${item.description}`;
        })
        .join("\n");

    const fullPrompt = `
You are a food recommendation assistant for a Nepal-based food delivery app.

Here is the real, currently available menu data pulled from the database:

${context || "No matching menu items found."}

Rules:
- Use ONLY the menu data above.
- Do NOT invent menu items, restaurants, or prices.
- All prices are in Nepalese Rupees (Rs.).
- NEVER use "$", "USD", or dollars.
- Whenever mentioning a price, always write it as "Rs. <amount>".
- If nothing matches the user's request, clearly state that no matching menu items were found.

Example:
Correct: Chicken Momo - Rs. 250
Correct: Pizza - Rs. 650
Wrong: Chicken Momo - $250
Wrong: Pizza - USD 650

Now answer the user's question.
User question: ${prompt}
`.trim();

    const response = await axios.post(
        "http://localhost:11434/api/generate",
        {
            model: "qwen2.5-coder:3b",
            prompt: fullPrompt,
            stream: false,
        }
    );

    return response.data.response;
}