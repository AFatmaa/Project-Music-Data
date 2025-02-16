import {
  populateUserDropdown,
  handleUserSelection,
} from "./modules/userSelection.js";
import { getListenEvents } from "./data.js";
import {
  findMostPlayedSong,
  findMostPlayedArtist,
  calculateListeningTime,
  findFridayNightSongs,
  findLongestStreakSong,
} from "./modules/dataProcessing.js";

// Function to handle user selection and fetch data
function onUserSelected(userId) {
  const userData = getListenEvents(userId);

  if (userData.length === 0) {
    console.log(`User ${userId} has no listening history.`);
  } else {
    console.log(`User ${userId} listening data:`, userData);

    // Find the most played song
    const mostPlayedSong = findMostPlayedSong(userData);
    console.log(
      mostPlayedSong
        ? `Most played song: ${mostPlayedSong.song_id} (${mostPlayedSong.count} times)`
        : "No most played song found."
    );

    // Find the most played artist
    const mostPlayedArtist = findMostPlayedArtist(userData);
    console.log(
      mostPlayedArtist
        ? `Most played artist: ${mostPlayedArtist.artist} (${mostPlayedArtist.count} times)`
        : "No most played artist found."
    );

    // Calculate total listening time
    const listeningTime = calculateListeningTime(userData);
    console.log("Total listening time per song:", listeningTime);

    // Find most played song on Friday nights
    const fridayNightSong = findFridayNightSongs(userData);
    console.log(
      fridayNightSong
        ? `Most played song on Friday night: ${fridayNightSong.song_id} (${fridayNightSong.count} times)`
        : "No songs were played on Friday night."
    );

    // Find the longest streak song
    const longestStreak = findLongestStreakSong(userData);
    console.log(
      longestStreak
        ? `Longest streak song: ${longestStreak.song_id} (${longestStreak.streak} times in a row)`
        : "No streak song found."
    );
  }
}

// Run functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
  populateUserDropdown(); // Populate dropdown
  handleUserSelection(onUserSelected); // Handle selection
});
