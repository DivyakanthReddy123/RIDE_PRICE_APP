import React from 'react';

function InputForm({ inputs, setInputs, onCalculate, isLoading }) {
    
    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setInputs(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="rideText" className="block text-sm font-medium text-gray-700 mb-1">Ride Request Message</label>
                <textarea id="rideText" value={inputs.rideText} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., Need a ride from UB North Campus to Niagara Falls around 10 am"></textarea>
            </div>
            <div>
                <p className="text-center text-sm text-gray-500 -mb-2">Or enter locations manually:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="startPointInput" className="block text-sm font-medium text-gray-700 mb-1">Starting Point</label>
                    <input type="text" id="startPointInput" value={inputs.startPointInput} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., University at Buffalo North Campus"/>
                </div>
                <div>
                    <label htmlFor="destinationInput" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input type="text" id="destinationInput" value={inputs.destinationInput} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., Niagara Falls, NY"/>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="gasPrice" className="block text-sm font-medium text-gray-700 mb-1">Gas Price ($/gallon)</label>
                    <input type="number" id="gasPrice" value={inputs.gasPrice} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" step="0.01"/>
                </div>
                <div>
                    <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">Car Mileage (mpg)</label>
                    <input type="number" id="mileage" value={inputs.mileage} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
                </div>
            </div>
            <div className="flex items-center justify-center pt-2">
                <input id="roundTripCheck" type="checkbox" checked={inputs.roundTripCheck} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded"/>
                <label htmlFor="roundTripCheck" className="ml-2 block text-sm font-medium text-gray-900">Display as Round Trip?</label>
            </div>
            <div>
                <button onClick={onCalculate} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition disabled:bg-blue-400">
                    {isLoading ? 'Calculating...' : 'Calculate Ride Price'}
                </button>
            </div>
        </div>
    );
}

export default InputForm;