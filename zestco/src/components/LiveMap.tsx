import L, { LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface ILocation {
  latitude: number;
  longitude: number;
}
interface Iprops {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}

function Recenter({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position[0] && position[1]) {
      map.setView(position, map.getZoom(), {
        animate: true,
      });
    }
  }, [position, map]);
  return null;
}

const LiveMap = ({ userLocation, deliveryBoyLocation }: Iprops) => {
  const deliveryBoyIcons = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9518/9518023.png",
    iconSize: [45, 45],
  });

  const userIcons = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45],
  });

  const linePosition =
    deliveryBoyLocation && userLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [];

  const center = [userLocation.latitude, userLocation.longitude];

  return (
    <div className="w-full h-125 rounded-xl overflow-hidden shadow relative z-1">
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <Recenter position={center as [number, number]} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcons}
        >
          <Popup>Delivery Address</Popup>
        </Marker>
        {deliveryBoyLocation && (
          <Marker
            position={[
              deliveryBoyLocation.latitude,
              deliveryBoyLocation.longitude,
            ]}
            icon={deliveryBoyIcons}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}
        <Polyline
          positions={linePosition as LatLngExpression[]}
          color="orange"
        />
      </MapContainer>
    </div>
  );
};

export default LiveMap;
