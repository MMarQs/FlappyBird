//Select Canvas
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

//Game variables and constants
let frames = 0;

//Draw
function draw() {
    ctx.fillStyle = "#7BC5CD";
    ctx.fillRect(0, 0, cvs.width, cvs.height); 
}

function adjustCanvas() {
    //Get canvas height and width
    cvs.height = window.innerHeight - 2;
    cvs.width = cvs.height / 1.388;
}

//When window loads or resize
window.addEventListener("load", () => {
    adjustCanvas();
    window.addEventListener("resize", adjustCanvas);
});

//Update 
function update() {

}

//Loop
function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();