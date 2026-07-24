import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import OrderModel from '../../models/order.model';
import UserModel from '../../models/user.model';
import RestaurantModel from '../../models/restaurant.model';
import MenuItemModel from '../../models/menu.model';
import DriverModel from '../../models/driver.model';

describe('Order API Integration Tests', () => {

    const testCustomer = {
        fullname: 'Order Test Customer',
        email: 'ordercustomer@example.com',
        username: 'ordercustomer',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'customer',
        phoneNumber: '9811111111'
    };

    let mockRestaurantId: string;
    let mockMenuItemId: string;
    let mockDriverId: string;

    let testRestaurantUserId: string;
    let testDriverUserId: string;

    let customerToken: string;
    let createdOrderId: string;

    beforeAll(async () => {
        // Cleanup existing test user and orders and other test entities
        await UserModel.deleteOne({ email: testCustomer.email });
        await UserModel.deleteOne({ email: 'restaurantowner@example.com' });
        await UserModel.deleteOne({ email: 'testdriver@example.com' });
        await RestaurantModel.deleteMany({ restaurantName: 'Test Restaurant' });
        await MenuItemModel.deleteMany({ name: 'Momo', description: 'Yummy test momo' });
        await DriverModel.deleteMany({ vehicleNumber: 'BA 1 PA 1234' });
        await OrderModel.deleteMany({ deliveryAddress: '123 Main St, Kathmandu' });

        // Register customer and obtain token
        await request(app)
            .post('/api/v1/customer/register')
            .send(testCustomer);

        const loginRes = await request(app)
            .post('/api/v1/customer/login')
            .send({
                email: testCustomer.email,
                password: testCustomer.password
            });

        customerToken = loginRes.body.data.token;

        // Create Restaurant User
        const restaurantUser = await UserModel.create({
            fullname: 'Test Restaurant Owner',
            email: 'restaurantowner@example.com',
            username: 'restaurantowner',
            password: 'password123',
            role: 'restaurant',
            phoneNumber: '9811111112'
        });
        testRestaurantUserId = restaurantUser._id.toString();

        // Create Restaurant
        const restaurant = await RestaurantModel.create({
            userId: restaurantUser._id,
            restaurantName: 'Test Restaurant',
            description: 'Delicious test food',
            location: 'Kathmandu',
            status: true,
            openingHours: '09:00 AM - 10:00 PM',
            foodTypes: ['Momo', 'Burger']
        });
        mockRestaurantId = restaurant._id.toString();

        // Create Menu Item
        const menuItem = await MenuItemModel.create({
            restaurantId: restaurant._id,
            name: 'Momo',
            description: 'Yummy test momo',
            price: 250,
            category: 'Veg',
            isAvailable: true,
            preparationTime: 15
        });
        mockMenuItemId = menuItem._id.toString();

        // Create Driver User
        const driverUser = await UserModel.create({
            fullname: 'Test Driver',
            email: 'testdriver@example.com',
            username: 'testdriver',
            password: 'password123',
            role: 'driver',
            phoneNumber: '9811111113'
        });
        testDriverUserId = driverUser._id.toString();

        // Create Driver
        const driver = await DriverModel.create({
            userId: driverUser._id,
            vehicleType: 'Bike',
            vehicleNumber: 'BA 1 PA 1234',
            isAvailable: true,
            currentLocation: 'Kathmandu',
            isVerified: true
        });
        mockDriverId = driver._id.toString();
    });

    afterAll(async () => {
        await UserModel.deleteOne({ email: testCustomer.email });
        if (testRestaurantUserId) {
            await UserModel.findByIdAndDelete(testRestaurantUserId);
        }
        if (mockRestaurantId) {
            await RestaurantModel.findByIdAndDelete(mockRestaurantId);
        }
        if (mockMenuItemId) {
            await MenuItemModel.findByIdAndDelete(mockMenuItemId);
        }
        if (testDriverUserId) {
            await UserModel.findByIdAndDelete(testDriverUserId);
        }
        if (mockDriverId) {
            await DriverModel.findByIdAndDelete(mockDriverId);
        }
        if (createdOrderId) {
            await OrderModel.findByIdAndDelete(createdOrderId);
        }
        await OrderModel.deleteMany({ deliveryAddress: '123 Main St, Kathmandu' });
        await OrderModel.deleteMany({ deliveryAddress: '456 Updated St, Lalitpur' });
    });

    describe('POST /api/v1/order/create', () => {

        test('should deny access without auth token', async () => {
            const res = await request(app)
                .post('/api/v1/order/create')
                .send({
                    restaurantId: mockRestaurantId,
                    items: [{ menuItemId: mockMenuItemId, quantity: 2, price: 250 }],
                    totalAmount: 500,
                    deliveryAddress: '123 Main St, Kathmandu',
                    paymentMethod: 'esewa'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test('should validate missing required fields in DTO', async () => {
            const res = await request(app)
                .post('/api/v1/order/create')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    restaurantId: mockRestaurantId,
                    // items missing
                    deliveryAddress: '123 Main St, Kathmandu',
                    paymentMethod: 'esewa'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should reject invalid payment method', async () => {
            const res = await request(app)
                .post('/api/v1/order/create')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    restaurantId: mockRestaurantId,
                    items: [{ menuItemId: mockMenuItemId, quantity: 1, price: 250 }],
                    totalAmount: 250,
                    deliveryAddress: '123 Main St, Kathmandu',
                    paymentMethod: 'crypto'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should successfully create order with valid payload', async () => {
            const res = await request(app)
                .post('/api/v1/order/create')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    restaurantId: mockRestaurantId,
                    items: [
                        {
                            menuItemId: mockMenuItemId,
                            name: 'Momo',
                            quantity: 2,
                            price: 250
                        }
                    ],
                    totalAmount: 500,
                    deliveryAddress: '123 Main St, Kathmandu',
                    notes: 'Please add extra cutlery',
                    paymentMethod: 'esewa'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data._id).toBeDefined();

            createdOrderId = res.body.data._id;
        });
    });

    describe('GET /api/v1/order/my', () => {

        test('should fetch customer orders', async () => {
            const res = await request(app)
                .get('/api/v1/order/my')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/order/:id', () => {

        test('should get specific order by ID', async () => {
            expect(createdOrderId).toBeDefined();

            const res = await request(app)
                .get(`/api/v1/order/${createdOrderId}`)
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id).toBe(createdOrderId);
        });
    });

    describe('PUT /api/v1/order/update/:id', () => {

        test('should update order delivery address and notes', async () => {
            expect(createdOrderId).toBeDefined();

            const res = await request(app)
                .put(`/api/v1/order/update/${createdOrderId}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    deliveryAddress: '456 Updated St, Lalitpur',
                    notes: 'Ring the doorbell on arrival'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.deliveryAddress).toBe('456 Updated St, Lalitpur');
        });
    });

    describe('PATCH /api/v1/order/status/:id', () => {

        test('should reject invalid status values', async () => {
            expect(createdOrderId).toBeDefined();

            const res = await request(app)
                .patch(`/api/v1/order/status/${createdOrderId}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ status: 'completed' });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should update status to "ready"', async () => {
            expect(createdOrderId).toBeDefined();

            // First, transition pending -> confirmed
            const resConfirmed = await request(app)
                .patch(`/api/v1/order/status/${createdOrderId}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ status: 'confirmed' });
            expect(resConfirmed.statusCode).toBe(200);

            // Second, transition confirmed -> preparing
            const resPreparing = await request(app)
                .patch(`/api/v1/order/status/${createdOrderId}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ status: 'preparing' });
            expect(resPreparing.statusCode).toBe(200);

            // Third, transition preparing -> ready
            const res = await request(app)
                .patch(`/api/v1/order/status/${createdOrderId}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ status: 'ready' });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe('ready');
        });
    });

    describe('GET /api/v1/order/available', () => {

        test('should return order in available list when status is ready without driver', async () => {
            expect(createdOrderId).toBeDefined();

            const res = await request(app)
                .get('/api/v1/order/available')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);

            const isOrderPresent = res.body.data.some(
                (order: any) => order._id.toString() === createdOrderId.toString()
            );
            expect(isOrderPresent).toBe(true);
        });
    });

    describe('PATCH /api/v1/order/assign-driver/:id', () => {

        test('should assign driver to order', async () => {
            expect(createdOrderId).toBeDefined();

            const res = await request(app)
                .patch(`/api/v1/order/assign-driver/${createdOrderId}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ driverId: mockDriverId });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.driverId.toString()).toBe(mockDriverId);
        });
    });

    describe('PATCH /api/v1/order/cancel/:id', () => {

        test('should cancel an existing order', async () => {
            expect(createdOrderId).toBeDefined();

            const res = await request(app)
                .patch(`/api/v1/order/cancel/${createdOrderId}`)
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe('cancelled');
        });
    });
});