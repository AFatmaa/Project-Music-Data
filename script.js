import {populateUserDropdown, handleUserSelection,} from "./modules/userSelection.js";
import { getListenEvents, getSong } from "./data.js";
import {
  findMostPlayedSong, 
  findMostPlayedSongTime,
  findMostPlayedArtist, 
  findMostPlayedArtistTime,
  findFridayNightSong, 
  findFridayNightSongTime,
  findLongestStreakSong, 
  findEveryDaySongs, 
  findTopGenres, 
} from "./modules/dataProcessing.js";
import { updateResultsUI } from "./modules/uiRendering.js";

// Function to handle user selection and fetch data
function onUserSelected(userId) {
  const userData = getListenEvents(userId);

  // Clear UI if the selected user has no data to prevent showing previous user's results
  if (!userData || userData.length === 0) {
    updateResultsUI({}); // Pass empty object to trigger "no data" message
    return;
  }

  const mostPlayedSong = findMostPlayedSong(userData);
  const listeningTimeData = findMostPlayedSongTime(userData);
  const mostPlayedSongTime = Object.entries(listeningTimeData)
    .reduce((max, [songKey, time]) => (time > max.time ? { songKey, time } : max), 
    { songKey: null, time: 0 });
  const mostPlayedArtist = findMostPlayedArtist(userData);
  const listeningTimeByArtist = findMostPlayedArtistTime(userData);
  const mostPlayedArtistTime = Object.entries(listeningTimeByArtist)
    .reduce((max, [artist, time]) => (time > max.time ? { artist, time } : max),
    { artist: null, time: 0 });
  const fridayNightSong = findFridayNightSong(userData);
  const fridayNightTimeData = findFridayNightSongTime(userData);
  const fridayNightSongTime = Object.entries(fridayNightTimeData)
    .reduce((max, [songKey, time]) => (time > max.time ? { songKey, time } : max),
    { songKey: null, time: 0 });
  const longestStreakSong = findLongestStreakSong(userData);
  const everyDaySongs = findEveryDaySongs(userData);
  const topGenres = findTopGenres(userData);

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
    "Longest streak song": longestStreakSong
      ? `${getSong(longestStreakSong.song_id).artist} - ${getSong(longestStreakSong.song_id).title} (length:${longestStreakSong.streak})` : "",
    "Every day songs": everyDaySongs
      ? everyDaySongs.map(songId => `${getSong(songId).artist} - ${getSong(songId).title}`).join(", ") 
      : "", 
    [topGenres.label]: topGenres?.genres.join(", ") || "",
  };

  // Update UI
  updateResultsUI(results);

}

// Run functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
  populateUserDropdown(); // Populate dropdown
  handleUserSelection(onUserSelected); // Handle selection
});
