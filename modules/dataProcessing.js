import { getSong } from "../data.js";

export function findMostPlayedSong(events) {
  if (!events || events.length === 0) return null;

  let songCounts = {};

  events.forEach((event) => {
    songCounts[event.song_id] = (songCounts[event.song_id] || 0) + 1;
  });

  // Sort songs by count and return the most played one
  const mostPlayed = Object.entries(songCounts).sort((a, b) => b[1] - a[1])[0];

  return mostPlayed ? { song_id: mostPlayed[0], count: mostPlayed[1] } : null;
}

export function findMostPlayedArtist(events) {
  if (!events || events.length === 0) return null;

  let artistCounts = {};

  events.forEach((event) => {
    const song = getSong(event.song_id);
    if (song) {
      artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
    }
  });

  // Sort artists by count and return the most played one
  const mostPlayedArtist = Object.entries(artistCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return mostPlayedArtist
    ? { artist: mostPlayedArtist[0], count: mostPlayedArtist[1] }
    : null;
}

export function calculateListeningTime(events) {
  if (!events || events.length === 0) return null;

  let songTime = {};

  events.forEach((event) => {
    const song = getSong(event.song_id);
    if (song) {
      songTime[song.title] =
        (songTime[song.title] || 0) + song.duration_seconds;
    }
  });

  return songTime;
}
