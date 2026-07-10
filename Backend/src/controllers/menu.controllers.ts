import z from "zod";
import { createMenuItemDTO, updateMenuItemDTO } from "../dtos/menu.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { MenuItemService } from "../services/menu.service";
import { ApiResponseHelper } from "../utils/api-response";
import { Response, Request } from "express";
import path from "path";

const menuItemService = new MenuItemService();

export class MenuItemController {

    async createMenuItem(req: Request, res: Response) {
        try {
            const { restaurantId } = req.params as { restaurantId: string };
            const parseResult = createMenuItemDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const data = {
                ...parseResult.data,
                ...(req.file && { imageUrl: `/uploads/${path.basename(req.file.destination)}/${req.file.filename}` }),
            };
            const menuItem = await menuItemService.createMenuItem(restaurantId, data);
            return ApiResponseHelper.success(res, menuItem, true, 201, "Menu item created");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to create menu item", err?.status || 500);
        }
    }

    async getMenuItemById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const menuItem = await menuItemService.getMenuItemById(id);
            return ApiResponseHelper.success(res, menuItem, true, 200, "Menu item retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get menu item", err?.status || 500);
        }
    }

    async getMenuByRestaurant(req: Request, res: Response) {
        try {
            const { restaurantId } = req.params as { restaurantId: string };
            const menu = await menuItemService.getMenuByRestaurant(restaurantId);
            return ApiResponseHelper.success(res, menu, true, 200, "Menu retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get menu", err?.status || 500);
        }
    }

    async getMenuByCategory(req: Request, res: Response) {
        try {
            const { restaurantId, category } = req.params as { restaurantId: string; category: string };
            const menu = await menuItemService.getMenuByCategory(restaurantId, category);
            return ApiResponseHelper.success(res, menu, true, 200, "Menu retrieved by category");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get menu by category", err?.status || 500);
        }
    }

    async getAvailableMenu(req: Request, res: Response) {
        try {
            const { restaurantId } = req.params as { restaurantId: string };
            const menu = await menuItemService.getAvailableMenu(restaurantId);
            return ApiResponseHelper.success(res, menu, true, 200, "Available menu retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get available menu", err?.status || 500);
        }
    }

    async updateMenuItem(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const parseResult = updateMenuItemDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const data = {
                ...parseResult.data,
                ...(req.file && { imageUrl: `/uploads/${path.basename(req.file.destination)}/${req.file.filename}` }),
            };
            const updated = await menuItemService.updateMenuItem(id, data);
            return ApiResponseHelper.success(res, updated, true, 200, "Menu item updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to update menu item", err?.status || 500);
        }
    }

    async toggleAvailability(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const updated = await menuItemService.toggleAvailability(id);
            return ApiResponseHelper.success(res, updated, true, 200, "Availability toggled");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to toggle availability", err?.status || 500);
        }
    }

    async deleteMenuItem(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            await menuItemService.deleteMenuItem(id);
            return ApiResponseHelper.success(res, null, true, 200, "Menu item deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to delete menu item", err?.status || 500);
        }
    }
}