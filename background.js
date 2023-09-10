chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url && tab.url.startsWith("http")) {
    addUrlToStorage(tab.url);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && changeInfo.url && tab.url.startsWith("http")) {
    addUrlToStorage(tab.url);
  }
});

// Function to extract the domain from a URL
function extractDomain(url) {
  const match = url.match(/^(https?:\/\/(?:www\.)?[^\/]+)/);
  return match ? match[1] : null;
}

function addUrlToStorage(url) {
  const domain = extractDomain(url);

  chrome.storage.local.get({ urls: [] }, (result) => {
    const existingUrls = result.urls;

    // Check if the domain already exists in the stored URLs
    const index = existingUrls.findIndex((item) => item.url === domain);

    if (index === -1) {
      // Domain doesn't exist, add it to the list
      const updatedUrls = [
        ...existingUrls,
        { url: domain, timestamp: Date.now(), count: 0 },
      ];

      chrome.storage.local.set({ urls: updatedUrls }, () => {
        console.log("Domain saved in extension storage:", domain);
      });
    } else {
      // Domain already exists, update the count property
      existingUrls[index].count += 1;

      chrome.storage.local.set({ urls: existingUrls }, () => {
        console.log("Domain count updated in extension storage:", domain);
      });
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkVisited") {
    const urlToCheck = message.url;
    chrome.storage.local.get({ urls: [] }, (result) => {
      const visitedUrls = result.urls.map((entry) => entry.url);
      const visited = visitedUrls.includes(urlToCheck);
      sendResponse({ visited });
    });
  }
});
