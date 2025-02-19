// uiRendering.js
export function updateResultsUI(results) {
  const userDataDiv = document.getElementById("user-data");

  if (!userDataDiv) {
    console.error("User data container not found!");
    return;
  }

  // Clear previous content
  userDataDiv.innerHTML = "";

  // If no valid results exist, display a message and return
  if (Object.values(results).every((value) => value === "")) {
    userDataDiv.innerHTML = `<p>This user didn't listen to any songs.</p>`;
    return;
  }

  // Create a table
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  // Create table headers
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  ["Question", "Answer"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    th.style.border = "1px solid black";
    th.style.padding = "8px";
    th.style.textAlign = "left";
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  // Populate only non-empty results
  Object.entries(results).forEach(([question, answer]) => {
    if (answer) {  // Only add rows where the answer is NOT empty
      const row = document.createElement("tr");

      const questionCell = document.createElement("td");
      questionCell.textContent = question;
      questionCell.style.border = "1px solid black";
      questionCell.style.padding = "8px";

      const answerCell = document.createElement("td");
      answerCell.textContent = answer;
      answerCell.style.border = "1px solid black";
      answerCell.style.padding = "8px";

      row.appendChild(questionCell);
      row.appendChild(answerCell);
      tbody.appendChild(row);
    }
  });

  table.appendChild(tbody);
  userDataDiv.appendChild(table);
}
