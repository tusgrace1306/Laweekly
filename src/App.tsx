// lostark_raid_tracker.tsx
"use client";

import { useState } from "react";

// Editable raid list
const defaultRaidList = ["Akkan", "Ivory", "Thaemine", "Echidna", "Behemoth", "Aegir", "Ice Brel"];
const raidOptions = ["Skip", "Normal", "Hard"];

interface Character {
  name: string;
  class: string;
  ilvl: number;
  raids: { [key: string]: string };
  raidProgress: { [key: string]: boolean };
}

export default function LostArkRaidTracker() {
  const [raidList, setRaidList] = useState<string[]>(defaultRaidList);
  const [characters, setCharacters] = useState<Character[]>([
    {
      name: "Main WD",
      class: "Wardancer",
      ilvl: 1680,
      raids: Object.fromEntries(defaultRaidList.map((r) => [r, "Skip"])),
      raidProgress: {},
    },
  ]);

  const handleRaidChange = (index: number, raid: string, value: string) => {
    const updated = [...characters];
    updated[index].raids[raid] = value;
    if (value === "Skip") delete updated[index].raidProgress[raid];
    else updated[index].raidProgress[raid] = false;
    setCharacters(updated);
  };

  const handleCheckboxChange = (index: number, raid: string) => {
    const updated = [...characters];
    updated[index].raidProgress[raid] = !updated[index].raidProgress[raid];
    setCharacters(updated);
  };

  const resetProgress = () => {
    const updated = characters.map((char) => {
      const resetProgress = { ...char.raidProgress };
      for (const raid in resetProgress) {
        resetProgress[raid] = false;
      }
      return { ...char, raidProgress: resetProgress };
    });
    setCharacters(updated);
  };

  const addCharacter = () => {
    setCharacters([
      ...characters,
      {
        name: `Extra ${characters.length + 1}`,
        class: "",
        ilvl: 0,
        raids: Object.fromEntries(raidList.map((r) => [r, "Skip"])),
        raidProgress: {},
      },
    ]);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Lost Ark Raid Tracker</h1>
      <button onClick={addCharacter} className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Character</button>
      <button onClick={resetProgress} className="ml-4 px-4 py-2 bg-red-600 text-white rounded">Reset Progress</button>

      {characters.map((char, idx) => (
        <div key={idx} className="p-4 border rounded shadow bg-white">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              placeholder="Name"
              value={char.name}
              onChange={(e) => {
                const updated = [...characters];
                updated[idx].name = e.target.value;
                setCharacters(updated);
              }}
              className="border p-2 rounded"
            />
            <input
              placeholder="Class"
              value={char.class}
              onChange={(e) => {
                const updated = [...characters];
                updated[idx].class = e.target.value;
                setCharacters(updated);
              }}
              className="border p-2 rounded"
            />
            <input
              placeholder="iLvl"
              type="number"
              value={char.ilvl}
              onChange={(e) => {
                const updated = [...characters];
                updated[idx].ilvl = parseInt(e.target.value);
                setCharacters(updated);
              }}
              className="border p-2 rounded"
            />

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

          {Object.entries(char.raidProgress).length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(char.raidProgress).map(([raid, completed]) => (
                <label key={raid} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => handleCheckboxChange(idx, raid)}
                  />
                  <span>{raid}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
