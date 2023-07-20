// create web audio api context   
const audioCtx = new window.AudioContext();
 
const masterGain = audioCtx.createGain();

// target
const t_osc = audioCtx.createOscillator();
t_osc.frequency.value = 200;

t_osc.connect(masterGain);
t_osc.start();

// create Oscillator and gain node
const oscillator = audioCtx.createOscillator();
const gainNode = audioCtx.createGain();
const LFO = audioCtx.createOscillator();
LFO.type = "triangle";

gainNode.gain.value = 0.5;
 
// connect oscillator to gain node to speakers
oscillator.connect(gainNode);
gainNode.connect(masterGain);
masterGain.connect(audioCtx.destination);
// connect lfo to oscillator AM
// LFO.connect(gainNode.gain);
// LFO.frequency.value = 0.5;

oscillator.frequency.value = 440;

const freqMin = 60
const freqMax =  1000;

const lfoFreqMax = 8;
const lfoFreqMin = 0;

oscillator.start(0);
// LFO.start(0);

function debounce(func: CallableFunction, timeout = 10){
  let timer: undefined | number = undefined;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func(args) }, timeout);
  };
}

function normInRange(min: number, max: number, norm: number) {
  return (norm * (max - min)) + min
}

window.onmousemove = debounce((e: MouseEvent[]) => {
  const {x, y} = e[0];
  const normX = x / window.innerWidth;
  const normY = y / window.innerHeight;

  oscillator.frequency.value = normInRange(freqMin, freqMax, normY);  
  LFO.frequency.value = normInRange(lfoFreqMin, lfoFreqMax, normX);
} )

function init() {
  let init = false;
  let playing = false;
   
   window.onclick = () => {    
    console.log('click', init, playing);
    if(!init) {                  
      audioCtx.resume();
      masterGain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 1);
      playing = true;
      init = true;
    } else {            
      if(playing) {
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        playing = false;
      } else {
        masterGain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 1);
        playing = true;
      }      
    }
    
   }

}

init();