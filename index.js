const { S2 } = require('s2-geometry');

/**
 * A --- B
 * |     |
 * |  G  |
 * |     |
 * D --- C
 * G:center of gravity
 *
 */
function deboxByKey(s2Key) {
  const { lat, lng } = S2.keyToLatLng(s2Key);
  const level = s2Key.length - 2;
  const CPointNeighborsKey = S2.latLngToNeighborKeys(lat, lng, level);
  // [ keyLeft, keyDown, keyRight, keyUp ]
  const BPointLatLng = S2.keyToLatLng(CPointNeighborsKey[3]);
  const DPointLatLng = S2.keyToLatLng(CPointNeighborsKey[0]);
  const DPointNeighborsKey = S2.latLngToNeighborKeys(
    DPointLatLng.lat,
    DPointLatLng.lng,
    level
  );
  const APointLatLng = S2.keyToLatLng(DPointNeighborsKey[3]);
  const APoint = [APointLatLng.lng, APointLatLng.lat];
  const BPoint = [BPointLatLng.lng, BPointLatLng.lat];
  const CPoint = [lng, lat];
  const DPoint = [DPointLatLng.lng, DPointLatLng.lat];
  let lngSum = 0;
  let latSum = 0;
  [APoint, BPoint, CPoint, DPoint].forEach(([_lng, _lat]) => {
    lngSum += _lng;
    latSum += _lat;
  });
  const gravityCenter = [lngSum / 4, latSum / 4];
  const APointOffset = [
    gravityCenter[0] - APoint[0],
    gravityCenter[1] - APoint[1]
  ];
  const BPointOffset = [
    gravityCenter[0] - BPoint[0],
    gravityCenter[1] - BPoint[1]
  ];
  const CPointOffset = [
    gravityCenter[0] - CPoint[0],
    gravityCenter[1] - CPoint[1]
  ];
  const DPointOffset = [
    gravityCenter[0] - DPoint[0],
    gravityCenter[1] - DPoint[1]
  ];
  const northwest = [lng - APointOffset[0], lat - APointOffset[1]];
  const northeast = [lng - BPointOffset[0], lat - BPointOffset[1]];
  const southeast = [lng - CPointOffset[0], lat - CPointOffset[1]];
  const southwest = [lng - DPointOffset[0], lat - DPointOffset[1]];

  return {
    path: [northwest, northeast, southeast, southwest],
    center: [lng, lat],
    S2Key: s2Key
  };
}

/**
 * bounds: [[southwestLng = Number, southwestLat = Number],[northeastLng, northeastLat]]
 */
// get S2Cell list that covers the screen
// [_lng, _lat], bounds, level = 16
function getPointListFromBounds(option = {}) {
  const { bounds } = option;
  const level = option.level || 16;
  const _lng = (bounds[0][0] + bounds[1][0]) / 2;
  const _lat = (bounds[0][1] + bounds[1][1]) / 2;
  const splitCount = 2.5;
  const blurRatio = 0;
  const s2Key = S2.latLngToKey(_lat, _lng, level);
  const { lng, lat } = S2.keyToLatLng(s2Key);
  const neighborsKey = S2.latLngToNeighborKeys(lat, lng, level);
  const rightLng = Math.max(S2.keyToLatLng(neighborsKey[2]).lng, S2.keyToLatLng(neighborsKey[3]).lng);
  const topLat = Math.max(S2.keyToLatLng(neighborsKey[2]).lat, S2.keyToLatLng(neighborsKey[3]).lat);
  const unitLng = rightLng - lng;
  const unitLat = topLat - lat;
  const startLng = Math.min(bounds[0][0], bounds[1][0]) - unitLng * blurRatio;
  const endLng = Math.max(bounds[0][0], bounds[1][0]) + unitLng * blurRatio;
  const startLat = Math.min(bounds[0][1], bounds[1][1]) - unitLat * blurRatio;
  const endLat = Math.max(bounds[0][1], bounds[1][1]) + unitLat * blurRatio;
  const stepLng = Math.abs(unitLng) / splitCount;
  const stepLat = Math.abs(unitLat) / splitCount;
  const pointList = [];
  for (let lngNum = startLng; lngNum < endLng; lngNum += stepLng) {
    for (let latNum = startLat; latNum < endLat; latNum += stepLat) {
      pointList.push([lngNum, latNum]);
    }
  }
  const mapObj = pointList.reduce((obj, [lng, lat]) => {
    obj[S2.latLngToKey(lat, lng, level)] = true;
    return obj;
  }, {});
  const ret = Object.keys(mapObj).map(key => {
    const latLng = S2.keyToLatLng(key);
    return {
      S2Key: key,
      lngLat: [latLng.lng, latLng.lat]
    };
  });
  return ret;
}

/**
 * A --- B
 * |     |
 * |  G  |
 * |     |
 * D --- C
 * G:center of gravity
 * return [GA,GB,GC,GD]
 *
 */
function getPolygonOffsetFromPoint(option = {}) {
  // [_lng, _lat], level = 16
  const [_lng, _lat] = option.point;
  const level = option.level || 16;
  // const key = S2.latLngToKey(lat, lng, level);
  const s2Key = S2.latLngToKey(_lat, _lng, level);
  const { lng, lat } = S2.keyToLatLng(s2Key);
  const CPointNeighborsKey = S2.latLngToNeighborKeys(lat, lng, level);
  // [ keyLeft, keyDown, keyRight, keyUp ]
  const BPointLatLng = S2.keyToLatLng(CPointNeighborsKey[3]);
  const DPointLatLng = S2.keyToLatLng(CPointNeighborsKey[0]);
  const DPointNeighborsKey = S2.latLngToNeighborKeys(
    DPointLatLng.lat,
    DPointLatLng.lng,
    level
  );
  const APointLatLng = S2.keyToLatLng(DPointNeighborsKey[3]);
  const APoint = [APointLatLng.lng, APointLatLng.lat];
  const BPoint = [BPointLatLng.lng, BPointLatLng.lat];
  const CPoint = [lng, lat];
  const DPoint = [DPointLatLng.lng, DPointLatLng.lat];
  let lngSum = 0;
  let latSum = 0;
  [APoint, BPoint, CPoint, DPoint].forEach(([_lng, _lat]) => {
    lngSum += _lng;
    latSum += _lat;
  });
  const gravityCenter = [lngSum / 4, latSum / 4];
  const APointOffset = [
    gravityCenter[0] - APoint[0],
    gravityCenter[1] - APoint[1]
  ];
  const BPointOffset = [
    gravityCenter[0] - BPoint[0],
    gravityCenter[1] - BPoint[1]
  ];
  const CPointOffset = [
    gravityCenter[0] - CPoint[0],
    gravityCenter[1] - CPoint[1]
  ];
  const DPointOffset = [
    gravityCenter[0] - DPoint[0],
    gravityCenter[1] - DPoint[1]
  ];
  const ret = [APointOffset, BPointOffset, CPointOffset, DPointOffset];
  return ret;
}

function polygonFromPoint(point, polygonOffset) {
  // point {lngLat:[lng,lat],S2Key}
  const [lng, lat] = point.lngLat;
  const APoint = [lng - polygonOffset[0][0], lat - polygonOffset[0][1]];
  const BPoint = [lng - polygonOffset[1][0], lat - polygonOffset[1][1]];
  const CPoint = [lng - polygonOffset[2][0], lat - polygonOffset[2][1]];
  const DPoint = [lng - polygonOffset[3][0], lat - polygonOffset[3][1]];

  return {
    path: [APoint, BPoint, CPoint, DPoint],
    center: [lng, lat],
    S2Key: point.S2Key
  };
}

function createPolygonListFromBounds(option = {}) {
  //[lng, lat], bounds, level = 16, zoom
  const { bounds } = option;
  const level = option.level || 16;
  const lng = (bounds[0][0] + bounds[1][0]) / 2;
  const lat = (bounds[0][1] + bounds[1][1]) / 2;
  const targetPointList = getPointListFromBounds({ bounds, level });
  const fourtPointOffset = getPolygonOffsetFromPoint({
    point: [lng, lat],
    level
  });

  const polygonList = targetPointList.reduce((arr, s2Point) => {
    arr.push(polygonFromPoint(s2Point, fourtPointOffset));
    return arr;
  }, []);
  return polygonList;
}

module.exports = {
  deboxByKey,
  getPointListFromBounds,
  getPolygonOffsetFromPoint,
  createPolygonListFromBounds
};
