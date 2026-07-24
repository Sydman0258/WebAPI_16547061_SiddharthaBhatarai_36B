import { RestaurantController } from "../../../controllers/restaurant.controller";
import { RestaurantService } from "../../../services/restaurant.service";
import { ApiResponseHelper } from "../../../utils/api-response";
import { createRestaurantDTO, updateRestaurantDTO } from "../../../dtos/restaurant.dtos";
import { Request, Response } from "express";

jest.mock("../../../services/restaurant.service");
jest.mock("../../../utils/api-response");

jest.mock("../../../dtos/restaurant.dtos", () => ({
  createRestaurantDTO: {
    safeParse: jest.fn(),
  },
  updateRestaurantDTO: {
    safeParse: jest.fn(),
  },
}));

describe("RestaurantController", () => {
  let restaurantController: RestaurantController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    restaurantController = new RestaurantController();

    jest.clearAllMocks();

    mockReq = {
      body: {},
      params: {},
      user: undefined,
      file: undefined,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });


  describe("createRestaurant", () => {

    it("should create restaurant successfully", async () => {

      const restaurantData = {
        name: "Pizza House",
        location: "Kathmandu",
      };

      const createdRestaurant = {
        id: "1",
        ...restaurantData,
      };


      mockReq.body = restaurantData;
      mockReq.user = {
        _id: "user123",
      };


      (createRestaurantDTO.safeParse as jest.Mock)
        .mockReturnValue({
          success: true,
          data: restaurantData,
        });


      (RestaurantService.prototype.createRestaurant as jest.Mock)
        .mockResolvedValue(createdRestaurant);


      await restaurantController.createRestaurant(
        mockReq as Request,
        mockRes as Response
      );


      expect(createRestaurantDTO.safeParse)
        .toHaveBeenCalledWith(restaurantData);


      expect(RestaurantService.prototype.createRestaurant)
        .toHaveBeenCalledWith({
          ...restaurantData,
          userId: "user123",
        });


      expect(ApiResponseHelper.success)
        .toHaveBeenCalledWith(
          mockRes,
          createdRestaurant,
          true,
          201,
          "Restaurant created successfully"
        );

    });


    it("should return validation error when DTO fails", async()=>{

      (createRestaurantDTO.safeParse as jest.Mock)
        .mockReturnValue({
          success:false,
          error:{
            issues:[]
          }
        });


      await restaurantController.createRestaurant(
        mockReq as Request,
        mockRes as Response
      );


      expect(ApiResponseHelper.error)
        .toHaveBeenCalled();

    });



    it("should handle service error", async()=>{

      mockReq.user={
        _id:"user123"
      };


      (createRestaurantDTO.safeParse as jest.Mock)
      .mockReturnValue({
        success:true,
        data:{name:"Test"}
      });


      (RestaurantService.prototype.createRestaurant as jest.Mock)
      .mockRejectedValue(
        new Error("Database failed")
      );


      await restaurantController.createRestaurant(
        mockReq as Request,
        mockRes as Response
      );


      expect(ApiResponseHelper.error)
      .toHaveBeenCalledWith(
        mockRes,
        "Database failed",
        500
      );

    });

  });



  describe("getRestaurantById",()=>{


    it("should return restaurant by id",async()=>{

      const restaurant={
        id:"1",
        name:"Burger Hub"
      };


      mockReq.params={
        id:"1"
      };


      (RestaurantService.prototype.getRestaurantById as jest.Mock)
      .mockResolvedValue(restaurant);



      await restaurantController.getRestaurantById(
        mockReq as Request,
        mockRes as Response
      );


      expect(RestaurantService.prototype.getRestaurantById)
      .toHaveBeenCalledWith("1");


      expect(ApiResponseHelper.success)
      .toHaveBeenCalledWith(
        mockRes,
        restaurant,
        true,
        200,
        "Restaurant retrieved successfully"
      );

    });


  });



  describe("getAllRestaurants",()=>{


    it("should return all restaurants",async()=>{

      const restaurants=[
        {
          id:"1",
          name:"Pizza House"
        }
      ];


      (RestaurantService.prototype.getAllRestaurants as jest.Mock)
      .mockResolvedValue(restaurants);



      await restaurantController.getAllRestaurants(
        mockReq as Request,
        mockRes as Response
      );


      expect(ApiResponseHelper.success)
      .toHaveBeenCalledWith(
        mockRes,
        restaurants,
        true,
        200,
        "Restaurants retrieved successfully"
      );


    });


  });



  describe("getMyRestaurant",()=>{


    it("should return user restaurant",async()=>{


      const restaurant={
        id:"1",
        owner:"user123"
      };


      mockReq.user={
        _id:"user123"
      };


      (RestaurantService.prototype.getRestaurantByUserId as jest.Mock)
      .mockResolvedValue(restaurant);



      await restaurantController.getMyRestaurant(
        mockReq as Request,
        mockRes as Response
      );



      expect(RestaurantService.prototype.getRestaurantByUserId)
      .toHaveBeenCalledWith("user123");


      expect(ApiResponseHelper.success)
      .toHaveBeenCalledWith(
        mockRes,
        restaurant,
        true,
        200,
        "Restaurant retrieved successfully"
      );


    });



    it("should return unauthorized if user missing",async()=>{


      mockReq.user=undefined;


      await restaurantController.getMyRestaurant(
        mockReq as Request,
        mockRes as Response
      );


      expect(ApiResponseHelper.error)
      .toHaveBeenCalledWith(
        mockRes,
        "Unauthorized",
        401
      );


    });


  });



  describe("updateRestaurant",()=>{


    it("should update restaurant successfully",async()=>{


      mockReq.params={
        id:"1"
      };


      mockReq.body={
        name:"Updated Restaurant"
      };


      const updated={
        id:"1",
        name:"Updated Restaurant"
      };


      (updateRestaurantDTO.safeParse as jest.Mock)
      .mockReturnValue({
        success:true,
        data:{
          name:"Updated Restaurant"
        }
      });


      (RestaurantService.prototype.updateRestaurant as jest.Mock)
      .mockResolvedValue(updated);



      await restaurantController.updateRestaurant(
        mockReq as Request,
        mockRes as Response
      );



      expect(RestaurantService.prototype.updateRestaurant)
      .toHaveBeenCalledWith(
        "1",
        {
          name:"Updated Restaurant"
        }
      );


      expect(ApiResponseHelper.success)
      .toHaveBeenCalledWith(
        mockRes,
        updated,
        true,
        200,
        "Restaurant updated successfully"
      );


    });


  });



  describe("deleteRestaurant",()=>{


    it("should delete restaurant successfully",async()=>{


      mockReq.params={
        id:"1"
      };


      (RestaurantService.prototype.deleteRestaurant as jest.Mock)
      .mockResolvedValue(true);



      await restaurantController.deleteRestaurant(
        mockReq as Request,
        mockRes as Response
      );



      expect(RestaurantService.prototype.deleteRestaurant)
      .toHaveBeenCalledWith("1");


      expect(ApiResponseHelper.success)
      .toHaveBeenCalledWith(
        mockRes,
        null,
        true,
        200,
        "Restaurant deleted successfully"
      );


    });


  });


});