"use client";

import { useLanyard, LanyardWebsocket } from "react-use-lanyard";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion";

type PresenceStatus = "online" | "idle" | "dnd" | "offline";

function presenceLabel(status: PresenceStatus) {
  if (status === "online") return "Online on Discord";
  if (status === "idle") return "Idle on Discord";
  if (status === "dnd") return "Do not disturb";
  return "Offline on Discord";
}

export function DiscordStatus() {
  const reduceMotion = useReducedMotionSafe();
  const { status } = useLanyard({
    userId: "530664369852252162",
    socket: true,
  }) as LanyardWebsocket;

  const presence = (status?.discord_status ?? "offline") as PresenceStatus;
  const activity = status?.activities?.find((item) => item.name !== "Custom Status");
  const title = status?.spotify
    ? `Listening: ${status.spotify.song}`
    : activity?.name
      ? `Playing: ${activity.name}`
      : presenceLabel(presence);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={title}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 font-mono text-xs text-muted-foreground"
      >
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${
            presence === "online"
              ? `bg-emerald-500 ${reduceMotion ? "" : "animate-pulse"}`
              : "bg-muted-foreground/60"
          }`}
        />
        <span>{title}</span>
      </motion.div>
    </AnimatePresence>
  );
}
