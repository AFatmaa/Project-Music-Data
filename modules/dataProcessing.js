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
