import React from 'react';

function PriceCard({ name, price, profit, cost, color }) {
    const colors = {
        green: { border: "border-green-500", text: "text-green-600" },
        blue: { border: "border-blue-500", text: "text-blue-600" },
        purple: { border: "border-purple-500", text: "text-purple-600" }
    };
    const c = colors[color];

    return (
        <div className={`p-6 border-2 ${c.border} rounded-xl shadow-md bg-white`}>
            <h3 className={`text-xl font-bold ${c.text}`}>{name}</h3>
            <p className="text-3xl font-extrabold text-gray-900 my-3">${price.toFixed(2)}</p>
            <div className="text-left space-y-1 text-sm">
                <p className="flex justify-between">
                    <span>Your Profit:</span> 
                    <span className="font-medium text-green-600">${profit.toFixed(2)}</span>
                </p>
                <p className="flex justify-between border-t pt-1">
                    <span>Gas Cost:</span> 
                    <span className="font-medium text-red-600">${cost.toFixed(2)}</span>
                </p>
            </div>
        </div>
    );
}

export default PriceCard;