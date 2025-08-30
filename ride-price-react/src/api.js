// This file will handle API calls. For now, we'll keep it simple
// as the logic is tied to the Google Maps SDK which needs to be loaded first.
// The main API logic will be in App.jsx for this example.

// Fetch ride details from the Gemini AI
export async function getRideDetailsFromAI(text, apiKey) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    const systemPrompt = `You are an intelligent assistant for a ride-sharing app. Your task is to parse a user's ride request and return structured data.
                - Extract the starting point, final destination, and time of the ride.
                - CRITICALLY, you MUST also estimate the driving distance in miles and the travel time in minutes for a ONE-WAY trip.
                - If the user mentions "round trip" or "return journey", IGNORE it. Your estimates for distance and time MUST be for a single, one-way journey. The app's UI will handle doubling the values.
                - Return ONLY a valid JSON object.
		- If a value cannot be found, the JSON value MUST be null.
                - For locations like "airport" or "south campus", assume a major, well-known location in a typical US city (e.g., Buffalo Niagara International Airport, University at Buffalo South Campus).
                - Base your distance and time estimations on standard driving routes.
		- Example: {"start": "UB North Campus", "end": "Buffalo Airport", "time": "10:00 AM"}`;

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


