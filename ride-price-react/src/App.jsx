// import React, { useState, useEffect } from 'react';
// import InputForm from './components/InputForm';
// import ResultsDisplay from './components/ResultsDisplay';
// import { getRideDetailsFromAI } from './api';
// import MyProfile from './profile/MyProfile';

// // IMPORTANT: Access environment variables for API keys
// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// function App() {
//     const [inputs, setInputs] = useState({
//         rideText: '',
//         startPointInput: '',
//         destinationInput: '',
//         gasPrice: '3.50',
//         mileage: '20',
//         roundTripCheck: false,
//     });
//     const [results, setResults] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [isMapsScriptLoaded, setMapsScriptLoaded] = useState(false);

//     // Effect to load the Google Maps script once
//     useEffect(() => {
//         if (!window.google) {
//             const script = document.createElement('script');
//             script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
//             script.async = true;
//             script.defer = true;
//             document.head.appendChild(script);
//             script.onload = () => setMapsScriptLoaded(true);
//         } else {
//             setMapsScriptLoaded(true);
//         }
//     }, []);

//     const handleCalculate = async () => {
//         if (!inputs.rideText && !inputs.startPointInput && !inputs.destinationInput) {
//             setError("Please enter a ride request or fill out the manual start and end points.");
//             return;
//         }
//         if (!isMapsScriptLoaded) {
//             setError("Google Maps is still loading. Please wait a moment and try again.");
//             return;
//         }

//         setIsLoading(true);
//         setError('');
//         setResults(null);

//         try {
//             let aiResponse = { start: null, end: null, time: null };
//             if (inputs.rideText && !inputs.startPointInput && !inputs.destinationInput) {
//                 aiResponse = await getRideDetailsFromAI(inputs.rideText, GEMINI_API_KEY);
//                 // This will print the raw AI output to your browser's console
//                 console.log("Raw response from LLM:", aiResponse);
//             }

//             const startPointText = inputs.startPointInput || aiResponse.start;
//             const endPointText = inputs.destinationInput || aiResponse.end;
            
//             if (!startPointText || !endPointText) throw new Error("Could not determine a valid start and end point.");

//             const geocoder = new window.google.maps.Geocoder();
//             const directionsService = new window.google.maps.DirectionsService();

//             const geocodePromise = (address) => new Promise((resolve, reject) => {
//                 geocoder.geocode({ address }, (results, status) => {
//                     if (status === 'OK') resolve(results[0].geometry.location);
//                     else reject(new Error(`Geocode failed: ${status}`));
//                 });
//             });

//             const [startCoords, endCoords] = await Promise.all([geocodePromise(startPointText), geocodePromise(endPointText)]);
            
//             const directionsResult = await new Promise((resolve, reject) => {
//                 directionsService.route({ origin: startCoords, destination: endCoords, travelMode: 'DRIVING' }, (result, status) => {
//                     if (status === 'OK') resolve(result);
//                     else reject(new Error(`Directions request failed: ${status}`));
//                 });
//             });

//             const leg = directionsResult.routes[0].legs[0];
//             const distanceInMiles = leg.distance.value * 0.000621371;
//             const durationInMinutes = Math.round(leg.duration.value / 60);

//             const tripDistance = inputs.roundTripCheck ? distanceInMiles * 2 : distanceInMiles;
//             const displayTime = inputs.roundTripCheck ? durationInMinutes * 2 : durationInMinutes;

//             const totalGasCost = distanceInMiles * (parseFloat(inputs.gasPrice) / parseFloat(inputs.mileage)) * 2;
            
//             const baseFare = 3.00;
//             const airportSurcharge = endPointText.toLowerCase().includes('airport') ? 5.00 : 0;

//             const prices = [
//                 { name: 'Budget', price: baseFare + (1.50 * tripDistance) + airportSurcharge, color: 'green' },
//                 { name: 'Standard',   price: baseFare + (1.65 * tripDistance) + airportSurcharge, color: 'blue' },
//                 { name: 'Premium',    price: baseFare + ( 2 * tripDistance) + airportSurcharge, color: 'purple' }
//             ];

//             const rideDetails = {
//                 startPointText, endPointText,
//                 time: aiResponse.time || 'ASAP',
//                 displayDistance: tripDistance,
//                 displayTime, totalGasCost
//             };

//             setResults({ rideDetails, prices, directionsResult });

//         } catch (err) {
//             setError(err.message || "An unexpected error occurred.");
//             console.error(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
//             <header className="text-center mb-8">
//                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Ride Price Calculator</h1>
//                 <p className="text-gray-600 mt-2">Enter your ride request to get a price estimate.</p>
//             </header>

//             <main className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
//                 <InputForm 
//                     inputs={inputs}
//                     setInputs={setInputs}
//                     onCalculate={handleCalculate}
//                     isLoading={isLoading}
//                 />
                
//                 {(isLoading || error || results) && (
//                     <div className="mt-8 pt-6 border-t border-gray-200">
//                         {isLoading && <div className="loader"></div>}
//                         {error && <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">{error}</div>}
//                         {results && <ResultsDisplay data={results} />}
//                     </div>
//                 )}
//         <div className="mt-8">
//                  <MyProfile />
//         </div>
//             </main>
//         </div>

        
//     );
// }

// export default App;

// -- new code 1 
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { getRideDetailsFromAI } from './api';
import MyProfile from './profile/MyProfile';

// IMPORTANT: Access environment variables for API keys
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Small helper to sanitize addresses
function cleanAddress(addr) {
    if (!addr) return '';
    return addr
        .replace(/\s+/g, ' ')
        .replace(/,\s*,/g, ',')
        .trim();
}

function App() {
    const [inputs, setInputs] = useState({
        rideText: '',
        startPointInput: '',
        destinationInput: '',
        manualDistance: '',   // NEW
        gasPrice: '3.50',
        mileage: '20',
        roundTripCheck: false,
    });
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMapsScriptLoaded, setIsMapsScriptLoaded] = useState(false);

    // Load Google Maps script once
    useEffect(() => {
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            script.onload = () => setIsMapsScriptLoaded(true);
        } else {
            setIsMapsScriptLoaded(true);
        }
    }, []);

    const handleCalculate = async () => {
        if (
            !inputs.rideText &&
            !inputs.startPointInput &&
            !inputs.destinationInput &&
            !inputs.manualDistance
        ) {
            setError("Please enter a ride request, manual points, or manual distance.");
            return;
        }
        if (!isMapsScriptLoaded && !inputs.manualDistance) {
            setError("Google Maps is still loading. Please wait a moment and try again.");
            return;
        }

        setIsLoading(true);
        setError('');
        setResults(null);

        try {
            // --------------------
            // Step 1: Expand with AI
            // --------------------
            let aiResponse = { start: null, end: null, time: null };

            if (inputs.rideText) {
                aiResponse = await getRideDetailsFromAI(inputs.rideText, GEMINI_API_KEY);
                console.log("Raw response from LLM (rideText):", aiResponse);
            } else if (inputs.startPointInput || inputs.destinationInput) {
                const fakeSentence = `Need a ride from ${inputs.startPointInput || "somewhere"} to ${inputs.destinationInput || "somewhere"}`;
                aiResponse = await getRideDetailsFromAI(fakeSentence, GEMINI_API_KEY);
                console.log("Raw response from LLM (manual inputs):", aiResponse);
            }

            // Prefer AI-expanded addresses over manual raw input
            const startPointText = cleanAddress(aiResponse.start) || cleanAddress(inputs.startPointInput);
            const endPointText = cleanAddress(aiResponse.end) || cleanAddress(inputs.destinationInput);

            // -----------------------
            // CASE 1: Manual Distance
            // -----------------------
            if (inputs.manualDistance) {
                const manualMiles = parseFloat(inputs.manualDistance);
                const tripDistance = inputs.roundTripCheck ? manualMiles * 2 : manualMiles;

                // old gas cost → always doubled distance
                const totalGasCost =
                    manualMiles * 2 * (parseFloat(inputs.gasPrice) / parseFloat(inputs.mileage));
                const myGasCost = totalGasCost;

                const baseFare = 3.00;
                const airportSurcharge = endPointText.toLowerCase().includes('airport') ? 5.00 : 0;

                const prices = [
                    { name: 'Budget', price: baseFare + 1.5 * tripDistance + airportSurcharge, color: 'green' },
                    { name: 'Standard', price: baseFare + 1.65 * tripDistance + airportSurcharge, color: 'blue' },
                    { name: 'Premium', price: baseFare + 2.0 * tripDistance + airportSurcharge, color: 'purple' },
                ];

                const rideDetails = {
                    startPointText: startPointText || "Manual Start",
                    endPointText: endPointText || "Manual End",
                    time: aiResponse.time || 'ASAP',
                    displayDistance: tripDistance,
                    displayTime: "Manual Entry",
                    totalGasCost,
                    myGasCost,
                    totalMilesWithHome: null, // hide this for manual entry
                };

                setResults({ rideDetails, prices, directionsResult: null });
                return; // ✅ exit early, skip Google Maps
            }

            // -----------------------
            // CASE 2: Google Distance
            // -----------------------
            if (!startPointText || !endPointText) {
                throw new Error("Could not determine a valid start and end point.");
            }

            const geocoder = new window.google.maps.Geocoder();
            const directionsService = new window.google.maps.DirectionsService();

            const geocodePromise = (address) =>
                new Promise((resolve, reject) => {
                    geocoder.geocode({ address }, (results, status) => {
                        if (status === 'OK') resolve(results[0].geometry.location);
                        else reject(new Error(`Geocode failed: ${status}`));
                    });
                });

            const [startCoords, endCoords] = await Promise.all([
                geocodePromise(startPointText),
                geocodePromise(endPointText),
            ]);

            const directionsResult = await new Promise((resolve, reject) => {
                directionsService.route(
                    { origin: startCoords, destination: endCoords, travelMode: 'DRIVING' },
                    (result, status) => {
                        if (status === 'OK') resolve(result);
                        else reject(new Error(`Directions request failed: ${status}`));
                    }
                );
            });

            const leg = directionsResult.routes[0].legs[0];
            const distanceInMiles = leg.distance.value * 0.000621371;
            const durationInMinutes = Math.round(leg.duration.value / 60);

            const tripDistance = inputs.roundTripCheck ? distanceInMiles * 2 : distanceInMiles;
            const displayTime = inputs.roundTripCheck ? durationInMinutes * 2 : durationInMinutes;

            // --- Old gas cost → always double distance ---
            const totalGasCost =
                distanceInMiles * 2 * (parseFloat(inputs.gasPrice) / parseFloat(inputs.mileage));

            // --- New My Gas Cost (Home legs included) ---
            let myGasCost = null;
            let totalMilesWithHome = 0;

            try {
                const distanceService = new window.google.maps.DistanceMatrixService();

                const dmResult = await new Promise((resolve, reject) => {
                    distanceService.getDistanceMatrix(
                        {
                            origins: [
                                "Triad Apartments, 1400 Millersport Hwy, Williamsville, NY 14221",
                                startPointText,
                                endPointText,
                            ],
                            destinations: [
                                startPointText,
                                endPointText,
                                "Triad Apartments, 1400 Millersport Hwy, Williamsville, NY 14221",
                            ],
                            travelMode: window.google.maps.TravelMode.DRIVING,
                        },
                        (result, status) => {
                            if (status === 'OK') resolve(result);
                            else reject(new Error(`DistanceMatrix failed: ${status}`));
                        }
                    );
                });

                const metersToMiles = (m) => m / 1609.34;
                const rows = dmResult.rows;

                const homeToStart = metersToMiles(rows[0].elements[0].distance.value);
                const startToEnd = metersToMiles(rows[1].elements[1].distance.value);
                const endToHome = metersToMiles(rows[2].elements[2].distance.value);

                totalMilesWithHome = homeToStart + startToEnd + endToHome;
                if (inputs.roundTripCheck) totalMilesWithHome *= 2;

                myGasCost =
                    totalMilesWithHome *
                    (parseFloat(inputs.gasPrice) / parseFloat(inputs.mileage));
            } catch (err) {
                console.warn("MyGasCost calculation failed:", err);
            }

            const baseFare = 3.00;
            const airportSurcharge = endPointText.toLowerCase().includes('airport') ? 5.00 : 0;

            const prices = [
                { name: 'Budget', price: baseFare + 1.5 * tripDistance + airportSurcharge, color: 'green' },
                { name: 'Standard', price: baseFare + 1.65 * tripDistance + airportSurcharge, color: 'blue' },
                { name: 'Premium', price: baseFare + 2.0 * tripDistance + airportSurcharge, color: 'purple' },
            ];

            const rideDetails = {
                startPointText,
                endPointText,
                time: aiResponse.time || 'ASAP',
                displayDistance: tripDistance,
                displayTime,
                totalGasCost, // old doubled cost
                myGasCost, // new cost with home legs
                totalMilesWithHome,
            };

            setResults({ rideDetails, prices, directionsResult });
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Ride Price Calculator</h1>
                <p className="text-gray-600 mt-2">
                    Enter your ride request to get a price estimate.
                </p>
            </header>

            <main className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <InputForm
                    inputs={inputs}
                    setInputs={setInputs}
                    onCalculate={handleCalculate}
                    isLoading={isLoading}
                />

                {(isLoading || error || results) && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        {isLoading && <div className="loader"></div>}
                        {error && (
                            <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
                                {error}
                            </div>
                        )}
                        {results && <ResultsDisplay data={results} />}
                    </div>
                )}
                <div className="mt-8">
                    <MyProfile />
                </div>
            </main>
        </div>
    );
}

export default App;

