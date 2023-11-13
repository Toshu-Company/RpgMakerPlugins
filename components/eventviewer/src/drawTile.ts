function drawTile(x: number, y: number, lower: boolean) {
  const tilemap = (SceneManager._scene as any)._spriteset._tilemap as Tilemap &
    any;

  const _tileWidth = tilemap.tileWidth;
  const _tileHeight = tilemap.tileHeight;

  var dx = (x * _tileWidth).mod(tilemap._layerWidth);
  var dy = (y * _tileHeight).mod(tilemap._layerHeight);
  var lx = dx / _tileWidth;
  var ly = dy / _tileHeight;

  const bitmap = lower ? tilemap._lowerBitmap : tilemap._upperBitmap;
  const context = bitmap.context as CanvasRenderingContext2D;

  context.fillStyle = "rgba(255, 0, 0, 0.5)";
  context.fillRect(dx, dy, _tileWidth, _tileHeight);
}
