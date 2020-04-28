import { imageDimensions, imageTags } from '../data/index.mjs'

const getDistance = (h,v) => ((h**2+v**2)**(1/2));

const calcArcsin = (a1,a2) => Math.asin(Math.abs(a1)/getDistance(a1,a2));

const getAngle = (h,v) => {
  if(h>=0 && v>=0) return calcArcsin(h,v)
  if(h>=0 && v<0) return calcArcsin(v,h)+Math.PI/2
  if(h<0 && v<0) return calcArcsin(h,v)+Math.PI
  if(h<0 && v>=0) return calcArcsin(v,h)+3/2*Math.PI
};

const getSpecifity = (tags, distance) => {
  if (distance < imageDimensions.firstLevel) return tags.slice(0,1)
  if (distance < imageDimensions.secondLevel) return tags.slice(0,2)
  if (distance < imageDimensions.thirdLevel) return tags
  return []
}

export const getTags = (h,v) => {
  const numOfTag = Math.floor(getAngle(h,v)/(2*Math.PI/Object.keys(imageTags).length))
  return getSpecifity(imageTags[numOfTag], getDistance(h,v))
}