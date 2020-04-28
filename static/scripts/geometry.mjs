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

export const getTags = (horizontal,vertical) => {
  const tagSlice = Math.floor(getAngle(horizontal,vertical)/(2*Math.PI/numOfTags))
  const distance = getDistance(horizontal,vertical)
  const tags = imageTags[tagSlice].reduce((ac,emotion,idx) => {
    ac[`level${idx+1}`] = distance>=imageDimensions[`${idx}level`] && distance<=imageDimensions[`3level`] ? emotion : null
    return ac
  },{})
  return tags
}