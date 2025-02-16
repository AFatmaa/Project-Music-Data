// Import the function from data.js
import { getUserIDs } from "../data.js";

// Function to fetch user IDs and populate the dropdown
export function populateUserDropdown() {
  const userDropdown = document.getElementById("user-dropdown");

  if (!userDropdown) {
    console.error("Dropdown element not found!");
    return;
  }

  // Fetch user IDs from data.js
  const userIds = getUserIDs();

  // Clear existing options (in case of re-rendering)
  userDropdown.innerHTML = "";

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select a user";
  defaultOption.value = "";
  userDropdown.appendChild(defaultOption);

  // Populate the dropdown with user options
  userIds.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userDropdown.appendChild(option);
  });

  console.log("User dropdown populated successfully!");
}

// Function to handle user selection
export function handleUserSelection(callback) {
  const userDropdown = document.getElementById("user-dropdown");

  if (!userDropdown) {
    console.error("Dropdown element not found!");
    return;
  }

  userDropdown.addEventListener("change", (event) => {
    const selectedUser = event.target.value;

    if (selectedUser) {
      console.log(`User ${selectedUser} selected!`);
      callback(selectedUser); // Call the callback function with the selected user
    }
  });
}
