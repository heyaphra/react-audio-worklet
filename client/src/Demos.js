  /* The function below creates an AudioWorkletNode, connects it to our AudioContext,
     connects an oscillator to it, and starts the oscillator */
export const Bypasser = (App) => {
    const { actx } = App;
    const bypasserNode = new AudioWorkletNode(actx, 'bypass-processor');
    const oscillator = actx.createOscillator();
    oscillator.connect(bypasserNode).connect(actx.destination);
    oscillator.start();
    return bypasserNode;
}
/* The example below initially demonstrated a one-off scheduled event. I've modified it to play
    based on the AudioContext's currentTime so that it can be replayed at the press of a button. 
    It creates a new AudioWorkletNode and a new oscillator, connects the new oscillator to the 
    node, starts the oscillator, schedules it's termination, and fiddles with the node's frequency
    parameter during playback. */
export const onePoleFilter = (App) => {
        const { actx } = App;
        const beginning = actx.currentTime;
        const middle = actx.currentTime + 4;
        const end = actx.currentTime + 8;
        const filterNode = new AudioWorkletNode(actx, 'one-pole-processor');
        const oscillator = actx.createOscillator();
        const frequencyParam = filterNode.parameters.get('frequency');
        frequencyParam
          .setValueAtTime(0.01, beginning)
          .exponentialRampToValueAtTime(actx.sampleRate * 0.5, middle)
          .exponentialRampToValueAtTime(0.01, end);
        oscillator.connect(filterNode).connect(actx.destination);
        oscillator.start();
        return filterNode;
}

export const noiseGenerator = (App) => {
    const { actx } = App;
    const modulator = new OscillatorNode(actx);
    const modGain = new GainNode(actx);
    const noiseGeneratorNode = new AudioWorkletNode(actx, 'noise-generator');
    const paramAmp = noiseGeneratorNode.parameters.get('amplitude');
    noiseGeneratorNode.connect(actx.destination);
    modulator.connect(modGain).connect(paramAmp);
    modulator.frequency.value = 0.5;
    modGain.gain.value = 0.75;
    modulator.start();
    return noiseGeneratorNode;
}
export const bitCrusher = (App) => {
    const { actx } = App;
    const oscillator = actx.createOscillator();
    const bitCrusherNode = new AudioWorkletNode(actx, 'bit-crusher-processor');
    const paramBitDepth = bitCrusherNode.parameters.get('bitDepth');
    const paramReduction = bitCrusherNode.parameters.get('frequencyReduction');
    const beginning = actx.currentTime;
    const middle = actx.currentTime + 4;
    const end = actx.currentTime + 8;
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 5000;
    oscillator.connect(bitCrusherNode).connect(actx.destination);
    oscillator.start();
    oscillator.stop(end);
    paramBitDepth.setValueAtTime(1, 0);
    paramReduction.setValueAtTime(0.01, beginning);
    paramReduction.linearRampToValueAtTime(0.1, middle);
    paramReduction.exponentialRampToValueAtTime(0.01, end);
    return bitCrusherNode;
}