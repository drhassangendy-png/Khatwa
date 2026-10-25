import { describe, expect, it } from 'vitest';
import { calculatePrayers, PRAYERS } from '@/lib/prayerTimes';
import type { PrayerLocation } from '@/types';
const CAIRO:PrayerLocation={latitude:30.0444,longitude:31.2357,timezone:'Africa/Cairo'};
// Egyptian-method reference UTC times retrieved on 2026-10-25 from the
// Aladhan timings API (method=5, school=0); fixtures only, no network at runtime.
const FIXTURES=[
 {key:'2026-01-15',minutes:[201,605,777,917,999]},
 {key:'2026-10-25',minutes:[156,580,771,914,992]},
];
describe('dependency-free Egyptian prayer calculations',()=>{
 it.each(FIXTURES)('matches reference times within four minutes on $key',({key,minutes})=>{
  const results=calculatePrayers(key,CAIRO);
  expect(results.map(item=>item.prayer)).toEqual(PRAYERS);
  results.forEach((item,index)=>{
   const actual=(item.date.getTime()-Date.parse(`${key}T00:00:00Z`))/60000;
   expect(Math.abs(actual-minutes[index])).toBeLessThanOrEqual(4);
  });
 });
 it('returns five ordered finite times at ordinary latitudes',()=>{
  const times=calculatePrayers('2026-06-21',CAIRO).map(item=>item.date.getTime());
  expect(times).toHaveLength(5);
  times.forEach((value,index)=>{expect(Number.isFinite(value)).toBe(true);if(index)expect(value).toBeGreaterThan(times[index-1]);});
 });
 it('does not assume the device time zone matches the saved location',()=>{
  const original=calculatePrayers('2026-01-15',CAIRO);
  const differentZone=calculatePrayers('2026-01-15',{...CAIRO,timezone:'America/New_York'});
  expect(differentZone).toEqual(original);
 });
 it('retains the correct UTC date for eastern locations',()=>{
  const tokyo={latitude:35.6762,longitude:139.6503,timezone:'Asia/Tokyo'};
  expect(calculatePrayers('2026-01-15',tokyo)[0].date.toISOString().slice(0,10)).toBe('2026-01-14');
 });
 it('returns no times for missing locations or invalid input',()=>{
  expect(calculatePrayers('2026-01-15',null)).toEqual([]);
  expect(calculatePrayers('2026-02-30',CAIRO)).toEqual([]);
  expect(calculatePrayers('invalid',CAIRO)).toEqual([]);
  expect(calculatePrayers('2026-01-15',{...CAIRO,latitude:91})).toEqual([]);
  expect(calculatePrayers('2026-01-15',{...CAIRO,longitude:NaN})).toEqual([]);
 });
 it('keeps high-latitude twilight finite when a night exists',()=>{
  const london={latitude:51.5074,longitude:-0.1278,timezone:'Europe/London'};
  const times=calculatePrayers('2026-06-21',london);
  expect(times).toHaveLength(5);
  expect(times.every(item=>Number.isFinite(item.date.getTime()))).toBe(true);
 });
 it('does not invent sunrise or sunset during polar day',()=>{
  const polar={latitude:89,longitude:0,timezone:'UTC'};
  const times=calculatePrayers('2026-06-21',polar);
  expect(times.some(item=>item.prayer==='maghrib')).toBe(false);
  expect(times.every(item=>Number.isFinite(item.date.getTime()))).toBe(true);
 });
});
