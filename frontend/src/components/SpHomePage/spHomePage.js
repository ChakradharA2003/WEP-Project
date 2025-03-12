// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import socket from "../../utils/socket";
// import "./spHomePage.css";

// const SpHomePage = ({ user }) => {
//   const [providerLocation, setProviderLocation] = useState(null);
//   const [customerRequest, setCustomerRequest] = useState(null);

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setProviderLocation({ lat: latitude, lng: longitude });
//           socket.emit("updateLocation", {
//             userId: user.id,
//             latitude,
//             longitude,
//             role: "provider",
//           });
//         },
//         (error) => console.error("Error getting location:", error),
//         { enableHighAccuracy: true }
//       );
//     }
//   }, [user.id]);

//   useEffect(() => {
//     socket.on("serviceRequest", (data) => {
//       setCustomerRequest(data);
//     });

//     return () => socket.off("serviceRequest");
//   }, []);

//   const acceptRequest = () => {
//     socket.emit("acceptService", { providerId: user.id, customerId: customerRequest.customerId });
//     setCustomerRequest(null);
//   };

//   return (
//     <div className="sp-home">
//       <div className="map-container fade-in">
//         <MapContainer center={providerLocation || [0, 0]} zoom={13} style={{ height: "50vh", width: "100%" }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           {providerLocation && (
//             <Marker position={providerLocation}>
//               <Popup>You are here</Popup>
//             </Marker>
//           )}
//         </MapContainer>
//       </div>
//       <div className="bottom-section slide-up">
//         {customerRequest ? (
//           <div>
//             <h3>Service Request from Customer</h3>
//             <button className="glow-button" onClick={acceptRequest}>Accept Request</button>
//           </div>
//         ) : (
//           <p>No active service requests</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SpHomePage;
