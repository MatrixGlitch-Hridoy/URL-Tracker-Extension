/**
 * Function to extract the domain from a URL
 * @param {string} url
 * @returns {string | null}
 */
const extractDomain = (url) => {
  const match = url.match(/^(https?:\/\/(?:www\.)?[^\/]+)/);
  return match ? match[1] : null;
};

chrome.storage.local.get({ urls: [] }, (result) => {
  const currentUrl = extractDomain(window.location.href);
  const entry = result.urls.find((entry) => entry.url === currentUrl);

  if (entry && entry.count > 0) {
    const message = document.createElement("div");
    message.textContent = "This page is already visited";
    message.style.position = "fixed";
    message.style.top = "5%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.backgroundColor = "rgba(255, 155, 80,0.9)";
    message.style.color = "white";
    message.style.padding = "10px";
    message.style.zIndex = "9999";
    document.body.appendChild(message);
  }
});
