import { GameWorld } from "./game";

// Client code
window.onload = () => {
    const game = new GameWorld("canvas");

    const startBtn = document.getElementById("start");
    const resetBtn = document.getElementById("reset");
    const stopBtn = document.getElementById("stop");

    const generation = document.getElementById("gen");
    
    // Listen to generation event from the object 
    game.addEventListener("gen", e => generation.innerHTML = e.detail);

    startBtn.addEventListener("click", () => game.start() )
    resetBtn.addEventListener("click", () => game.reset() )
    stopBtn.addEventListener("click", () => game.stop() )
}
