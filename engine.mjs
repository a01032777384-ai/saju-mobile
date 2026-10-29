import {KoreanLunarCalendar} from './vendor/korean-lunar-calendar.mjs';
export const STEMS='甲乙丙丁戊己庚辛壬癸', BRANCHES='子丑寅卯辰巳午未申酉戌亥';
export const READINGS=Object.fromEntries([...STEMS,...BRANCHES].map((x,i)=>[x,['갑','을','병','정','무','기','경','신','임','계','자','축','인','묘','진','사','오','미','신','유','술','해'][i]]));
export const ELEMENTS=Object.fromEntries([...STEMS,...BRANCHES].map((x,i)=>[x,['목','목','화','화','토','토','금','금','수','수','수','토','목','목','토','화','화','토','금','금','토','수'][i]]));
export function calculate(input, Solar=globalThis.Solar) {
 const {year:y,month:m,day:d,calendar='solar',leap=false,unknown=false,hour=0,minute=0}=input;
 if(![y,m,d].every(Number.isInteger)||!['solar','lunar'].includes(calendar)) throw Error('생년월일을 숫자로 정확히 입력해 주세요.');
 if(!unknown&&(!Number.isInteger(hour)||!Number.isInteger(minute)||hour<0||hour>23||minute<0||minute>59))throw Error('출생 시각은 00:00~23:59 범위로 입력해 주세요.');
 const c=new KoreanLunarCalendar();
 const ok=calendar==='lunar'?c.setLunarDate(y,m,d,leap):c.setSolarDate(y,m,d);
 if(!ok)throw Error('존재하지 않는 날짜 또는 윤달입니다. 음력은 실제 윤달 여부를 확인해 주세요.');
 const s=c.getSolarCalendar(), l=c.getLunarCalendar();
 if(s.year<1900||s.year>2050)throw Error('지원 범위는 양력 환산 1900-01-01~2050-12-31입니다.');
 const at=(h,mi,sec=0)=>{const kst=Date.UTC(s.year,s.month-1,s.day,h,mi,sec);const bj=new Date(kst-3600000);const lunar=Solar.fromYmdHms(bj.getUTCFullYear(),bj.getUTCMonth()+1,bj.getUTCDate(),bj.getUTCHours(),bj.getUTCMinutes(),bj.getUTCSeconds()).getLunar();return [lunar.getYearInGanZhiExact(),lunar.getMonthInGanZhiExact()];};
 let ym=at(unknown?0:hour,unknown?0:minute), notes=[];
 if(unknown){const end=at(23,59,59);ym=ym.map((v,i)=>{if(v!==end[i]){notes.push(`${i?'월주':'연주'}는 절기 전후로 달라져 출생 시각 없이는 확정할 수 없습니다.`);return null;}return v;});}
 const day=Solar.fromYmdHms(s.year,s.month,s.day,12,0,0).getLunar().getDayInGanZhiExact2();
 const bi=Math.floor((hour+1)/2)%12;
 const time=unknown?null:STEMS[(STEMS.indexOf(day[0])%5*2+bi)%10]+BRANCHES[bi];
 const pillars=[...ym,day,time];const counts={목:0,화:0,토:0,금:0,수:0};pillars.filter(Boolean).forEach(p=>[...p].forEach(ch=>counts[ELEMENTS[ch]]++));
 return {solar:s,lunar:l,pillars,counts,total:Object.values(counts).reduce((a,b)=>a+b,0),notes};
}
