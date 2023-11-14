function createCanvas(id = "EventViewerCanvas") {
  const canvas = document.createElement("canvas");
  const width = SceneManager._screenWidth;
  const height = SceneManager._screenHeight;
  canvas.id = id;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  document.body.appendChild(canvas);
  const updateAllElements = Graphics._updateAllElements;
  Graphics._updateAllElements = () => {
    updateAllElements.call(Graphics);
    canvas.width = Graphics.width;
    canvas.height = Graphics.height;
    canvas.style.width = Graphics.width + "px";
    canvas.style.height = Graphics.height + "px";
  };
  return canvas;
}

function drawTile(x: number, y: number, canvas = "EventViewerCanvas") {
  const uppercanvas = document.getElementById(canvas) as HTMLCanvasElement;

  if (!uppercanvas) return console.error("Canvas not found");

  const dx = $gameMap.displayX();
  const dy = $gameMap.displayY();
  const tileWidth = $gameMap.tileWidth();
  const tileHeight = $gameMap.tileHeight();
  const tx = Math.floor((x - dx) * tileWidth);
  const ty = Math.floor((y - dy) * tileHeight);

  function fillRect2d(ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return;
    ctx.fillStyle = `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
    ctx.fillRect(tx, ty, tileWidth, tileHeight);
  }

  function fillRectWebGL(ctx: WebGLRenderingContext | null) {
    if (!ctx) return;
  }

  fillRect2d(uppercanvas.getContext("2d"));
  fillRectWebGL(uppercanvas.getContext("webgl"));
}

function mouseToPosition(mx: number, my: number) {
  const dx = $gameMap.displayX();
  const dy = $gameMap.displayY();
  const tileWidth = $gameMap.tileWidth();
  const tileHeight = $gameMap.tileHeight();
  const x = Math.floor(mx / tileWidth + dx);
  const y = Math.floor(my / tileHeight + dy);
  return { x, y };
}
