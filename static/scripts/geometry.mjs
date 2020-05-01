import { dimensionsByLevel, imageTags } from '../data/index.mjs';

const quadrantOffsets = {
  '1': 0,
  '2': Math.PI/2,
  '3': Math.PI,
  '4': 3/2*Math.PI
};

const numOfTags = Object.keys(imageTags).length;

const isEven = n => n%2===0;

const getDistance = (horizontal,vertical) => Math.pow(Math.pow(horizontal,2)+Math.pow(vertical,2),1/2);

const calcArcsin = quadrant => (a1,a2) => Math.asin(Math.abs(isEven(quadrant) ? a2 : a1)/getDistance(a1,a2));

const isLevelDefined = (distance,idx) => distance>=dimensionsByLevel[idx] && distance<=dimensionsByLevel[3];

const getQuadrant = (horizontal,vertical) => {
  if(horizontal>=0 && vertical>=0) return 1;
  if(horizontal>=0 && vertical<0) return 2;
  if(horizontal<0 && vertical<0) return 3;
  if(horizontal<0 && vertical>=0) return 4;
};

const getAngle = (horizontal,vertical) => {
  const quadrantNumber = getQuadrant(horizontal,vertical);
  return calcArcsin(quadrantNumber)(horizontal,vertical) + quadrantOffsets[quadrantNumber];
};

export const getTags = (horizontal,vertical) => {
  const tagSlice = Math.floor(getAngle(horizontal,vertical)/(2*Math.PI/numOfTags));
  const distance = getDistance(horizontal,vertical);
  return imageTags[tagSlice].reduce((ac,emotion,idx) => {
    ac[`level${idx+1}`] = isLevelDefined(distance,idx) ? emotion : null;
    return ac;
  },{});
};