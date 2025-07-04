(() => {
  // Get all script tags with data-widget-id
  const scripts = document.querySelectorAll("script[data-widget-id]");

  scripts.forEach((script) => {
    const widgetId = script.getAttribute("data-widget-id");
    const style = script.getAttribute("data-style") || "floating";
    const position = script.getAttribute("data-position") || "bottom-right";
    const text = script.getAttribute("data-text") || "Share Feedback";

    if (!widgetId) return;

    // Create iframe container
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
    `;

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = `http://localhost:3000/embed/popup/${widgetId}?style=${style}&position=${position}&text=${encodeURIComponent(
      text
    )}`;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
      pointer-events: auto;
    `;

    container.appendChild(iframe);
    document.body.appendChild(container);
  });
})();
