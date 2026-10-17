export const site = {
  name: "Sound | Developer",
  github: "https://github.com/sarthaklive9967-ship-it",
  description:
    "I create websites, design interfaces, develop Minecraft experiences, and build tools for Discord communities.",
  introduction:
    "I'm a developer and digital creator interested in building thoughtful digital experiences — from modern websites and intuitive interfaces to Minecraft systems and Discord bots. I enjoy combining creative design with functional development.",
} as const;

export const expertise = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Website development, responsive interfaces, and modern web experiences.",
    areas: ["Websites"],
    visual: "web",
  },
  {
    number: "02",
    title: "UI/UX Design",
    description:
      "Interface design, thoughtful layouts, and user-focused digital experiences.",
    areas: ["UI/UX"],
    visual: "design",
  },
  {
    number: "03",
    title: "Minecraft Development",
    description: "Minecraft servers, plugins, mods, and resource packs.",
    areas: [
      "Minecraft servers",
      "Minecraft plugins",
      "Minecraft mods",
      "Minecraft resource packs",
    ],
    visual: "minecraft",
  },
  {
    number: "04",
    title: "Discord Development",
    description: "Discord servers, custom bots, and community tools.",
    areas: ["Discord servers", "Discord bots"],
    visual: "discord",
  },
] as const;

// The build stack is intentionally separate from these confirmed personal areas.
export const confirmedAreas = expertise.flatMap((area) => [...area.areas]);
