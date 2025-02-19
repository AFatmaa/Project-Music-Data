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

export function findMostPlayedSongTime(events) {
  if (!events || events.length === 0) return null;

  let songTime = {};

  events.forEach((event) => {
    const song = getSong(event.song_id);
    if (song) {
      const songKey = `${song.artist} - ${song.title}`;
      songTime[songKey] = (songTime[songKey] || 0) + song.duration_seconds;
    }
  });

  return songTime;
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
  const mostPlayedArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0];

  return mostPlayedArtist
    ? { artist: mostPlayedArtist[0], count: mostPlayedArtist[1] }
    : null;
}

export function findMostPlayedArtistTime(events) {
  if (!events || events.length === 0) return null;

  let artistTime = {};

  events.forEach((event) => {
    const song = getSong(event.song_id);
    if (song) {
      artistTime[song.artist] =
        (artistTime[song.artist] || 0) + song.duration_seconds;
    }
  });

  return artistTime;
}

export function findFridayNightSong(events) {
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
  const mostPlayedFridayNight = Object.entries(songCounts).sort((a, b) => b[1] - a[1])[0];

  return mostPlayedFridayNight
    ? { song_id: mostPlayedFridayNight[0], count: mostPlayedFridayNight[1] }
    : null;
}

export function findFridayNightSongTime(events) {
  if (!events || events.length === 0) return null;

  let songTime = {};

  events.forEach((event) => {
    const eventDate = new Date(event.timestamp);
    const day = eventDate.getDay(); // 5 = Friday
    const hours = eventDate.getHours(); // Get hour of the event

    if ((day === 5 && hours >= 17) || (day === 6 && hours < 4)) {
      const song = getSong(event.song_id);
      if (song) {
        const songKey = `${song.artist} - ${song.title}`;
        songTime[songKey] = (songTime[songKey] || 0) + song.duration_seconds;
      }
    }
  });

  return songTime;
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

export function findEveryDaySongs(listenEvents, songsData) {
    if (listenEvents.length === 0) return [];

    // Sort events chronologically by timestamp
    listenEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Determine the first and last day of user activity (normalized to midnight)
    const startDate  = new Date(listenEvents[0].timestamp).setHours(0, 0, 0, 0);
    const endDate  = new Date(listenEvents[listenEvents.length - 1].timestamp).setHours(0, 0, 0, 0);
  
    const songDays = {}; // Store which dates each song was played

    listenEvents.forEach(event => {
        const songID = event.song_id;
        const eventDate = new Date(event.timestamp).setHours(0, 0, 0, 0); // Normalize to midnight

        if (!songDays[songID]) songDays[songID] = new Set();
        songDays[songID].add(eventDate);
    });

    // Calculate the total number of days between first and last listening day
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Find songs that were played on every single day
    const everyDaySong = Object.keys(songDays)
        .filter(songID => songDays[songID].size === totalDays)
        .map(songID => {
            const song = songsData[songID];
            return {
                title: song.title,
                artist: song.artist,
            };
        });
        
    return everyDaySong;
}

export function findTopGenres(events) {
  if (!events || events.length === 0) return null;

  let genreCounts = {};

  // Count occurrences of each genre
  events.forEach((event) => {
    const song = getSong(event.song_id);
    if (song) {
      genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
    }
  });

  // Convert to array, sort by count (descending order)
  let sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1]) // Sort genres by most played
    .map(([genre]) => genre); // Extract genre names only

  // Select the top genres based on count
  let topGenres;
  if (sortedGenres.length >= 3) {
    topGenres = sortedGenres.slice(0, 3); // Take top 3 if available
  } else {
    topGenres = sortedGenres; // Otherwise, take all available genres
  }

  // Format the result correctly
  let label =
    topGenres.length === 1 ? "Top genre" : `Top ${topGenres.length} genres`;

  return { label, genres: topGenres };
}
