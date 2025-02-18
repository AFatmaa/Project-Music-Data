import {populateUserDropdown, handleUserSelection,} from "./modules/userSelection.js";
import { getListenEvents, getSong } from "./data.js";
import {findMostPlayedSong, findMostPlayedArtist, findFridayNightSongs, findLongestStreakSong, findEveryDaySongs, findTopGenres, calculateListeningTimeBySong,calculateListeningTimeByArtist,calculateFridayNightListeningTime, } from "./modules/dataProcessing.js";
import { updateResultsUI } from "./modules/uiRendering.js";

// Function to handle user selection and fetch data
function onUserSelected(userId) {
  const userData = getListenEvents(userId);

  if (!userData || userData.length === 0) {
    console.log(`User ${userId} has no listening history.`);
    updateResultsUI(userId, {}); // Pass empty object to trigger "no data" message
    return;
  }

  // Find the most played song (count)
  const mostPlayedSong = findMostPlayedSong(userData);
  console.log(mostPlayedSong ? `Most listened song (count): ${getSong(mostPlayedSong.song_id).artist} - ${getSong(mostPlayedSong.song_id).title}`: "No most played song found.");

  // Calculate total listening time
  const listeningTimeData = calculateListeningTimeBySong(userData);

  // Find the most listened song (time)
  const mostPlayedSongTime = Object.entries(listeningTimeData).reduce((max, [songKey, time]) => (time > max.time 
    ? { songKey, time } : max), { songKey: null, time: 0 });

  console.log(
    mostPlayedSongTime.songKey
      ? `Most listened song (time): ${mostPlayedSongTime.songKey}`
      : "No data available for most listened song (time)."
  );

  // Find the most played artist
  const mostPlayedArtist = findMostPlayedArtist(userData);
  console.log(
    mostPlayedArtist
      ? `Most listened artist (count): ${mostPlayedArtist.artist} `
      : "No most played artist found."
  );

  // Calculate total listening time by artist
  const listeningTimeByArtist = calculateListeningTimeByArtist(userData);

  // Find the most listened artist (time)
  let mostPlayedArtistTime = Object.entries(listeningTimeByArtist).reduce(
    (max, [artist, time]) => (time > max.time ? { artist, time } : max),
    { artist: null, time: 0 }
  );

  console.log(
    mostPlayedArtistTime.artist
      ? `Most listened artist (time): ${mostPlayedArtistTime.artist}`
      : "No data available for most listened artist (time)."
  );

  // Find most played song on Friday nights
  const fridayNightSong = findFridayNightSongs(userData);
  console.log(
    fridayNightSong
      ? `Friday night song (count): ${getSong(fridayNightSong.song_id).artist} - ${getSong(fridayNightSong.song_id).title}`
      : "No songs were played on Friday night."
  );

  // Calculate total listening time for Friday night songs
  const fridayNightTimeData = calculateFridayNightListeningTime(userData);

  // Find the most listened song on Friday night
  let fridayNightSongTime = Object.entries(fridayNightTimeData).reduce(
    (max, [songKey, time]) => (time > max.time ? { songKey, time } : max),
    { songKey: null, time: 0 }
  );

  console.log(
    fridayNightSongTime.songKey
      ? `Friday night song (time): ${fridayNightSongTime.songKey}`
      : "No data available for Friday night song (time)."
  );

  // Find the longest streak song
  const longestStreak = findLongestStreakSong(userData);
  console.log(
    longestStreak
      ? `Longest streak song: ${getSong(longestStreak.song_id).artist} - ${getSong(longestStreak.song_id).title} (length:${longestStreak.streak})`
      : "No streak song found."
  );

  // Find the everyday songs
  const everyDaySongs = findEveryDaySongs(userData);
  if (everyDaySongs && everyDaySongs.length > 0) {
    const songDetails = everyDaySongs.map((songId) => {
      const song = getSong(songId);
      return song ? `${song.artist} - ${song.title}` : "Unknown Song";
    });
    console.log(`Every day songs: ${songDetails.join(", ")}`);
  } else {
    console.log(`No song was listened to every day for User ${userId}.`);
  }

  // Find the top genres
  const topGenres = findTopGenres(userData);
  console.log(topGenres ? `${topGenres.label}: ${topGenres.genres.join(", ")}`: `No genres found for User ${userId}.`);

  // Prepare data to send to UI
  const results = {
    "Most listened song (count)": mostPlayedSong 
      ? `${getSong(mostPlayedSong.song_id).artist} - ${getSong(mostPlayedSong.song_id).title}` : "",
    "Most listened song (time)": mostPlayedSongTime.songKey ? `${mostPlayedSongTime.songKey}` : "",
    "Most listened artist (count)": mostPlayedArtist ? `${mostPlayedArtist.artist}` :  "",
    "Most listened artist (time)": mostPlayedArtistTime.artist ? `${mostPlayedArtistTime.artist}` : "",
    "Friday night song (count)": fridayNightSong
      ? `${getSong(fridayNightSong.song_id).artist} - ${getSong(fridayNightSong.song_id).title}` : "",
    "Friday night song (time)": fridayNightSongTime.songKey
      ? `${fridayNightSongTime.songKey}` : "",
    "Longest streak song": longestStreak
      ? `${getSong(longestStreak.song_id).artist} - ${getSong(longestStreak.song_id).title} (length:${longestStreak.streak})` : "",
    "Every day songs": everyDaySongs
      ? everyDaySongs.map(songId => `${getSong(songId).artist} - ${getSong(songId).title}`).join(", ") 
      : "", 
    [topGenres.label]: topGenres?.genres.join(", ") || "",
  };

  // Update UI
  updateResultsUI(userId, results);

}

// Run functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
  populateUserDropdown(); // Populate dropdown
  handleUserSelection(onUserSelected); // Handle selection
});
