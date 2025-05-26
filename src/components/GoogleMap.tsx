"use client";

import { useEffect, useRef, useState } from "react";

// Define types for Google Maps objects
declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

interface AddressMapProps {
  apiKey: string;
  address: string;
  zoom?: number;
  height?: string;
  markerLabel?: string;
}

export default function AddressMap({
  apiKey,
  address,
  zoom = 15,
  height = "400px",
  markerLabel,
}: AddressMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Load the Google Maps script
  useEffect(() => {
    // Skip if API key is missing or script is already loaded
    if (
      !apiKey ||
      document.querySelector(`script[src*="maps.googleapis.com/maps/api"]`)
    ) {
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geocoding&v=weekly&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Define initMap function globally
    window.initMap = () => {
      setMapLoaded(true);
    };

    document.head.appendChild(script);
  }, [apiKey]);

  // Initialize map and geocode address after script is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !address) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom,
      center: { lat: 0, lng: 0 }, // Default center (will be updated after geocoding)
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    // Geocode the address to get coordinates
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;

        // Center the map on the geocoded location
        map.setCenter(location);

        // Create a marker for the location
        const marker = new window.google.maps.Marker({
          map,
          position: location,
          title: markerLabel || address,
          animation: window.google.maps.Animation.DROP,
        });

        // Create info window with the address
        const infowindow = new window.google.maps.InfoWindow({
          content: `<strong>${
            markerLabel || "Location"
          }</strong><br>${address}`,
        });

        // Open info window when marker is clicked
        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });

        // Auto-open info window on load
        infowindow.open(map, marker);
      } else {
        setMapError(
          "Could not find the address on the map. Please check the address and try again."
        );
      }
    });
  }, [mapLoaded, address, markerLabel, zoom]);

  return (
    <div className="w-full" style={{ height }}>
      {mapError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {mapError}
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded shadow-md" />
    </div>
  );
}
