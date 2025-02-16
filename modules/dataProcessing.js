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

export function findFridayNightSongs(events) {
  if (!events || events.length === 0) return null;

  let songCounts = {};

  events.forEach((event) => {
    const eventDate = new Date(event.timestamp);
    const day = eventDate.getDay(); // 5 = Friday
    const hours = eventDate.getHours(); // Get hour of the event

    // Check if it's between Friday 17:00 and Saturday 04:00
    if ((day === 5 && hours >= 17) || (day === 6 && hours < 4)) {
      songCounts[event.song_id] = (songCounts[event.song_id] || 0) + 1;
    }
  });

  // Sort and return the most played song on Friday nights
  const mostPlayedFridayNight = Object.entries(songCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return mostPlayedFridayNight
    ? { song_id: mostPlayedFridayNight[0], count: mostPlayedFridayNight[1] }
    : null;
}

export function findLongestStreakSong(events) {
  if (!events || events.length === 0) return null;

  let longestStreakSong = null;
  let longestStreak = 0;
  let currentStreakSong = null;
  let currentStreak = 0;

  events.forEach((event) => {
    if (event.song_id === currentStreakSong) {
      currentStreak++; // Increase streak if the same song is repeated
    } else {
      // Check if the last streak was the longest
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        longestStreakSong = currentStreakSong;
      }
      // Reset streak
      currentStreakSong = event.song_id;
      currentStreak = 1;
    }
  });

  // Final check in case the longest streak is at the end
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
    longestStreakSong = currentStreakSong;
  }

  return longestStreakSong
    ? { song_id: longestStreakSong, streak: longestStreak }
    : null;
}

export function findEveryDaySongs(events) {
  if (!events || events.length === 0) return null;

  let songDaysMap = {}; // Track which days each song was played
  let allDays = new Set(); // Track all unique days the user listened to music

  // Step 1: Store all days the user listened to any song
  events.forEach((event) => {
    const day = new Date(event.timestamp).toISOString().split("T")[0];

    allDays.add(day); // Add the day to the set of all listening days

    if (!songDaysMap[event.song_id]) {
      songDaysMap[event.song_id] = new Set();
    }
    songDaysMap[event.song_id].add(day);
  });

  // Step 2: Find songs played on every single day
  let everyDaySongs = Object.entries(songDaysMap)
    .filter(([_, days]) => days.size === allDays.size)
    .map(([song]) => song);

  return everyDaySongs.length > 0 ? everyDaySongs : null;
}
