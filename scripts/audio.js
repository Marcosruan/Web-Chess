export function playMoveSelfSound(){
    const moveSelfAudio = new Audio('../assets/audio/move-self.mp3');
    moveSelfAudio.currentTime = 0; 
    moveSelfAudio.play().catch(error => {
        console.log("The browser blocked the autoplay. The user needs to interact first. Error: ", error);
    });
}

export function playCaptureSound(){
    const captureAudio = new Audio('../assets/audio/capture.mp3');
    captureAudio.currentTime = 0; 
    captureAudio.play().catch(error => {
        console.log("The browser blocked the autoplay. The user needs to interact first. Error: ", error);
    });
}

export function playCastleSound(){
    const castleAudio = new Audio('../assets/audio/castle.mp3');
    castleAudio.currentTime = 0; 
    castleAudio.play().catch(error => {
        console.log("The browser blocked the autoplay. The user needs to interact first. Error: ", error);
    });
}

export function playGameEndSound(){
    const gameEndAudio = new Audio('../assets/audio/game-end.webm');
    gameEndAudio.currentTime = 0; 
    gameEndAudio.play().catch(error => {
        console.log("The browser blocked the autoplay. The user needs to interact first. Error: ", error);
    });
}

export function playIllegalSound(){
    const illegalAudio = new Audio('../assets/audio/illegal.mp3');
    illegalAudio.play().catch(error => {
        console.log("The browser blocked the autoplay. The user needs to interact first. Error: ", error);
    });
}

export function playCheckSound(){
    const CheckAudio = new Audio('../assets/audio/check.mp3');
    CheckAudio.currentTime = 0; 
    CheckAudio.play().catch(error => {
        console.log("The browser blocked the autoplay. The user needs to interact first. Error: ", error);
    });
}

export function playPromoteSound(){
    const promoteAudio = new Audio('../assets/audio/promote.mp3');
    promoteAudio.currentTime = 0; 
    promoteAudio.play().catch(error => {
        console.log("The browser blocked the autoplay. The user needs to interact first. Error: ", error);
    });
}