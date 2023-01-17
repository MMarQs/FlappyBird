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

//Foreground
const foreground = {
    sX : 552,
    sY : 576,
    sW : 448,
    sH : 224,

    draw : function() {
        ctx.drawImage(sprite_sheet, this.sX, this.sY, this.sW, this.sH, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite_sheet, this.sX, this.sY, this.sW, this.sH, (this.x + this.w), this.y, this.w, this.h);
    },
}

//Draw
function draw() {
    //Background color
    ctx.fillStyle = "#7BC5CD";
    ctx.fillRect(0, 0, cvs.width, cvs.height); 

    background.draw();
    foreground.draw();
}

function adjustCanvas() {
    //Get canvas height and width
    cvs.height = window.innerHeight - 2;
    cvs.width  = cvs.height * 0.72 - 2;

    //Get background measurements for canvas
    background.x = 0;
    background.y = cvs.height * 0.631;
    background.w = cvs.width;
    background.h = background.w * 0.74;

    //Get foreground measurements for canvas
    foreground.x = 0;
    foreground.y = cvs.height * 0.861;
    foreground.w = cvs.width * 0.7;
    foreground.h = foreground.w * 0.46;
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