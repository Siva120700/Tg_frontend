import React from "react";

type Props = {
  onSelect: (response: { text: string }) => void;
};

const HistorySidebar: React.FC<Props> = ({ onSelect }) => {
  const responses = JSON.parse(localStorage.getItem("responses") || "[]");

  return (
    <div className="w-full bg-stone-900 text-white p-4">
      <h2 className="text-2xl text-blue-500 font-bold mb-4">History</h2>
      <ul className="space-y-2 text-lg">
        {responses
          .slice() // Create a shallow copy to avoid mutating the original array
          .reverse() // Reverse the order of the responses
          .map((response: { id: string; text: string }) => (
            <li
              key={response.id}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => onSelect(response)}
            >
              {response.text}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default HistorySidebar;
