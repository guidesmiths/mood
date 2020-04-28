import { imageDimensions, imageTags } from '../data/index.mjs'

const numOfTags = Object.keys(imageTags).length;

const getDistance = (horizontal,vertical) => ((horizontal**2+vertical**2)**(1/2));

const calcArcsin = (a1,a2) => Math.asin(Math.abs(a1)/getDistance(a1,a2));

const getAngle = (horizontal,vertical) => {
  if(horizontal>=0 && vertical>=0) return calcArcsin(horizontal,vertical)
  if(horizontal>=0 && vertical<0) return calcArcsin(vertical,horizontal)+Math.PI/2
  if(horizontal<0 && vertical<0) return calcArcsin(horizontal,vertical)+Math.PI
  if(horizontal<0 && vertical>=0) return calcArcsin(vertical,horizontal)+3/2*Math.PI
};

const getSpecificity = (tags, distance) => {
  if (distance < imageDimensions.firstLevel) return tags.slice(0,1)
  if (distance < imageDimensions.secondLevel) return tags.slice(0,2)
  if (distance < imageDimensions.thirdLevel) return tags
  return []
}

export const getTags = (horizontal,vertical) => {
  const tagSlice = Math.floor(getAngle(horizontal,vertical)/(2*Math.PI/numOfTags))
  return getSpecificity(imageTags[tagSlice], getDistance(horizontal,vertical))
}