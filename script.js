//SELECT CANVAS
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

//GAME VARIABLES AND CONSTANTS
let frames = 0;

//LOAD SPRITE SHEET
const sprite_sheet = new Image();
sprite_sheet.src = "img/sprite_sheet.png"

//BACKGROUND
const background = 
{
    spriteX : 0,
    spriteY : 392,
    spriteW : 552,
    spriteH : 408,

    draw : function() 
    {
        ctx.drawImage(
                        sprite_sheet, 
                        this.spriteX, this.spriteY, 
                        this.spriteW, this.spriteH, 
                        this.x, this.y, 
                        this.w, this.h
                     );
    }
}

//FOREGROUND
const foreground = 
{
    spriteX : 552,
    spriteY : 576,
    spriteW : 448,
    spriteH : 224,

    dx : 0,

    draw : function() 
    {
        ctx.drawImage(
                        sprite_sheet, 
                        this.spriteX, this.spriteY, 
                        this.spriteW, this.spriteH, 
                        this.x, this.y, 
                        this.w, this.h
                     );
        ctx.drawImage(
                        sprite_sheet, 
                        this.spriteX, this.spriteY, 
                        this.spriteW, this.spriteH, 
                        (this.x + this.w), this.y, 
                        this.w, this.h
                     );
    },
}

//BIRD
const bird = 
{
    animation : [
        {spriteX: 932, spriteY: 432, spriteW: 68, spriteH: 47},
        {spriteX: 932, spriteY: 480, spriteW: 68, spriteH: 47},
        {spriteX: 932, spriteY: 528, spriteW: 68, spriteH: 47}
    ],

    frame : 0,

    draw : function() 
    {
        let bird = this.animation[this.frame];
        { 
            ctx.drawImage(
                            sprite_sheet, 
                            bird.spriteX, bird.spriteY, 
                            bird.spriteW, bird.spriteH, 
                            (this.x - this.w/2), (this.y - this.h/2), 
                            this.w, this.h
                         );
        }
    },
}

//DRAW
function draw() 
{
    //Background color of canvas 
    ctx.fillStyle = "#7BC5CD"; 
    ctx.fillRect(0, 0, cvs.width, cvs.height); 

    background.draw();
    foreground.draw();
    bird.draw();
}

//ADJUST CANVAS
function adjustCanvas() 
{
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

    //Get bird measurements for canvas
    bird.x = cvs.width * 0.232;
    bird.y = cvs.height * 0.395;
    bird.w = cvs.width * 0.117;
    bird.h = cvs.height * 0.059;
}

//When window loads or resize
window.addEventListener("load", () => {
    adjustCanvas();
    window.addEventListener("resize", adjustCanvas);
});

//UPDATE
function update() 
{

}

//LOOP
function loop() 
{
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();