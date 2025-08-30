// This file will handle API calls. For now, we'll keep it simple
// as the logic is tied to the Google Maps SDK which needs to be loaded first.
// The main API logic will be in App.jsx for this example.

// Fetch ride details from the Gemini AI
export async function getRideDetailsFromAI(text, apiKey) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    const systemPrompt = `  "instructions": [
"You are an intelligent assistant for a ride-sharing app. Your task is to parse a user's ride request and return structured data as a JSON object.",
"Follow these steps:",
"1. Extract the starting point, final destination, and time of the ride from the user's message.",
"2. Normalize location names: Convert common or short names (e.g., 'airport', 'south campus', 'Amherst Manor', 'Walmart', etc.) to their official addresses in Buffalo, NY, using the exact mapping list below.",
" Use these mappings:",
" - 'airport': Buffalo Niagara International Airport, 4200 Genesee St, Cheektowaga, NY 14225",
" - 'amherst': 1525 Amherst Manor Blvd, 111, Amherst, NY 14221",
" - 'amherst manor': 1525 Amherst Manor Blvd, 111, Amherst, NY 14221",
" - 'amherst manor right': 1525 Amherst Manor Blvd, 111, Amherst, NY 14221",
" - 'amherst manor dr': 1525 Amherst Manor Blvd, 111, Amherst, NY 14221",
" - 'amherst manor -': 1525 Amherst Manor Blvd, 111, Amherst, NY 14221",
" - 'triads': The Triad Apartments 1400-1430 Millersport Hwy, Williamsville, NY 14221",
" - 'niagara falls blvd': Niagara Falls Blvd, Buffalo, NY 14214",
" - 'niagara blvd': Niagara Falls Blvd, Buffalo, NY 14214",
" - 'niagara': Niagara Falls State Park , 332 Prospect St, Niagara Falls, NY 14303",
" - 'niagara falls': Niagara Falls State Park , 332 Prospect St, Niagara Falls, NY 14303",
" - 'niagara outlet': Fashion Outlets of Niagara Falls USA , 1900 Military Rd, Niagara Falls, NY 14304",
" - '35 callodine': Callodine Ave, Amherst, NY 14226",
" - '83 w winspear ave, buffalo 14214': 83 W Winspear Ave, Buffalo, NY 14214",
" - '156 winspear ave': Winspear Ave, Buffalo, NY 14215",
" - '305 winspear ave': Winspear Ave, Buffalo, NY 14215",
" - 'winspear ave': Winspear Ave, Buffalo, NY 14215",
" - 'walden': Walden Galleria, 1 Walden Galleria, Buffalo, NY 14225",
" - 'walmart': Walmart Supercenter, 3290 Sheridan Dr, Amherst, NY 14226",
" - 'ellicot college': Ellicott Complex - University at Buffalo, 125-175 Lee Rd, Buffalo, NY 14261",
" - 'ellicott complex': Ellicott Complex - University at Buffalo, 125-175 Lee Rd, Buffalo, NY 14261",
" - 'ellicot': Ellicott Complex - University at Buffalo, 125-175 Lee Rd, Buffalo, NY 14261",
" - 'south': University at Buffalo (South Campus)",
" - 'south campus': University at Buffalo (South Campus)",
" - 'north campus': University at Buffalo (North Campus)",
" - 'alumni arena': Alumni Arena - University at Buffalo, 80 Coventry Rd, Buffalo, NY 14260",
" - 'statler food commissary': Statler Food Commissary - University at Buffalo",
" - 'commissary': Statler Food Commissary - University at Buffalo",
" - 'commissary pick': Statler Food Commissary - University at Buffalo",
" - 'hindu temple society': Hindu Cultural Society, 1595 N French Rd, Getzville, NY 14068",
" - 'hindu cultural society': Hindu Cultural Society, 1595 N French Rd, Getzville, NY 14068",
" - 'englewood ave': Englewood Ave, Buffalo, NY 14214",
" - 'south englewood': Englewood Ave, Buffalo, NY 14214",
" - 'lisbon': Lisbon Ave, Buffalo, NY 14214",
" - 'bank of america, hertel avenue branch': Bank of America Financial Center, 1452 Hertel Ave, Buffalo, NY 14216",
" - 'bofa, 7864 transit road': Bank of America (with Drive-thru ATM), 7864 Transit Rd, Williamsville, NY 14221",
" - 'bank of america (with drive-thru atm)': Bank of America (with Drive-thru ATM), 7864 Transit Rd, Williamsville, NY 14221",
" - 'bank of america financial center': Bank of America Financial Center, 1452 Hertel Ave, Buffalo, NY 14216",
" - '102 affinity ln': 102 Affinity Ln, Cheektowaga, NY 14215",
" - '54 gruner rd': 54 Gruner Rd, Cheektowaga, NY 14227",
" - 'callodine ave': Callodine Ave, Amherst, NY 14226",
" - 'niagara fls blvd': Niagara Falls Blvd, Buffalo, NY 14214",
" - 'merrimac': Merrimac St, Buffalo, NY 14214",
" - 'tyler st': Tyler St, Buffalo, NY 14214",
" - 'springville ave': 248 Springville Ave, Buffalo, NY 14226",
"3. Estimate the driving distance (in miles) and the one-way travel time (in minutes) between the start and end locations, based on standard driving routes and normal traffic. If the user mentions 'round trip' or 'return journey', still only calculate and return the values for one-way.",
"4. If any value (start, end, or time) cannot be found in the request, set that JSON value to null.",
"5. Output ONLY a valid JSON object with the following fields:",
" - start: (official address or null)",
" - end: (official address or null)",
" - time: (string or null)",
" - estimated_distance: (number or null)",
" - estimated_duration: (number or null)",
"For example, if the user says 'I need a ride from North Campus to the airport at 10:00 AM', you would return:",
"{"start": "University at Buffalo (North Campus)", "end": "Buffalo Niagara International Airport, 4200 Genesee St, Cheektowaga, NY 14225", "time": "10:00 AM", "estimated_distance": 12, "estimated_duration": 25}",
"Always use your street-level knowledge of Buffalo/UB and the mappings provided to normalize addresses."
]   `;

    const payload = {
        contents: [{ parts: [{ text }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Gemini API request failed (Status: ${response.status})`);

    const result = await response.json();
    try {
        return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (e) {
        throw new Error("Received invalid response from AI.");
    }
}


