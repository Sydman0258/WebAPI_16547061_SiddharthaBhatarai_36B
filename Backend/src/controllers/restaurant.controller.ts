import z from "zod";
import { createRestaurantDTO, updateRestaurantDTO } from "../dtos/restaurant.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { RestaurantService } from "../services/restaurant.service";
import { ApiResponseHelper } from "../utils/api-response";
import { Response, Request, NextFunction } from "express";
import path from "path";

const restaurantService = new RestaurantService();

export class RestaurantController {

  async createRestaurant(req: Request, res: Response) {
    try {
      const parseResult = createRestaurantDTO.safeParse(req.body);
      if (!parseResult.success) {
        throw new HttpException(400, z.prettifyError(parseResult.error));
      }
      const restaurantData = {
        ...parseResult.data,
        userId: req.user?._id,
        ...(req.file && {
          restaurantImage: `/uploads/${path.basename(req.file.destination)}/${req.file.filename}`,
        }),
      };
      const restaurant = await restaurantService.createRestaurant(restaurantData);
      return ApiResponseHelper.success(
        res,
        restaurant,
        true,
        201,
        "Restaurant created successfully"
      );
    } catch (err: Error | unknown | any) {
      return ApiResponseHelper.error(
        res,
        err?.message || "Failed to create restaurant",
        err.status || 500
      );
    }
  }

  async getRestaurantById(req: Request, res: Response) {
    try {
      const { id } = req.params as {id:string};
      const restaurant = await restaurantService.getRestaurantById(id);
      return ApiResponseHelper.success(
        res,
        restaurant,
        true,
        200,
        "Restaurant retrieved successfully"
      );
    } catch (err: Error | unknown | any) {
      return ApiResponseHelper.error(
        res,
        err?.message || "Failed to get restaurant",
        err.status || 500
      );
    }
  }

  async getAllRestaurants(req: Request, res: Response) {
    try {
      const restaurants = await restaurantService.getAllRestaurants();
      return ApiResponseHelper.success(
        res,
        restaurants,
        true,
        200,
        "Restaurants retrieved successfully"
      );
    } catch (err: Error | unknown | any) {
      return ApiResponseHelper.error(
        res,
        err?.message || "Failed to get restaurants",
        err.status || 500
      );
    }
  }

  async getMyRestaurant(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        throw new HttpException(401, "Unauthorized");
      }
      const restaurant = await restaurantService.getRestaurantByUserId(userId);
      return ApiResponseHelper.success(
        res,
        restaurant,
        true,
        200,
        "Restaurant retrieved successfully"
      );
    } catch (err: Error | unknown | any) {
      return ApiResponseHelper.error(
        res,
        err?.message || "Failed to get restaurant",
        err.status || 500
      );
    }
  }

  async updateRestaurant(req: Request, res: Response) {
    try {
      const { id } = req.params as {id:string};
      const parseResult = updateRestaurantDTO.safeParse(req.body);
      if (!parseResult.success) {
        throw new HttpException(400, z.prettifyError(parseResult.error));
      }
      const updateData = {
        ...parseResult.data,
        ...(req.file && {
          restaurantImage: `/uploads/${path.basename(req.file.destination)}/${req.file.filename}`,
        }),
      };
      const updated = await restaurantService.updateRestaurant(id, updateData);
      return ApiResponseHelper.success(
        res,
        updated,
        true,
        200,
        "Restaurant updated successfully"
      );
    } catch (err: Error | unknown | any) {
      return ApiResponseHelper.error(
        res,
        err?.message || "Failed to update restaurant",
        err.status || 500
      );
    }
  }

  async deleteRestaurant(req: Request, res: Response) {
    try {
      const { id } = req.params as {id:string};
      await restaurantService.deleteRestaurant(id);
      return ApiResponseHelper.success(
        res,
        null,
        true,
        200,
        "Restaurant deleted successfully"
      );
    } catch (err: Error | unknown | any) {
      return ApiResponseHelper.error(
        res,
        err?.message || "Failed to delete restaurant",
        err.status || 500
      );
    }
  }
}