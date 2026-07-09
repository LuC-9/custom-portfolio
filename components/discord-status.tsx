"use client";

import { useLanyard, LanyardWebsocket } from "react-use-lanyard";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion";
import { SpotifyCard } from "@/components/spotify-card";
import { ActivityCard } from "@/components/activity-card";

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
  const customStatusActivity = status?.activities?.find(
    (item) => item.name === "Custom Status" || item.type === 4,
  );
  const isSpotify = Boolean(status?.listening_to_spotify && status?.spotify);
  const customStatusEmoji = customStatusActivity?.emoji as
    | { id?: string; name?: string; animated?: boolean }
    | undefined;
  const customStatusText =
    typeof customStatusActivity?.state === "string" ? customStatusActivity.state.trim() : "";
  const hasCustomEmoji = Boolean(customStatusEmoji?.id || customStatusEmoji?.name);
  const hasCustomStatus = Boolean(customStatusText || hasCustomEmoji);
  const title = activity?.name ? `Playing: ${activity.name}` : presenceLabel(presence);
  const isRichActivity = Boolean(activity && (activity.details || activity.state || activity.application_id));
  const motionProps = {
    initial: reduceMotion ? false : { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.2 },
  };

  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait">
        {isSpotify && status?.spotify ? (
          <motion.div key="spotify" {...motionProps}>
            <SpotifyCard
              song={status.spotify.song}
              artist={status.spotify.artist}
              albumArtUrl={status.spotify.album_art_url ?? null}
              startMs={status.spotify.timestamps.start}
              endMs={status.spotify.timestamps.end}
            />
          </motion.div>
        ) : activity?.name ? (
          isRichActivity && activity ? (
            <motion.div key="activity-card" {...motionProps}>
              <ActivityCard activity={activity} />
            </motion.div>
          ) : (
          <motion.div
            key="activity"
            {...motionProps}
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
          )
        ) : hasCustomStatus ? (
          <motion.div
            key="custom-status"
            {...motionProps}
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
            {customStatusEmoji?.id ? (
              // Discord custom-status emoji URLs are dynamic CDN assets, so <img> is required here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://cdn.discordapp.com/emojis/${customStatusEmoji.id}.${customStatusEmoji.animated ? "gif" : "png"}?size=32`}
                alt={customStatusEmoji.name}
                aria-label={customStatusEmoji.name}
                className="h-4 w-4 shrink-0"
              />
            ) : customStatusEmoji?.name ? (
              <span className="shrink-0 leading-none">{customStatusEmoji.name}</span>
            ) : null}
            {customStatusText ? (
              <span className="max-w-[160px] truncate sm:max-w-[220px]">{customStatusText}</span>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="presence"
            {...motionProps}
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
        )}
      </AnimatePresence>
    </div>
  );
}
