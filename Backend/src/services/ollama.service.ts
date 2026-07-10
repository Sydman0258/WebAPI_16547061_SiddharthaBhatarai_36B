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
        .populate("restaurantId", "name")
        .limit(15)
        .select("name price description category restaurantId")
        .lean();

    const context = menuItems
        .map((item: any) => {
            const restaurantName = item.restaurantId?.name ?? "Unknown restaurant";
            return `- ${item.name} ($${item.price}) at ${restaurantName} [${item.category}] — ${item.description}`;
        })
        .join("\n");

    const fullPrompt = `
You are a food recommendation assistant for a food delivery app.
Here is real, currently available menu data pulled from the database:

${context || "No matching menu items found."}

Using ONLY the menu data above, answer the user's question.
Do not invent menu items, prices, or restaurants that are not listed above.
If nothing matches, say so honestly.

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