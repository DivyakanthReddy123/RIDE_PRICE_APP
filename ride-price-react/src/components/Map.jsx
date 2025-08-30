import React, { useEffect, useRef } from 'react';

function Map({ directions }) {
    const mapRef = useRef(null);
    const directionsRendererRef = useRef(null);

    // Effect to initialize the map and renderer once
    useEffect(() => {
        if (window.google && mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: 42.98, lng: -78.78 }, // Buffalo, NY
                zoom: 10,
                mapTypeControl: false,
                streetViewControl: false,
            });
            
            directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
            directionsRendererRef.current.setMap(map);
        }
    }, []); // Empty dependency array means this runs only once on mount

    // Effect to update the route when directions change
    useEffect(() => {
        if (directionsRendererRef.current && directions) {
            directionsRendererRef.current.setDirections(directions);
        }
    }, [directions]); // This runs whenever the 'directions' prop changes

    return <div ref={mapRef} className="w-full h-64 md:h-80 rounded-lg my-6 border border-gray-300 shadow-md"></div>;
}

export default Map;