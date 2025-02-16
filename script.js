import {
  populateUserDropdown,
  handleUserSelection,
} from "./modules/userSelection.js";
import { getListenEvents } from "./data.js";

// Function to handle user selection and fetch data
function onUserSelected(userId) {
  const userData = getListenEvents(userId);

  if (userData.length === 0) {
    console.log(`User ${userId} has no listening history.`);
  } else {
    console.log(`User ${userId} listening data:`, userData);
    // Here you will later call the UI rendering function
  }
}

// Run functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
  populateUserDropdown(); // Populate dropdown
  handleUserSelection(onUserSelected); // Handle selection
});
