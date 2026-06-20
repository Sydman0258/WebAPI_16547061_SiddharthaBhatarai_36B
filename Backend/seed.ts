import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { IUser } from './src/models/user.model';         
import Restaurant from './src/models/restaurant.model';

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.LOCAL_DATABASE_URI || 'mongodb://localhost:27017/grubgo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    process.exit(1);
  }
};

// Dummy Data for Users with explicit literal types
const dummyUsers = [
  // CUSTOMERS
  {
    username: 'john_customer',
    fullname: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    password: 'password123',
    address: 'Kathmandu, Nepal',
    imageUrl: 'default-customer.png',
    phoneNumber: '+977-9841234567',
  },
  {
    username: 'anita_bhatta',
    fullname: 'Anita Bhattarai',
    email: 'anita@gmail.com',
    role: 'customer',
    password: 'password123',
    address: 'Lalitpur, Nepal',
    imageUrl: 'default-customer2.png',
    phoneNumber: '+977-9811223344',
  },
  {
    username: 'samir_shrestha',
    fullname: 'Samir Shrestha',
    email: 'samir@outlook.com',
    role: 'customer',
    password: 'password123',
    address: 'Bhaktapur, Nepal',
    imageUrl: 'default-customer3.png',
    phoneNumber: '+977-9865432100',
  },
  {
    username: 'eliza_rai',
    fullname: 'Eliza Rai',
    email: 'eliza@yahoo.com',
    role: 'customer',
    password: 'password123',
    address: 'Kirtipur, Nepal',
    imageUrl: 'default-customer4.png',
    phoneNumber: '+977-9808899776',
  },

  // RESTAURANTS (Owners/Managers)
  {
    username: 'mario_rest',
    fullname: 'Mario Rossi',
    email: 'mario@pizzeria.com',
    role: 'restaurant',
    password: 'password123',
    address: 'Jhamsikhel, Lalitpur',
    imageUrl: 'default-restaurant-owner.png',
    phoneNumber: '+977-9841234568',
  },
  {
    username: 'burger_king_owner',
    fullname: 'Sarah Jenkins',
    email: 'sarah@burgerking.com',
    role: 'restaurant',
    password: 'password123',
    address: 'Durbar Marg, Kathmandu',
    imageUrl: 'default-restaurant-owner2.png',
    phoneNumber: '+977-9841234569',
  },
  {
    username: 'boba_tea_admin',
    fullname: 'Mingma Sherpa',
    email: 'mingma@bobahouse.com',
    role: 'restaurant',
    password: 'password123',
    address: 'Thamel, Kathmandu',
    imageUrl: 'default-restaurant-owner3.png',
    phoneNumber: '+977-9851223344',
  },
  {
    username: 'tandoori_palace_admin',
    fullname: 'Rajesh Khanal',
    email: 'rajesh@tandoori.com',
    role: 'restaurant',
    password: 'password123',
    address: 'Thapathali, Kathmandu',
    imageUrl: 'default-restaurant-owner4.png',
    phoneNumber: '+977-9803112233',
  },

  // DRIVERS
  {
    username: 'speedy_driver',
    fullname: 'Ram Bahadur',
    email: 'ram@delivery.com',
    role: 'driver',
    password: 'password123',
    address: 'Kirtipur, Nepal',
    imageUrl: 'default-driver1.png',
    phoneNumber: '+977-9851012345',
  },
  {
    username: 'biker_boy_gopal',
    fullname: 'Gopal Thapa',
    email: 'gopal@delivery.com',
    role: 'driver',
    password: 'password123',
    address: 'Chabahil, Kathmandu',
    imageUrl: 'default-driver2.png',
    phoneNumber: '+977-9818765432',
  },
  {
    username: 'fast_delivery_sita',
    fullname: 'Sita Tamang',
    email: 'sita@delivery.com',
    role: 'driver',
    password: 'password123',
    address: 'Patan, Lalitpur',
    imageUrl: 'default-driver3.png',
    phoneNumber: '+977-9861234576',
  },
  {
    username: 'eco_rider_krishna',
    fullname: 'Krishna Basnet',
    email: 'krishna@delivery.com',
    role: 'driver',
    password: 'password123',
    address: 'Baneshwor, Kathmandu',
    imageUrl: 'default-driver4.png',
    phoneNumber: '+977-9807654321',
  }
] as const;

// Dummy Data for Restaurants
const dummyRestaurants = [
  {
    restaurantName: "Mario's Authentic Pizzeria",
    description: "Wood-fired Neapolitan pizzas and fresh homemade pasta.",
    location: "Jhamsikhel, Lalitpur",
    status: "active",
    openingHours: "11:00 AM - 10:00 PM",
    restaurantImage: "pizzeria.jpg",
    foodTypes: ["Pizza", "Italian", "Pasta"],
  },
  {
    restaurantName: "The Burger Shack",
    description: "Gourmet smash burgers, crispy fries, and thick milkshakes.",
    location: "Durbar Marg, Kathmandu",
    status: "active",
    openingHours: "10:00 AM - 11:00 PM",
    restaurantImage: "burgershack.jpg",
    foodTypes: ["Burgers", "Fast Food", "American"],
  },
  {
    restaurantName: "Bubble Tea Haven",
    description: "Authentic Taiwanese brown sugar boba and refreshing fruit teas.",
    location: "Thamel, Kathmandu",
    status: "active",
    openingHours: "09:00 AM - 09:00 PM",
    restaurantImage: "bobahaven.jpg",
    foodTypes: ["Beverages", "Desserts", "Asian"],
  },
  {
    restaurantName: "Tandoori Palace",
    description: "Rich Mughlai curries, sizzling tandoori platters, and garlic naan.",
    location: "Thapathali, Kathmandu",
    status: "active",
    openingHours: "12:00 PM - 10:30 PM",
    restaurantImage: "tandoori.jpg",
    foodTypes: ["Indian", "Curry", "Main Course"],
  }
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    console.log("Existing Data Destroyed...");

    // Create Users sequentially
    const createdUsers: IUser[] = [];
    for (const userData of dummyUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`${createdUsers.length} Users created`);

    // Filter restaurant owners
    const restaurantOwners = createdUsers.filter(user => user.role === 'restaurant');

    // Map and link restaurants to owners
    const restaurantsWithOwners = dummyRestaurants.map((restaurant, index) => {
      const owner = restaurantOwners[index % restaurantOwners.length];
      return {
        ...restaurant,
        userId: owner._id
      };
    });

    // Create Restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurantsWithOwners);
    console.log(`${createdRestaurants.length} Restaurants created`);

    console.log("\n✅ Ecosystem seed data imported successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Restaurants: ${createdRestaurants.length}`);

    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error}`);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Restaurant.deleteMany();

    console.log("Data Destroyed...");
    process.exit();
  } catch (error) {
    console.error(`Error during data deletion: ${error}`);
    process.exit(1);
  }
};

// --- Execution Wrapper System ---
const runSeeder = async () => {
  const flag = process.argv[2]?.trim();

  console.log(`\n🚀 Seeder Initializing... Flag captured: [${flag || 'None'}]`);

  if (flag === '-i') {
    await importData();
  } else if (flag === '-d') {
    await deleteData();
  } else {
    console.log("⚠️ Missing or invalid flag. Running fallback Import Mode...");
    await importData();
  }
};

runSeeder();