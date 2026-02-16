if (!window.__FPS_EXTENSION_RUNNING__) {
  window.__FPS_EXTENSION_RUNNING__ = true;

  const fpsDisplay = document.createElement("div");
  fpsDisplay.id = "__fps_overlay__";
  fpsDisplay.textContent = "FPS: 0";
  document.body.appendChild(fpsDisplay);

  // Restore saved position
  const savedPosition = JSON.parse(localStorage.getItem("__fps_position__"));
  if (savedPosition) {
    fpsDisplay.style.left = savedPosition.left + "px";
    fpsDisplay.style.top = savedPosition.top + "px";
    fpsDisplay.style.right = "auto";
  }

  // ===== FPS LOGIC =====
  let lastTime = performance.now();
  let frames = 0;

  function loop(now) {
    frames++;

    if (now >= lastTime + 1000) {
      fpsDisplay.textContent = `FPS: ${frames}`;
      frames = 0;
      lastTime = now;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // ===== DRAG LOGIC =====
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  fpsDisplay.addEventListener("mousedown", (e) => {
    isDragging = true;

    const rect = fpsDisplay.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    fpsDisplay.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const left = e.clientX - offsetX;
    const top = e.clientY - offsetY;

    fpsDisplay.style.left = left + "px";
    fpsDisplay.style.top = top + "px";
    fpsDisplay.style.right = "auto";
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    fpsDisplay.style.cursor = "grab";

    // Save position
    const rect = fpsDisplay.getBoundingClientRect();
    localStorage.setItem(
      "__fps_position__",
      JSON.stringify({
        left: rect.left,
        top: rect.top
      })
    );
  });
}
