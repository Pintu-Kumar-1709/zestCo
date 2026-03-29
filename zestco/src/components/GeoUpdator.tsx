"use client";

import { getSocket } from "@/lib/socket";
import { useEffect } from "react";

function GeoUpdator({ userId }: { userId: string }) {
  const socket = getSocket();

  useEffect(() => {
    if (!userId) return;
    if (!navigator) return;
    socket.emit("identity", userId);
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        socket.emit("update-location", {
          userId,
          latitude: lat,
          longitude: long,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userId]);
  return null;
}

export default GeoUpdator;
