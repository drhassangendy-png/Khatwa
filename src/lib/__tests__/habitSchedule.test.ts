import { describe, expect, it } from 'vitest';
import { matchesSchedule, nextScheduledDate, countScheduledDates, endDateForTarget, hijriDay } from '@/lib/habitSchedule';
describe('schedule-aware due dates',()=>{
 it('keeps Monday / Thursday fasting unchanged',()=>{expect(matchesSchedule('2026-10-26','fasting-mon-thu')).toBe(true);expect(matchesSchedule('2026-10-27','fasting-mon-thu')).toBe(false);expect(nextScheduledDate('2026-10-27','fasting-mon-thu')).toBe('2026-10-29');});
 it('supports any selected weekdays',()=>{expect(matchesSchedule('2026-10-26','weekdays',0,[6,1,3])).toBe(true);expect(matchesSchedule('2026-10-27','weekdays',0,[6,1,3])).toBe(false);});
 it('handles a specific monthly date',()=>{expect(matchesSchedule('2026-11-15','monthly',0,[],15)).toBe(true);expect(nextScheduledDate('2026-11-16','monthly',0,undefined,[],15)).toBe('2026-12-15');});
 it('does not invent day 31 in February',()=>{expect(nextScheduledDate('2026-02-01','monthly',0,undefined,[],31)).toBe('2026-03-31');});
 it('handles last days and leap years',()=>{expect(matchesSchedule('2028-02-29','monthly',0,[],0)).toBe(true);expect(matchesSchedule('2026-02-28','monthly',0,[],0)).toBe(true);expect(matchesSchedule('2026-02-27','monthly',0,[],0)).toBe(false);});
 it('aligns monthly targets and end dates',()=>{expect(endDateForTarget('2026-01-01',3,'monthly',0,[],15)).toBe('2026-03-15');expect(countScheduledDates('2026-01-01','2026-03-15','monthly',0,Infinity,[],15)).toBe(3);});
 it('preserves Umm al-Qura white days with adjustment',()=>{for(let day=1;day<=28;day++){const key=`2026-10-${String(day).padStart(2,'0')}`;const hijri=hijriDay(key,1);expect(matchesSchedule(key,'fasting-white',1)).toBe(hijri>=13&&hijri<=15);}});
 it('prayer and azkar presets remain daily',()=>{expect(matchesSchedule('2026-10-27','night-prayer')).toBe(true);expect(matchesSchedule('2026-10-27','morning-azkar')).toBe(true);expect(matchesSchedule('2026-10-27','evening-azkar')).toBe(true);});
});
