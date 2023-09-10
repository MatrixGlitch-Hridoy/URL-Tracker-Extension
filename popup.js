// chrome.storage.local.get({ urls: [] }, (result) => {
//   const urlList = document.getElementById("urlList");

//   console.log("result", result);
//   // Display the list of visited URLs
//   result.urls.map((entry) => {
//     const li = document.createElement("li");
//     const a = document.createElement("a");
//     a.href = entry.url;
//     a.textContent = entry.url;
//     a.target = "_blank";
//     const timestamp = new Date(entry.timestamp).toLocaleString();
//     const timestampSpan = document.createElement("span");
//     timestampSpan.textContent = timestamp;
//     timestampSpan.classList.add("timestamp");
//     li.appendChild(a);
//     li.appendChild(timestampSpan);
//     urlList.appendChild(li);
//   });
// });

chrome.storage.local.get({ urls: [] }, (result) => {
  const urlList = document.getElementById("urlList");

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

  // Display the list of visited URLs with remove buttons
  result.urls.forEach((entry) => {
    const li = document.createElement("li");
    li.setAttribute("data-url", entry.url); // Add data attribute for identification

    const a = document.createElement("a");
    a.href = entry.url;
    a.textContent = entry.url;
    a.target = "_blank";

    const timestamp = new Date(entry.timestamp).toLocaleString();
    const timestampSpan = document.createElement("span");
    timestampSpan.textContent = timestamp;
    timestampSpan.classList.add("timestamp");

    // Create a remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeUrl(entry.url);
    });

    li.appendChild(a);
    li.appendChild(timestampSpan);
    li.appendChild(removeButton);
    urlList.appendChild(li);
  });
});
