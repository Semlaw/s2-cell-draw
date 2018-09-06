# s2-cell-draw

> A library for Google s2 cell draw

## Install
```js
npm i s2-cell-draw
```

## Usage

- get s2-cell path from s2Key

```js
const { deboxByKey } = require('s2-cell-draw');
const s2CellPath = deboxByKey('1/2231210320031100');
console.log(s2CellPath);
```
- get s2-cell key list that covers the screen

```js
const { createPolygonListFromBounds } = require('s2-cell-draw');
/**
 * Point:[Lng:number,Lat:number];
 * bounds:[southwest:Point,northeast:Point]
 */
const s2KeyList = getPointListFromBounds({
  bounds: [[121.457655, 31.22533], [121.487632, 31.238082]],
  level: 16
});
console.log(s2KeyList);
```


- get s2-cell list that covers the screen

```js
const { createPolygonListFromBounds } = require('s2-cell-draw');
/**
 * Point:[Lng:number,Lat:number];
 * bounds:[southwest:Point,northeast:Point]
 */
const polygonList = createPolygonListFromBounds({
  bounds: [[121.457655, 31.22533], [121.487632, 31.238082]],
  level: 16
});
console.log(polygonList);
```
