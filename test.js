const { deboxByKey, createPolygonListFromBounds, getPointListFromBounds } = require('./index');

const s2CellPath = deboxByKey('1/2231210320031100');
console.log(s2CellPath);

const s2KeyList = getPointListFromBounds({
  bounds: [[121.457655, 31.22533], [121.487632, 31.238082]],
  level: 16
});
console.log(s2KeyList);

/**
 * Point:[Lng:number,Lat:number];
 * Bounds:[southwest:Point,northeast:Point]
 */
const polygonList = createPolygonListFromBounds({
  bounds: [[121.457655, 31.22533], [121.487632, 31.238082]],
  level: 16
});
console.log(polygonList);
