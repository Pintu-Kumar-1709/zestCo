"use client";

import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { useEffect } from "react";

const markerIcon =
  typeof window !== "undefined"
    ? new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      })
    : null;

interface CheckOutMapProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}

const DraggableMarker = ({ position, setPosition }: CheckOutMapProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);

  if (!markerIcon) return null;

  return (
    <Marker
      icon={markerIcon}
      position={position as LatLngExpression}
      draggable={true}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        },
      }}
    />
  );
};

const CheckOutMap = ({ position, setPosition }: CheckOutMapProps) => {
  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <DraggableMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
};

export default CheckOutMap;
