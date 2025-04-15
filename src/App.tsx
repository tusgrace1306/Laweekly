// lostark_raid_tracker.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Editable raid list
const defaultRaidList = ["Akkan", "Ivory", "Thaemine", "Echidna", "Behemoth", "Aegir", "Ice Brel"];
const raidOptions = ["Skip", "Normal", "Hard"];

interface Character {
  name: string;
  class: string;
  ilvl: number;
  raids: { [key: string]: string }; // e.g., { Akkan: "Skip", Thaemine: "Hard" }
  raidProgress: { [key: string]: boolean }; // tracking progress for chosen raids
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
      <Button onClick={addCharacter}>+ Add Character</Button>
      <Button onClick={resetProgress} variant="destructive" className="ml-4">Reset Progress</Button>
      {characters.map((char, idx) => (
        <Card key={idx} className="p-4">
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Name"
              value={char.name}
              onChange={(e) => {
                const updated = [...characters];
                updated[idx].name = e.target.value;
                setCharacters(updated);
              }}
            />
            <Input
              placeholder="Class"
              value={char.class}
              onChange={(e) => {
                const updated = [...characters];
                updated[idx].class = e.target.value;
                setCharacters(updated);
              }}
            />
            <Input
              placeholder="iLvl"
              type="number"
              value={char.ilvl}
              onChange={(e) => {
                const updated = [...characters];
                updated[idx].ilvl = parseInt(e.target.value);
                setCharacters(updated);
              }}
            />
            {raidList.map((raid) => (
              <Select
                key={raid}
                value={char.raids[raid]}
                onValueChange={(value) => handleRaidChange(idx, raid, value)}
              >
                {raidOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {raid} - {opt}
                  </SelectItem>
                ))}
              </Select>
            ))}
          </CardContent>

          {/* Raid tracking checkboxes */}
          {Object.entries(char.raidProgress).length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(char.raidProgress).map(([raid, completed]) => (
                <label key={raid} className="flex items-center space-x-2">
                  <Checkbox checked={completed} onCheckedChange={() => handleCheckboxChange(idx, raid)} />
                  <span>{raid}</span>
                </label>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
