import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function index() {
  const [maps, setMaps] = useState([]);
  const [selectedMaps, setSelectedMaps] = useState<Map[]>([]);
  const [bannedMaps, setBannedMaps] = useState<Map[]>([]);
  async function getMaps() {
    const { data } = await axios.get(
      "https://valorant-api.com/v1/maps?language=tr-TR"
    );
    if (data.status !== 200) return;

    const filteredMaps = data.data.filter(
      (map: any) => map.coordinates && map.displayName !== "POLİGON"
    );
    setMaps(filteredMaps);
  }
  useEffect(() => {
    getMaps();
  }, []);

  const addSelect = (map: Map) => {
    if (selectedMaps.includes(map)) return;
    if (bannedMaps.includes(map)) return;
    setSelectedMaps((oldMaps) => [...oldMaps, map]);
  };
  const addBan = (map: Map) => {
    if (selectedMaps.includes(map)) return;
    if (bannedMaps.includes(map)) return;
    setBannedMaps((oldMaps) => [...oldMaps, map]);
  };

  const remove = ({
    value,
    state,
  }: {
    value: Map;
    state: "selected" | "banned";
  }) => {
    // let filteredArray = [];
    switch (state) {
      case "selected": {
        let filteredArray = selectedMaps.filter(
          (item) => item.uuid !== value.uuid
        );
        setSelectedMaps(filteredArray);
        break;
      }
      case "banned": {
        let filteredArray = bannedMaps.filter(
          (item) => item.uuid !== value.uuid
        );
        setBannedMaps(filteredArray);
        break;
      }
    }
  };

  const random = (state: "selected" | "banned") => {
    const remainingMaps = maps.filter(
      (map) => !bannedMaps.includes(map) && !selectedMaps.includes(map)
    );

    if (remainingMaps.length === 0) {
      // No available maps to select
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingMaps.length);
    const randomMap = remainingMaps[randomIndex];

    switch (state) {
      case "banned": {
        setBannedMaps((currMaps) => [...currMaps, randomMap]);
        break;
      }
      case "selected": {
        setSelectedMaps((currMaps) => [...currMaps, randomMap]);
        break;
      }
    }
  };

  return (
    <div>
      <header className="w-full items-center justify-center flex p-10">
        <h1 className="text-4xl font-bold">VALORANT Map Selector</h1>
      </header>
      <main className="h-full w-full flex flex-row justify-center items-start p-10">
        {/* ALL MAPS */}
        <div className="flex-1  justify-center items-center flex flex-col gap-4">
          <h1 className="text-4xl p-3 font-bold">All Maps ({maps.length})</h1>
          <div className="gap-4 flex">
            <button
              className="bg-green-500/10 hover:bg-green-500/25 text-green-500 py-2 px-4 rounded"
              onClick={() => random("selected")}
            >
              Select Random
            </button>
            <button
              className="bg-red-500/10 hover:bg-red-500/25 text-red-500 py-2 px-4 rounded"
              onClick={() => random("banned")}
            >
              Ban Random
            </button>
          </div>
          <div className="grid gap-4 justify-center items-center grid-cols-2">
            {maps &&
              maps.map((map: Map) => (
                <div
                  key={map.uuid}
                  className={
                    "relative  bg-opacity-50 group justify-center w-full h-full items-center flex cursor-default rounded overflow-hidden " +
                    (selectedMaps.includes(map) && " bg-green-500 ") +
                    (bannedMaps.includes(map) && " bg-red-500 ")
                  }
                >
                  <div className="group-hover:flex absolute hidden z-50 bg-black bg-opacity-25 justify-center items-center w-full h-full gap-4">
                    <button
                      onClick={() => addSelect(map)}
                      className="bg-green-500 py-2 px-4 rounded"
                    >
                      Select
                    </button>
                    <button
                      onClick={() => addBan(map)}
                      className="bg-red-500 py-2 px-4 rounded"
                    >
                      Ban
                    </button>
                  </div>
                  <Image
                    width={300}
                    height={100}
                    alt={`Map-${map.displayName}`}
                    src={map.splash}
                    className=" opacity-50 -z-40 transition-transform transform-gpu group-hover:scale-125"
                  />

                  <div className="absolute p-6  text-4xl z-1 font-bold">
                    {map.displayName}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* SELECTED MAPS */}
        <div className="flex-1 justify-center items-center flex flex-col gap-4">
          <h1 className="text-4xl p-3 font-bold">Selected Maps ({selectedMaps.length})</h1>
          <div className="grid gap-4 justify-center items-center grid-cols-1">
            {selectedMaps &&
              selectedMaps.map((map: Map) => (
                <div
                  onClick={() => remove({ value: map, state: "selected" })}
                  key={map.uuid}
                  className="relative  group justify-center w-full h-full items-center flex cursor-default rounded overflow-hidden "
                >
                  <Image
                    width={300}
                    height={100}
                    alt={`Map-${map.displayName}`}
                    src={map.splash}
                    className=" opacity-50 -z-40 transition-transform transform-gpu group-hover:scale-125"
                  />

                  <div className="absolute p-6  text-4xl z-1 font-bold">
                    {map.displayName}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* BANNED MAPS */}
        <div className="flex-1  justify-center items-center flex flex-col gap-4">
          <h1 className="text-4xl p-3 font-bold">Banned Maps ({bannedMaps.length})</h1>
          <div className="grid gap-4 justify-center items-center grid-cols-1">
            {bannedMaps &&
              bannedMaps.map((map: Map) => (
                <div
                  onClick={() => remove({ value: map, state: "banned" })}
                  key={map.uuid}
                  className="relative  group justify-center w-full h-full items-center flex cursor-default rounded overflow-hidden "
                >
                  <Image
                    width={300}
                    height={100}
                    alt={`Map-${map.displayName}`}
                    src={map.splash}
                    className=" opacity-50 -z-40 transition-transform transform-gpu group-hover:scale-125"
                  />

                  <div className="absolute p-6  text-4xl z-1 font-bold">
                    {map.displayName}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
      <footer className="bottom-1">All things reserved</footer>
    </div>
  );
}

type Map = {
  uuid: string;
  displayName: string;
  narrativeDescription: string;
  tacticalDescription: string;
  coordinates: string;
  displayIcon: string;
  listViewIcon: string;
  splash: string;
  assetPath: string;
  mapUrl: string;
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
  callouts: [];
};
