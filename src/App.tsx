// lostark_raid_tracker.tsx
"use client";

import { useState } from "react";

// Editable raid list
const defaultRaidList = ["Echidna", "Behemoth", "Aegir", "Ice Brel"];
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
  const [newRaid, setNewRaid] = useState<string>("");
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

  const addRaid = () => {
    const trimmed = newRaid.trim();
    if (!trimmed || raidList.includes(trimmed)) return;
    const updatedList = [...raidList, trimmed];
    setRaidList(updatedList);
    setNewRaid("");
    setCharacters((prev) =>
      prev.map((char) => ({
        ...char,
        raids: { ...char.raids, [trimmed]: "Skip" },
      }))
    );
  };

  return (
    <div className="p-4 space-y-4 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Lost Ark Raid Tracker</h1>

      <div className="flex flex-wrap justify-between gap-4 items-center">
        <div className="flex gap-2">
          <button onClick={addCharacter} className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Character</button>
          <button onClick={resetProgress} className="px-4 py-2 bg-red-600 text-white rounded">Reset Progress</button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new raid"
            value={newRaid}
            onChange={(e) => setNewRaid(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={addRaid}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            + Add Raid
          </button>
        </div>
      </div>

      {characters.map((char, idx) => (
        <div key={idx} className="p-4 border rounded shadow bg-white space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <input
              placeholder="Name"
              value={char.name}
              onChange={(e) => {
                const updated = [...characters];
                updated[idx].name = e.target.value;
                setCharacters(updated);
              }}
              className="border p-2 rounded w-full"
            />
            <input
              placeholder="Class"
              value={char.class}
              onChange={(e) => {
                const updated = [...characters];
                updated[idx].class = e.target.value;
                setCharacters(updated);
              }}
              className="border p-2 rounded w-full"
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
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="overflow-auto">
            <table className="min-w-full border mt-2">
              <thead>
                <tr>
                  {raidList.map((raid) => (
                    <th key={raid} className="border p-2 bg-gray-100 text-sm text-left">{raid}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {raidList.map((raid) => (
                    <td key={raid} className="border p-2">
                      <select
                        value={char.raids[raid]}
                        onChange={(e) => handleRaidChange(idx, raid, e.target.value)}
                        className="border p-1 rounded w-full"
                      >
                        {raidOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
                <tr>
                  {raidList.map((raid) => (
                    <td key={raid + "_check"} className="border p-2 text-center">
                      {char.raids[raid] !== "Skip" && (
                        <input
                          type="checkbox"
                          checked={char.raidProgress[raid] || false}
                          onChange={() => handleCheckboxChange(idx, raid)}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
