// This file will handle API calls. For now, we'll keep it simple
// as the logic is tied to the Google Maps SDK which needs to be loaded first.
// The main API logic will be in App.jsx for this example.

// Fetch ride details from the Gemini AI
export async function getRideDetailsFromAI(text, apiKey) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    const systemPrompt = `You are a location extractor for a ride service based in Buffalo, NY.
- All ride requests will be for locations within New York State, primarily in the Western New York area.
- Extract the starting point, destination, and time from the user's request.
- Return ONLY a valid JSON object.
- If a value cannot be found, the JSON value MUST be null.
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