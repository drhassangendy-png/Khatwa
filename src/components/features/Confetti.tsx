import { useEffect, useState } from 'react';
interface Props { trigger:number }
export default function Confetti({trigger}:Props){const [active,setActive]=useState(false);useEffect(()=>{if(!trigger)return;setActive(true);const timer=setTimeout(()=>setActive(false),1900);return()=>clearTimeout(timer);},[trigger]);return active?<div aria-hidden="true" key={trigger}>{Array.from({length:28},(_,i)=><span key={i} className="confetti-piece" style={{left:`${12+(i*37%78)}%`,animationDelay:`${i%5*.06}s`,transform:`rotate(${i*23}deg)`}}/>)}</div>:null;}
