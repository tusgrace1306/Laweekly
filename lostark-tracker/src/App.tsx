import React, { useState, useEffect } from "react";

const raidList = ["Akkan", "Ivory", "Thaemine", "Echidna", "Behemoth", "Aegir", "Ice Brel"];
const raidOptions = ["Skip", "Normal", "Hard"];

interface Character {
  name: string;
  class: string;
  ilvl: number;
  raids: { [key: string]: string };
  income: number;
}

const raidIncomeValues: { [key: string]: { [level: string]: number } } = {
  Akkan: { Skip: 0, Normal: 50000, Hard: 100000 },
  Ivory: { Skip: 0, Normal: 40000, Hard: 80000 },
  Thaemine: { Skip: 0, Normal: 70000, Hard: 140000 },
  Echidna: { Skip: 0, Normal: 30000, Hard: 60000 },
  Behemoth: { Skip: 0, Normal: 60000, Hard: 120000 },
  Aegir: { Skip: 0, Normal: 20000, Hard: 40000 },
  "Ice Brel": { Skip: 0, Normal: 35000, Hard: 70000 },
};

const App = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("lostark_characters");
    if (saved) setCharacters(JSON.parse(saved));
    else addCharacter();
  }, []);

  useEffect(() => {
    localStorage.setItem("lostark_characters", JSON.stringify(characters));
  }, [characters]);

  const handleChange = (idx: number, field: keyof Character, value: any) => {
    const updated = [...characters];
    (updated[idx] as any)[field] = value;
    setCharacters(updated);
  };

  const handleRaidChange = (index: number, raid: string, value: string) => {
    const updated = [...characters];
    updated[index].raids[raid] = value;
    updated[index].income = calculateIncome(updated[index]);
    setCharacters(updated);
  };

  const calculateIncome = (char: Character) => {
    return raidList.reduce((sum, raid) => sum + raidIncomeValues[raid][char.raids[raid]], 0);
  };

  const addCharacter = () => {
    const newChar: Character = {
      name: `Char ${characters.length + 1}`,
      class: "",
      ilvl: 0,
      raids: Object.fromEntries(raidList.map((r) => [r, "Skip"])),
      income: 0,
    };
    setCharacters([...characters, newChar]);
  };

  const removeCharacter = (index: number) => {
    const updated = [...characters];
    updated.splice(index, 1);
    setCharacters(updated);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lost Ark Weekly Raid Tracker</h1>
      <button
        onClick={addCharacter}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + Add Character
      </button>
      <div className="space-y-4">
        {characters.map((char, idx) => (
          <div key={idx} className="p-4 border rounded bg-white shadow">
            <div className="flex gap-4 flex-wrap items-center mb-2">
              <input
                type="text"
                value={char.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                placeholder="Name"
                className="border p-2 rounded w-40"
              />
              <input
                type="text"
                value={char.class}
                onChange={(e) => handleChange(idx, "class", e.target.value)}
                placeholder="Class"
                className="border p-2 rounded w-40"
              />
              <input
                type="number"
                value={char.ilvl}
                onChange={(e) => handleChange(idx, "ilvl", parseInt(e.target.value))}
                placeholder="iLvl"
                className="border p-2 rounded w-28"
              />
              <span className="ml-auto text-green-700 font-semibold">Total: {char.income.toLocaleString()}g</span>
              <button onClick={() => removeCharacter(idx)} className="text-red-600 underline ml-4">
                Remove
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {raidList.map((raid) => (
                <select
                  key={raid}
                  value={char.raids[raid]}
                  onChange={(e) => handleRaidChange(idx, raid, e.target.value)}
                  className="border p-2 rounded"
                >
                  {raidOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {raid} - {opt}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
