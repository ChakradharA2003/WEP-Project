import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import pin from '../../assets/pin.png';

const defaultCoords = [17.385044, 78.486671];

const UpdateMapView = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView(coords, 13);
        }
    }, [coords, map]);
    return null;
};

const UserHomePage = () => {
    const [coord, setCoord] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoord([latitude, longitude]);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setCoord(defaultCoords);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setCoord(defaultCoords);
        }
    }, []);

    const customIcon = new L.Icon({
        iconUrl: pin,
        iconRetinaUrl: pin,
        iconSize: [20, 30], // Further reduced pin size for responsiveness
        iconAnchor: [10, 30],
        popupAnchor: [0, -30],
    });

    if (!coord) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading map...</div>;
    console.log(coord);
    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MapContainer 
                style={{ height: '90vh', width: '95vw', borderRadius: '10px' }} 
                center={coord} 
                zoom={13} 
                scrollWheelZoom={true}
            >
                <UpdateMapView coords={coord} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker icon={customIcon} position={coord}>
                    <Popup>
                        Your current location.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default UserHomePage;
