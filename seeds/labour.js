const mongoose = require('mongoose');
const Labour = require('../models/labour'); // Adjust path as per your project structure

mongoose.connect('mongodb://localhost:27017/hackathon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("✅ Database connected successfully");
});

const labourData = [
  {
    name: "Ramesh Kumar",
    email: "ramesh.kumar@example.com",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
    phone: "9876543210",
    skill: "Ploughing",
    location: "Nagpur, Maharashtra",
    geometry: { type: "Point", coordinates: [79.0882, 21.1458] }
  },
  {
    name: "Sita Devi",
    email: "sita.devi@example.com",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    phone: "9123456789",
    skill: "Irrigation",
    location: "Lucknow, Uttar Pradesh",
    geometry: { type: "Point", coordinates: [80.9462, 26.8467] }
  },
  {
    name: "Mahesh Yadav",
    email: "mahesh.yadav@example.com",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
    phone: "9988776655",
    skill: "Harvesting",
    location: "Indore, Madhya Pradesh",
    geometry: { type: "Point", coordinates: [75.8577, 22.7196] }
  },
  {
    name: "Radha Sharma",
    email: "radha.sharma@example.com",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    phone: "9001122334",
    skill: "Weeding",
    location: "Jaipur, Rajasthan",
    geometry: { type: "Point", coordinates: [75.7873, 26.9124] }
  },
  {
    name: "Amit Patel",
    email: "amit.patel@example.com",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
    phone: "9845098450",
    skill: "Sowing",
    location: "Ahmedabad, Gujarat",
    geometry: { type: "Point", coordinates: [72.5714, 23.0225] }
  },
  {
    name: "Lata Joshi",
    email: "lata.joshi@example.com",
    image: "https://randomuser.me/api/portraits/women/60.jpg",
    phone: "8877665544",
    skill: "Sorting",
    location: "Bhopal, Madhya Pradesh",
    geometry: { type: "Point", coordinates: [77.4126, 23.2599] }
  },
  {
    name: "Sunil Thakur",
    email: "sunil.thakur@example.com",
    image: "https://randomuser.me/api/portraits/men/28.jpg",
    phone: "9988665544",
    skill: "Tractor Driving",
    location: "Patna, Bihar",
    geometry: { type: "Point", coordinates: [85.1376, 25.5941] }
  },
  {
    name: "Pooja Verma",
    email: "pooja.verma@example.com",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    phone: "9090909090",
    skill: "Packing",
    location: "Varanasi, Uttar Pradesh",
    geometry: { type: "Point", coordinates: [83.0033, 25.3176] }
  },
  {
    name: "Rajiv Mehta",
    email: "rajiv.mehta@example.com",
    image: "https://randomuser.me/api/portraits/men/35.jpg",
    phone: "9812345678",
    skill: "Transportation",
    location: "Pune, Maharashtra",
    geometry: { type: "Point", coordinates: [73.8567, 18.5204] }
  },
  {
    name: "Kavita Rao",
    email: "kavita.rao@example.com",
    image: "https://randomuser.me/api/portraits/women/56.jpg",
    phone: "8907654321",
    skill: "Packaging",
    location: "Hyderabad, Telangana",
    geometry: { type: "Point", coordinates: [78.4867, 17.3850] }
  },
  {
    name: "Shivakumar Gowda",
    email: "shivakumar.gowda@example.com",
    image: "https://randomuser.me/api/portraits/men/80.jpg",
    phone: "9845012345",
    skill: "Ploughing",
    location: "Mandya, Karnataka",
    geometry: { type: "Point", coordinates: [76.9006, 12.5216] }
  },
  {
    name: "Lakshmi Hegde",
    email: "lakshmi.hegde@example.com",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    phone: "9036001122",
    skill: "Weeding",
    location: "Udupi, Karnataka",
    geometry: { type: "Point", coordinates: [74.7451, 13.3409] }
  },
  {
    name: "Manjunath Shetty",
    email: "manjunath.shetty@example.com",
    image: "https://randomuser.me/api/portraits/men/66.jpg",
    phone: "9448123456",
    skill: "Sowing",
    location: "Shivamogga, Karnataka",
    geometry: { type: "Point", coordinates: [75.5636, 13.9299] }
  },
  {
    name: "Geetha Naik",
    email: "geetha.naik@example.com",
    image: "https://randomuser.me/api/portraits/women/70.jpg",
    phone: "8884556677",
    skill: "Harvesting",
    location: "Belagavi, Karnataka",
    geometry: { type: "Point", coordinates: [74.5000, 15.8500] }
  },
  {
    name: "Ravi Patil",
    email: "ravi.patil@example.com",
    image: "https://randomuser.me/api/portraits/men/73.jpg",
    phone: "8901442211",
    skill: "Sorting",
    location: "Hubballi, Karnataka",
    geometry: { type: "Point", coordinates: [75.1240, 15.3647] }
  },
  {
    name: "Annapurna Gowda",
    email: "annapurna.gowda@example.com",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    phone: "9988771122",
    skill: "Tractor Driving",
    location: "Ballari, Karnataka",
    geometry: { type: "Point", coordinates: [76.9214, 15.1394] }
  },
  {
    name: "Nagaraj Reddy",
    email: "nagaraj.reddy@example.com",
    image: "https://randomuser.me/api/portraits/men/72.jpg",
    phone: "9632587410",
    skill: "Irrigation",
    location: "Raichur, Karnataka",
    geometry: { type: "Point", coordinates: [77.3566, 16.2076] }
  },
  {
    name: "Rekha Desai",
    email: "rekha.desai@example.com",
    image: "https://randomuser.me/api/portraits/women/78.jpg",
    phone: "9448667788",
    skill: "Plantation Work",
    location: "Chikkamagaluru, Karnataka",
    geometry: { type: "Point", coordinates: [75.7953, 13.3151] }
  },
  {
    name: "Vinay Kulkarni",
    email: "vinay.kulkarni@example.com",
    image: "https://randomuser.me/api/portraits/men/71.jpg",
    phone: "9745678912",
    skill: "Fertilizer Application",
    location: "Dharwad, Karnataka",
    geometry: { type: "Point", coordinates: [75.0142, 15.4589] }
  },
  {
    name: "Deepa M",
    email: "deepa.m@example.com",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    phone: "9845654321",
    skill: "Spraying Pesticides",
    location: "Tumakuru, Karnataka",
    geometry: { type: "Point", coordinates: [77.1010, 13.3409] }
  }
];

const seedDB = async () => {
  try {
    await Labour.deleteMany({});
    await Labour.insertMany(labourData);
    console.log("🌱 Database seeded with labour data");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    mongoose.connection.close(() => {
      console.log("🔒 Database connection closed");
    });
  }
};

seedDB();
