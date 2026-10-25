let context:AudioContext|null=null;
// Browser autoplay rules require this to be called from a click before timed chimes.
export async function unlockAudio(){
 if(!('AudioContext' in window))return false;
 context??=new AudioContext();
 await context.resume();return context.state==='running';
}
export function playChime(){
 if(!context||context.state!=='running')return false;
 const now=context.currentTime;
 [523.25,659.25,783.99].forEach((frequency,index)=>{
  const oscillator=context!.createOscillator(),gain=context!.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;
  gain.gain.setValueAtTime(0,now+index*.14);gain.gain.linearRampToValueAtTime(.1,now+index*.14+.03);gain.gain.exponentialRampToValueAtTime(.001,now+index*.14+.6);
  oscillator.connect(gain);gain.connect(context!.destination);oscillator.start(now+index*.14);oscillator.stop(now+index*.14+.65);
 });return true;
}
