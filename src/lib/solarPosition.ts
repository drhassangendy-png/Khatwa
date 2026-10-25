// Meeus solar coordinates and equation of time, as used by NOAA's solar calculator.
// All angles are in degrees; equation of time is in minutes.
export interface SolarPosition { declination:number; equationOfTime:number }
export const radians=(degrees:number)=>degrees*Math.PI/180;
export const degrees=(radiansValue:number)=>radiansValue*180/Math.PI;
const sin=(angle:number)=>Math.sin(radians(angle));
const cos=(angle:number)=>Math.cos(radians(angle));
export function solarPosition(timestamp:number):SolarPosition {
 const julianDay=timestamp/86400000+2440587.5;
 const t=(julianDay-2451545)/36525;
 const longitude=((280.46646+t*(36000.76983+t*0.0003032))%360+360)%360;
 const anomaly=357.52911+t*(35999.05029-0.0001537*t);
 const eccentricity=0.016708634-t*(0.000042037+0.0000001267*t);
 const center=sin(anomaly)*(1.914602-t*(0.004817+0.000014*t))
  +sin(2*anomaly)*(0.019993-0.000101*t)+sin(3*anomaly)*0.000289;
 const omega=125.04-1934.136*t;
 const apparentLongitude=longitude+center-0.00569-0.00478*sin(omega);
 const meanObliquity=23+(26+(21.448-t*(46.815+t*(0.00059-0.001813*t)))/60)/60;
 const obliquity=meanObliquity+0.00256*cos(omega);
 const declination=degrees(Math.asin(sin(obliquity)*sin(apparentLongitude)));
 const y=Math.tan(radians(obliquity/2))**2;
 const equationOfTime=4*degrees(y*sin(2*longitude)-2*eccentricity*sin(anomaly)
  +4*eccentricity*y*sin(anomaly)*cos(2*longitude)
  -0.5*y*y*sin(4*longitude)-1.25*eccentricity*eccentricity*sin(2*anomaly));
 return {declination,equationOfTime};
}
