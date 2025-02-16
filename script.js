import {
  populateUserDropdown,
  handleUserSelection,
} from "./modules/userSelection.js";
import { getListenEvents } from "./data.js";
import { findMostPlayedSong } from "./modules/dataProcessing.js";

// Function to handle user selection and fetch data
function onUserSelected(userId) {
  const userData = getListenEvents(userId);

  if (userData.length === 0) {
    console.log(`User ${userId} has no listening history.`);
  } else {
    console.log(`User ${userId} listening data:`, userData);

    // Find the most played song
    const mostPlayedSong = findMostPlayedSong(userData);

    if (mostPlayedSong) {
      console.log(`Most played song for User ${userId}:`, mostPlayedSong);
    } else {
      console.log(`No most played song found for User ${userId}.`);
    }
  }
}

// Run functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
  populateUserDropdown(); // Populate dropdown
  handleUserSelection(onUserSelected); // Handle selection
});
