import React from 'react';




// LOCATION MAPPINGS (Buffalo, NY area, exhaustive for ride app UI)

const LOCATION_MAPPINGS = [
    { keyword: "airport", official: "Buffalo Niagara International Airport, 4200 Genesee St, Cheektowaga, NY 14225" },
    { keyword: "amherst", official: "1525 Amherst Manor Blvd, 111, Amherst, NY 14221" },
    { keyword: "amherst manor", official: "1525 Amherst Manor Blvd, 111, Amherst, NY 14221" },
    { keyword: "amherst manor right", official: "1525 Amherst Manor Blvd, 111, Amherst, NY 14221" },
    { keyword: "amherst manor dr", official: "1525 Amherst Manor Blvd, 111, Amherst, NY 14221" },
    { keyword: "amherst manor -", official: "1525 Amherst Manor Blvd, 111, Amherst, NY 14221" },
    { keyword: "triads", official: "The Triad Apartments 1400-1430 Millersport Hwy, Williamsville, NY 14221" },
    { keyword: "925 niagara falls blvd", official: "Niagara Falls Blvd, Buffalo, NY 14214" },
    { keyword: "niagara falls", official: "Niagara Falls Blvd, Buffalo, NY 14214" },
    { keyword: "35 callodine", official: "Callodine Ave, Amherst, NY 14226" },
    { keyword: "callodine ave", official: "Callodine Ave, Amherst, NY 14226" },
    { keyword: "83 w winspear ave, buffalo 14214", official: "83 W Winspear Ave, Buffalo, NY 14214" },
    { keyword: "156 winspear ave", official: "Winspear Ave, Buffalo, NY 14215" },
    { keyword: "305 winspear ave", official: "Winspear Ave, Buffalo, NY 14215" },
    { keyword: "winspear ave", official: "Winspear Ave, Buffalo, NY 14215" },
    { keyword: "walden", official: "Walden Galleria, 1 Walden Galleria, Buffalo, NY 14225" },
    { keyword: "walmart", official: "Walmart Supercenter, 3290 Sheridan Dr, Amherst, NY 14226" },
    { keyword: "ellicot college", official: "Ellicott Complex - University at Buffalo, 125-175 Lee Rd, Buffalo, NY 14261" },
    { keyword: "ellicott complex", official: "Ellicott Complex - University at Buffalo, 125-175 Lee Rd, Buffalo, NY 14261" },
    { keyword: "ellicot", official: "Ellicott Complex - University at Buffalo, 125-175 Lee Rd, Buffalo, NY 14261" },
    { keyword: "south", official: "University at Buffalo (South Campus)" },
    { keyword: "south campus", official: "University at Buffalo (South Campus)" },
    { keyword: "north campus", official: "University at Buffalo (North Campus)" },
    { keyword: "alumni arena", official: "Alumni Arena - University at Buffalo, 80 Coventry Rd, Buffalo, NY 14260" },
    { keyword: "statler food commissary", official: "Statler Food Commissary - University at Buffalo" },
    { keyword: "commissary", official: "Statler Food Commissary - University at Buffalo" },
    { keyword: "commissary pick", official: "Statler Food Commissary - University at Buffalo" },
    { keyword: "hindu temple society", official: "Hindu Cultural Society, 1595 N French Rd, Getzville, NY 14068" },
    { keyword: "hindu cultural society", official: "Hindu Cultural Society, 1595 N French Rd, Getzville, NY 14068" },
    { keyword: "englewood ave", official: "Englewood Ave, Buffalo, NY 14214" },
    { keyword: "south englewood", official: "Englewood Ave, Buffalo, NY 14214" },
    { keyword: "lisbon", official: "Lisbon Ave, Buffalo, NY 14214" },
    { keyword: "bank of america, hertel avenue branch", official: "Bank of America Financial Center, 1452 Hertel Ave, Buffalo, NY 14216" },
    { keyword: "bofa, 7864 transit road", official: "Bank of America (with Drive-thru ATM), 7864 Transit Rd, Williamsville, NY 14221" },
    { keyword: "bank of america (with drive-thru atm)", official: "Bank of America (with Drive-thru ATM), 7864 Transit Rd, Williamsville, NY 14221" },
    { keyword: "bank of america financial center", official: "Bank of America Financial Center, 1452 Hertel Ave, Buffalo, NY 14216" },
    { keyword: "102 affinity ln", official: "102 Affinity Ln, Cheektowaga, NY 14215" },
    { keyword: "54 gruner rd", official: "54 Gruner Rd, Cheektowaga, NY 14227" },
    { keyword: "merrimac", official: "Merrimac St, Buffalo, NY 14214" },
    { keyword: "tyler st", official: "Tyler St, Buffalo, NY 14214" },
    { keyword: "springville ave", official: "248 Springville Ave, Buffalo, NY 14226" }
  ];
  


// function InputForm({ inputs, setInputs, onCalculate, isLoading }) {
    
//     const handleChange = (e) => {
//         const { id, value, type, checked } = e.target;
//         setInputs(prev => ({
//             ...prev,
//             [id]: type === 'checkbox' ? checked : value
//         }));
//     };

//     return (
//         <div className="space-y-6">
//             <div>
//                 <label htmlFor="rideText" className="block text-sm font-medium text-gray-700 mb-1">Ride Request Message</label>
//                 <textarea id="rideText" value={inputs.rideText} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., Need a ride from UB North Campus to Niagara Falls around 10 am"></textarea>
//             </div>
//             <div>
//                 <p className="text-center text-sm text-gray-500 -mb-2">Or enter locations manually:</p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                     <label htmlFor="startPointInput" className="block text-sm font-medium text-gray-700 mb-1">Starting Point</label>
//                     <input type="text" id="startPointInput" value={inputs.startPointInput} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., University at Buffalo North Campus"/>
//                 </div>
//                 <div>
//                     <label htmlFor="destinationInput" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
//                     <input type="text" id="destinationInput" value={inputs.destinationInput} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., Niagara Falls, NY"/>
//                 </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                     <label htmlFor="gasPrice" className="block text-sm font-medium text-gray-700 mb-1">Gas Price ($/gallon)</label>
//                     <input type="number" id="gasPrice" value={inputs.gasPrice} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" step="0.01"/>
//                 </div>
//                 <div>
//                     <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">Car Mileage (mpg)</label>
//                     <input type="number" id="mileage" value={inputs.mileage} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
//                 </div>
//             </div>
//             <div className="flex items-center justify-center pt-2">
//                 <input id="roundTripCheck" type="checkbox" checked={inputs.roundTripCheck} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded"/>
//                 <label htmlFor="roundTripCheck" className="ml-2 block text-sm font-medium text-gray-900">Display as Round Trip?</label>
//             </div>
//             <div>
//                 <button onClick={onCalculate} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition disabled:bg-blue-400">
//                     {isLoading ? 'Calculating...' : 'Calculate Ride Price'}
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default InputForm;


// - - -  new code 
function getSuggestions(input) {
    if (!input) return [];
    const str = input.toLowerCase();
    return LOCATION_MAPPINGS.filter(loc =>
        loc.keyword.includes(str) || loc.official.toLowerCase().includes(str)
    );
}

function InputForm({ inputs, setInputs, onCalculate, isLoading }) {
    const [startSuggestions, setStartSuggestions] = React.useState([]);
    const [endSuggestions, setEndSuggestions] = React.useState([]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setInputs(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));

        if (id === 'startPointInput') setStartSuggestions(getSuggestions(value));
        if (id === 'destinationInput') setEndSuggestions(getSuggestions(value));
    };

    const handleSuggestionClick = (id, official) => {
        setInputs(prev => ({
            ...prev,
            [id]: official,
        }));
        if (id === 'startPointInput') setStartSuggestions([]);
        if (id === 'destinationInput') setEndSuggestions([]);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="rideText" className="block text-sm font-medium text-gray-700 mb-1">Ride Request Message</label>
                <textarea
                    id="rideText"
                    value={inputs.rideText}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="e.g., Need a ride from UB North Campus to Niagara Falls around 10 am"
                />
            </div>
            <div>
                <p className="text-center text-sm text-gray-500 -mb-2">Or enter locations manually:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                    <label htmlFor="startPointInput" className="block text-sm font-medium text-gray-700 mb-1">Starting Point</label>
                    <input
                        type="text"
                        id="startPointInput"
                        autoComplete="off"
                        value={inputs.startPointInput}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Start: e.g., airport, Amherst Manor, UB North Campus"
                    />
                    {startSuggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-b shadow max-h-36 overflow-y-auto">
                            {startSuggestions.map(loc => (
                                <li
                                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                                    key={loc.official}
                                    onClick={() => handleSuggestionClick('startPointInput', loc.official)}
                                >
                                    <span className="font-semibold">{loc.official}</span> <span className="text-gray-400">({loc.keyword})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="relative">
                    <label htmlFor="destinationInput" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input
                        type="text"
                        id="destinationInput"
                        autoComplete="off"
                        value={inputs.destinationInput}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="End: e.g., airport, Ellicott Complex, Walmart"
                    />
                    {endSuggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-b shadow max-h-36 overflow-y-auto">
                            {endSuggestions.map(loc => (
                                <li
                                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                                    key={loc.official}
                                    onClick={() => handleSuggestionClick('destinationInput', loc.official)}
                                >
                                    <span className="font-semibold">{loc.official}</span> <span className="text-gray-400">({loc.keyword})</span>
                                </li>
                            ))}
                        </ul>
                    )}
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
