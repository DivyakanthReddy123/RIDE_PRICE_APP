import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { getRideDetailsFromAI } from './api';

// IMPORTANT: Access environment variables for API keys
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {
    const [inputs, setInputs] = useState({
        rideText: '',
        startPointInput: '',
        destinationInput: '',
        gasPrice: '3.50',
        mileage: '20',
        roundTripCheck: false,
    });
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMapsScriptLoaded, setMapsScriptLoaded] = useState(false);

    // Effect to load the Google Maps script once
    useEffect(() => {
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            script.onload = () => setMapsScriptLoaded(true);
        } else {
            setMapsScriptLoaded(true);
        }
    }, []);

    const handleCalculate = async () => {
        if (!inputs.rideText && !inputs.startPointInput && !inputs.destinationInput) {
            setError("Please enter a ride request or fill out the manual start and end points.");
            return;
        }
        if (!isMapsScriptLoaded) {
            setError("Google Maps is still loading. Please wait a moment and try again.");
            return;
        }

        setIsLoading(true);
        setError('');
        setResults(null);

        try {
            // ... (Calculation logic will go here)
            // For now, let's copy the logic from our old main.js
            
            let aiResponse = { start: null, end: null, time: null };
            if (inputs.rideText && !inputs.startPointInput && !inputs.destinationInput) {
                aiResponse = await getRideDetailsFromAI(inputs.rideText, GEMINI_API_KEY);
            }

            const startPointText = inputs.startPointInput || aiResponse.start;
            const endPointText = inputs.destinationInput || aiResponse.end;
            
            if (!startPointText || !endPointText) throw new Error("Could not determine a valid start and end point.");

            const geocoder = new window.google.maps.Geocoder();
            const directionsService = new window.google.maps.DirectionsService();

            const geocodePromise = (address) => new Promise((resolve, reject) => {
                geocoder.geocode({ address }, (results, status) => {
                    if (status === 'OK') resolve(results[0].geometry.location);
                    else reject(new Error(`Geocode failed: ${status}`));
                });
            });

            const [startCoords, endCoords] = await Promise.all([geocodePromise(startPointText), geocodePromise(endPointText)]);
            
            const directionsResult = await new Promise((resolve, reject) => {
                directionsService.route({ origin: startCoords, destination: endCoords, travelMode: 'DRIVING' }, (result, status) => {
                    if (status === 'OK') resolve(result);
                    else reject(new Error(`Directions request failed: ${status}`));
                });
            });

            const leg = directionsResult.routes[0].legs[0];
            const distanceInMiles = leg.distance.value * 0.000621371;
            const durationInMinutes = Math.round(leg.duration.value / 60);

            let displayDistance = distanceInMiles;
            let displayTime = durationInMinutes;
            if (inputs.roundTripCheck) {
                displayDistance *= 2;
                displayTime *= 2;
            }

            const totalGasCost = distanceInMiles * (parseFloat(inputs.gasPrice) / parseFloat(inputs.mileage)) * 2;
            
            const baseFare = 3.00;
            const airportSurcharge = endPointText.toLowerCase().includes('airport') ? 5.00 : 0;

            const rideDetails = {
                startPointText, endPointText,
                time: aiResponse.time || 'ASAP',
                displayDistance, displayTime, totalGasCost
            };
            
            const prices = [
                { name: 'Budget', price: baseFare + (1.50 * distanceInMiles) + airportSurcharge, color: 'green' },
                { name: 'Standard',   price: baseFare + (1.65 * distanceInMiles) + airportSurcharge, color: 'blue' },
                { name: 'Premium',    price: baseFare + ( 2 * distanceInMiles) + airportSurcharge, color: 'purple' }
            ];

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
                <p className="text-gray-600 mt-2">Enter your ride request to get a price estimate.</p>
            </header>

            <main className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <InputForm 
                    inputs={inputs}
                    setInputs={setInputs}
                    onCalculate={handleCalculate}
                    isLoading={isLoading}
                />
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                    {isLoading && <div className="loader"></div>}
                    {error && <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">{error}</div>}
                    {results && <ResultsDisplay data={results} />}
                </div>
            </main>
        </div>
    );
}

export default App;