chrome.storage.local.get({ urls: [] }, (result) => {
  const urlTableBody = document.getElementById("urlTableBody");

  // Function to remove a URL entry
  const removeUrl = (url) => {
    const updatedUrls = result.urls.filter((entry) => entry.url !== url);
    chrome.storage.local.set({ urls: updatedUrls }, () => {
      // Refresh the current tab to reflect the updated data
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
      window.close();
    });
  };

  // Display the list of visited URLs with remove buttons and timestamps
  result.urls.forEach((entry) => {
    // Create a new row for each entry
    const row = document.createElement("tr");
    // URL cell
    const urlCell = document.createElement("td");
    const a = document.createElement("a");
    a.href = entry.url;
    a.textContent = entry.url;
    a.target = "_blank";
    urlCell.appendChild(a);
    row.appendChild(urlCell);

    // Timestamp cell
    const timestampCell = document.createElement("td");
    const timestamp = new Date(entry.timestamp).toLocaleString();
    timestampCell.textContent = timestamp;
    row.appendChild(timestampCell);

    // Action cell
    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeUrl(entry.url);
    });
    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);

    // Add the row to the table body
    urlTableBody.appendChild(row);
  });
});
