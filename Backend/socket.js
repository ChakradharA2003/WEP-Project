// const { Server } = require("socket.io");
// const User = require("./models/User");
// const ServiceProvider = require("./models/ServiceProvider");

// let io = null; // WebSocket instance
// let users = {}; // Store connected users

// const initSocket = (server) => {
//   io = new Server(server, {
//     cors: { origin: "*" }, // Allow all origins (Modify for production security)
//   });

//   io.on("connection", (socket) => {
//     console.log("WebSocket connected:", socket.id);

//     // Handle real-time location updates
//     socket.on("updateLocation", async ({ userId, latitude, longitude, role }) => {
//       try {
//         const Model = role === "serviceProvider" ? ServiceProvider : User;
//         await Model.findByIdAndUpdate(userId, {
//           "location.coordinates": [longitude, latitude],
//         });

//         // Store in-memory user tracking
//         users[userId] = { socket, latitude, longitude, role };

//         // Notify clients about updated location
//         io.emit("locationUpdated", { userId, latitude, longitude });
//       } catch (error) {
//         console.error("Error updating location:", error);
//       }
//     });

//     // Handle service request from customer
//     socket.on("requestService", async ({ customerId, serviceType }) => {
//       try {
//         const customer = await User.findById(customerId);
//         if (!customer) return;

//         // Find nearby providers within a 5km radius
//         const providers = await ServiceProvider.find({
//           serviceType,
//           location: {
//             $geoWithin: {
//               $centerSphere: [customer.location.coordinates, 5 / 6378.1], // Convert km to radians
//             },
//           },
//         }).sort((a, b) => {
//           const distA = calculateDistance(
//             a.location.coordinates[1], a.location.coordinates[0],
//             customer.location.coordinates[1], customer.location.coordinates[0]
//           );
//           const distB = calculateDistance(
//             b.location.coordinates[1], b.location.coordinates[0],
//             customer.location.coordinates[1], customer.location.coordinates[0]
//           );
//           return distA - distB;
//         });

//         if (providers.length === 0) {
//           socket.emit("serviceResponse", { success: false, message: "No providers available" });
//           return;
//         }

//         // Send request to the nearest provider
//         const assignedProvider = providers[0];
//         if (users[assignedProvider._id]) {
//           users[assignedProvider._id].socket.emit("serviceRequest", { customerId, customerLocation: customer.location });
//         }

//         // Inform customer that request is sent
//         socket.emit("serviceResponse", { success: true, provider: assignedProvider });
//       } catch (error) {
//         console.error("Error finding nearby providers:", error);
//       }
//     });

//     // Handle provider accepting a service request
//     socket.on("acceptService", async ({ providerId, customerId }) => {
//       if (users[customerId]) {
//         users[customerId].socket.emit("serviceAccepted", { providerId });
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("WebSocket disconnected:", socket.id);
//     });
//   });

//   console.log("WebSocket Server initialized");
// };

// // Function to calculate distance between two coordinates (Haversine Formula)
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Earth radius in km
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
// };

// const getIo = () => {
//   if (!io) {
//     console.error("Socket.io is not initialized! Make sure `initSocket(server)` runs first.");
//     return null;
//   }
//   return io;
// };

// module.exports = { initSocket, getIo };
