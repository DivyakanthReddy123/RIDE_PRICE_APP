// // 

// import React from 'react';
// import PriceCard from './PriceCard';
// import Map from './Map';

// function ResultsDisplay({ data }) {
//     if (!data) return null;

//     const { rideDetails, prices, directionsResult } = data;

//     return (
//         <>
//             <div className="mb-8 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-3 text-gray-800">Ride Details</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//                     <div>
//                         <p className="text-sm text-gray-500">Starting Point</p>
//                         <p className="font-semibold text-gray-900">{rideDetails.startPointText}</p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-500">Destination</p>
//                         <p className="font-semibold text-gray-900">{rideDetails.endPointText}</p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-500">Time</p>
//                         <p className="font-semibold text-gray-900">{rideDetails.time}</p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-500">Est. Distance</p>
//                         <p className="font-semibold text-gray-900">
//                             {rideDetails.displayDistance.toFixed(1)} miles
//                         </p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-500">Est. Travel Time</p>
//                         <p className="font-semibold text-gray-900">{rideDetails.displayTime} mins</p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-500">Old Gas Cost (Start → End only)</p>
//                         <p className="font-semibold text-gray-900">
//                             ${rideDetails.totalGasCost.toFixed(2)}
//                         </p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-500">My Gas Cost (Home legs included)</p>
//                         <p className="font-semibold text-green-700">
//                             ${rideDetails.myGasCost.toFixed(2)}
//                         </p>
//                     </div>
//                 </div>
//             </div>
            
//             <Map directions={directionsResult} />

//             <h2 className="text-2xl font-bold text-center mb-6">Pricing Options</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//                 {prices.map(option => {
//                     const profit = option.price - rideDetails.myGasCost;
//                     return (
//                         <PriceCard 
//                             key={option.name} 
//                             {...option} 
//                             profit={profit} 
//                             cost={rideDetails.myGasCost} 
//                         />
//                     );
//                 })}
//             </div>
//         </>
//     );
// }

// export default ResultsDisplay;


import React from 'react';
import PriceCard from './PriceCard';
import Map from './Map';

function ResultsDisplay({ data }) {
    if (!data) return null;

    const { rideDetails, prices, directionsResult } = data;

    // Detect if manual entry
    const isManual = rideDetails.displayTime === "Manual Entry";

    return (
        <>
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Ride Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-500">Starting Point</p>
                        <p className="font-semibold text-gray-900">{rideDetails.startPointText}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Destination</p>
                        <p className="font-semibold text-gray-900">{rideDetails.endPointText}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-semibold text-gray-900">{rideDetails.time}</p>
                    </div>

                    {/* Distance */}
                    <div>
                        <p className="text-sm text-gray-500">
                            {isManual ? "Distance (manual entry)" : "Est. Distance (Start → End)"}
                        </p>
                        <p className="font-semibold text-gray-900">
                            {rideDetails.displayDistance.toFixed(1)} miles
                        </p>
                    </div>

                    {/* Travel Time */}
                    <div>
                        <p className="text-sm text-gray-500">Est. Travel Time</p>
                        <p className="font-semibold text-gray-900">{rideDetails.displayTime}</p>
                    </div>

                    {/* Total Miles with Home (skip if manual) */}
                    {!isManual && (
                        <div>
                            <p className="text-sm text-gray-500">Total Miles (Home → Start → End → Home)</p>
                            <p className="font-semibold text-indigo-700">
                                {rideDetails.totalMilesWithHome > 0
                                    ? `${rideDetails.totalMilesWithHome.toFixed(1)} miles`
                                    : "Not available"}
                            </p>
                        </div>
                    )}

                    {/* Old Gas Cost */}
                    <div>
                        <p className="text-sm text-gray-500">Old Gas Cost (Start ↔ End, doubled)</p>
                        <p className="font-semibold text-gray-900">
                            ${rideDetails.totalGasCost.toFixed(2)}
                        </p>
                    </div>

                    {/* My Gas Cost (skip if manual) */}
                    {!isManual && (
                        <div>
                            <p className="text-sm text-gray-500">My Gas Cost (Home legs included)</p>
                            <p className="font-semibold text-green-700">
                                ${rideDetails.myGasCost.toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Show map only if we used Google directions */}
            {!isManual && directionsResult && <Map directions={directionsResult} />}

            <h2 className="text-2xl font-bold text-center mb-6">Pricing Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {prices.map(option => {
                    const profit = option.price - rideDetails.myGasCost;
                    return (
                        <PriceCard 
                            key={option.name} 
                            {...option} 
                            profit={profit} 
                            cost={rideDetails.myGasCost} 
                            profitLabel="Profit (after My Gas Cost)" 
                            costLabel="My Gas Cost"
                        />
                    );
                })}
            </div>
        </>
    );
}

export default ResultsDisplay;