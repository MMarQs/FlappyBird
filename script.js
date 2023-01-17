//Select Canvas
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

//Game variables and constants
let frames = 0;

//Load sprite sheet
const sprite_sheet = new Image();
sprite_sheet.src = "img/sprite_sheet.png"

//Background
const background = {
    sX : 0,
    sY : 392,
    sW : 552,
    sH : 408,

    draw : function() {
        ctx.drawImage(sprite_sheet, this.sX, this.sY, this.sW, this.sH, this.x, this.y, this.w, this.h);
    }
}

//Draw
function draw() {
    //Background color
    ctx.fillStyle = "#7BC5CD";
    ctx.fillRect(0, 0, cvs.width, cvs.height); 

    background.draw();
}

function adjustCanvas() {
    //Get canvas height and width
    cvs.height = window.innerHeight - 2;
    cvs.width = cvs.height / 1.388 - 2;
    //Get background measurements in cavnas
    background.x = 0;
    background.y = cvs.height - (cvs.width/1.35) / 1.5;
    background.w = cvs.width;
    background.h = background.w / 1.35;
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