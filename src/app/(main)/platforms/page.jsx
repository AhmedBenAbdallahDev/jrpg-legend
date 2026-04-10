import React from "react";
import Link from "next/link";
import { SiPlaystation, SiSega } from "react-icons/si";
import { FaGamepad, FaMobileAlt } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";

export const metadata = {
  title: "Supported Gaming Platforms - JRPGLegend",
  description:
    "Explore all the retro gaming platforms supported by our emulation system",
};

// Function to get the appropriate icon for each platform category
const getCategoryIcon = (slug) => {
  const iconSize = 24;

  switch (slug) {
    case "nes":
    case "snes":
      return <FaGamepad size={iconSize} />;
    case "n64":
      return <FaGamepad size={iconSize} />;
    case "gb":
    case "gbc":
    case "gba":
      return <FaMobileAlt size={iconSize} />;
    case "nds":
      return <FaGamepad size={iconSize} />;
    case "genesis":
    case "segacd":
    case "saturn":
      return <SiSega size={iconSize} />;
    case "psx":
    case "psp":
      return <SiPlaystation size={iconSize} />;
    case "arcade":
      return <FaGamepad size={iconSize} />;
    default:
      return <FaGamepad size={iconSize} />;
  }
};

const PlatformCard = ({ name, core, abbreviation, year, color, slug, img }) => {
  const colorMap = {
    "red-600": {
      text: "text-red-600",
      bg: "bg-red-600",
    },
    "purple-600": {
      text: "text-purple-600",
      bg: "bg-purple-600",
    },
    "green-600": {
      text: "text-green-600",
      bg: "bg-green-600",
    },
    "gray-600": {
      text: "text-gray-600",
      bg: "bg-gray-600",
    },
    "yellow-500": {
      text: "text-yellow-500",
      bg: "bg-yellow-500",
    },
    "indigo-600": {
      text: "text-indigo-600",
      bg: "bg-indigo-600",
    },
    "blue-500": {
      text: "text-blue-500",
      bg: "bg-blue-500",
    },
    "gray-800": {
      text: "text-gray-800",
      bg: "bg-gray-800",
    },
    "slate-500": { text: "text-slate-500", bg: "bg-slate-500" },
    "red-700": {
      text: "text-red-700",
      bg: "bg-red-700",
    },
    "red-800": {
      text: "text-red-800",
      bg: "bg-red-800",
    },
    "gray-700": {
      text: "text-gray-700",
      bg: "bg-gray-700",
    },
    "purple-800": {
      text: "text-purple-800",
      bg: "bg-purple-800",
    },
  };

  const selectedColor = colorMap[color] || {
    text: "text-white",
    bg: "bg-main",
  };

  return (
    <Link
      className={`bg-main rounded-lg grid items-center p-4 pt-10 relative`}
      href={`/category/${slug}`}
    >
      <span className={`absolute top-0 left-0 px-2 m-2 ${selectedColor.text}`}>
        {getCategoryIcon(slug)}
      </span>
      <p
        className={`absolute top-0 right-0 px-2 font-semibold ${selectedColor.bg} rounded m-2 mx-4`}
      >
        {core}
      </p>
      <div
        className={`w-full aspect-video ${selectedColor.bg} rounded-lg flex flex-col relative group cursor-pointer`}
      >
        <div className="bg-main px-2 pb-2 w-[90%] max-h-6 group-hover:max-h-60 mx-auto rounded-b-lg overflow-hidden absolute z-10 top-0 inset-x-0 transition-all duration-700 ease-in-out">
          <p className={`font-semibold text-center ${selectedColor.text}`}>
            {name}
          </p>
        </div>
        <div className="bg-main w-[90%] h-6 mx-auto rounded-t-lg pt-2 absolute z-10 bottom-0 inset-x-0 flex items-center justify-center gap-2">
          <p className={`font-semibold ${selectedColor.text} text-center`}>
            {abbreviation} <span className="text-white">{year}</span>
          </p>
        </div>
        <img
          src={img}
          alt=""
          className="absolute w-full h-full opacity-80 object-contain"
        />
      </div>
    </Link>
  );
};

export default function PlatformsPage() {
  const platforms = [
    {
      name: "Nintendo Entertainment System",
      abbreviation: "NES",
      core: "nes",
      slug: "nes",
      year: "1983",
      color: "red-600",
      img: "https://upload.wikimedia.org/wikipedia/commons/b/b2/NES-Console-Set.png",
    },
    {
      name: "Super Nintendo",
      abbreviation: "SNES",
      core: "snes",
      slug: "snes",
      year: "1990",
      color: "purple-600",
      img: "https://upload.wikimedia.org/wikipedia/commons/b/b2/NES-Console-Set.png",
    },
    {
      name: "Nintendo 64",
      abbreviation: "N64",
      core: "n64",
      slug: "n64",
      year: "1996",
      color: "green-600",
      img: "https://upload.wikimedia.org/wikipedia/commons/b/b2/NES-Console-Set.png",
    },
    {
      name: "Game Boy",
      abbreviation: "GB",
      core: "gb",
      slug: "gb",
      year: "1989",
      color: "gray-600",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Game-Boy-FL.png/960px-Game-Boy-FL.png",
    },
    {
      name: "Game Boy Color",
      abbreviation: "GBC",
      core: "gbc",
      slug: "gbc",
      year: "1998",
      color: "yellow-500",
      img: "https://upload.wikimedia.org/wikipedia/commons/3/35/Nintendo-Game-Boy-Color-FL.png",
    },
    {
      name: "Game Boy Advance",
      abbreviation: "GBA",
      core: "gba",
      slug: "gba",
      year: "2001",
      color: "indigo-600",
      img: "https://upload.wikimedia.org/wikipedia/commons/1/14/Nintendo-Game-Boy-Advance-Black-FL.png",
    },
    {
      name: "Nintendo DS",
      abbreviation: "NDS",
      core: "nds",
      slug: "nds",
      year: "2004",
      color: "blue-500",
      img: "https://upload.wikimedia.org/wikipedia/commons/1/14/Nintendo-Game-Boy-Advance-Black-FL.png",
    },
    {
      name: "PlayStation",
      abbreviation: "PSX",
      core: "psx",
      slug: "psx",
      year: "1994",
      color: "gray-800",
      img: "https://upload.wikimedia.org/wikipedia/commons/9/95/PSX-Console-wController.png",
    },
    {
      name: "PlayStation Portable",
      abbreviation: "PSP",
      core: "psp",
      slug: "psp",
      year: "2004",
      color: "slate-500",
      img: "https://upload.wikimedia.org/wikipedia/commons/9/9a/PSP-1000.png",
    },
    {
      name: "Sega Genesis",
      abbreviation: "Genesis",
      core: "segaMD",
      slug: "genesis",
      year: "1988",
      color: "red-700",
      img: "https://upload.wikimedia.org/wikipedia/commons/1/19/Sega-Genesis-NA-Mk2-Console-Set.png",
    },
    {
      name: "Sega CD",
      abbreviation: "Sega CD",
      core: "segaCD",
      slug: "segacd",
      year: "1991",
      color: "red-800",
      img: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MegaCD.png",
    },
    {
      name: "Sega Saturn",
      abbreviation: "Saturn",
      core: "segaSaturn",
      slug: "saturn",
      year: "1994",
      color: "gray-700",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Sega-Saturn-Console-Set-Mk2.png/1280px-Sega-Saturn-Console-Set-Mk2.png",
    },
    {
      name: "Arcade",
      abbreviation: "Arcade",
      core: "arcade",
      slug: "arcade",
      year: "Various",
      color: "purple-800",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Sega-Saturn-Console-Set-Mk2.png/1280px-Sega-Saturn-Console-Set-Mk2.png",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Supported Gaming Platforms</h1>
        <p className="text-accent mb-6">
          Our application supports a wide range of classic gaming systems
          through high-quality emulation. Browse games by platform or add your
          own ROMs to expand your collection.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {platforms.map((platform) => (
            <PlatformCard
              key={platform.core}
              name={platform.name}
              abbreviation={platform.abbreviation}
              core={platform.core}
              slug={platform.slug}
              year={platform.year}
              color={platform.color}
              img={platform.img}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
