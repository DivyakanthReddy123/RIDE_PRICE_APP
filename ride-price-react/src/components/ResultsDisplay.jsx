import React from 'react';
import PriceCard from './PriceCard';
import Map from './Map';

function ResultsDisplay({ data }) {
    if (!data) return null;

    const { rideDetails, prices, directionsResult } = data;

    return (
        <>
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Ride Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div><p className="text-sm text-gray-500">Starting Point</p><p className="font-semibold text-gray-900">{rideDetails.startPointText}</p></div>
                    <div><p className="text-sm text-gray-500">Destination</p><p className="font-semibold text-gray-900">{rideDetails.endPointText}</p></div>
                    <div><p className="text-sm text-gray-500">Time</p><p className="font-semibold text-gray-900">{rideDetails.time}</p></div>
                    <div><p className="text-sm text-gray-500">Est. Distance</p><p className="font-semibold text-gray-900">{rideDetails.displayDistance.toFixed(1)} miles</p></div>
                    <div><p className="text-sm text-gray-500">Est. Travel Time</p><p className="font-semibold text-gray-900">{rideDetails.displayTime} mins</p></div>
                </div>
            </div>
            
            <Map directions={directionsResult} />

            <h2 className="text-2xl font-bold text-center mb-6">Pricing Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {prices.map(option => {
                    const profit = option.fare - rideDetails.totalGasCost;
                    return <PriceCard key={option.name} {...option} profit={profit} cost={rideDetails.totalGasCost} />;
                })}
            </div>
        </>
    );
}

export default ResultsDisplay;