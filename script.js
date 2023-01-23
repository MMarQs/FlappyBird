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
                            (this.x - this.w/2), (this.y - this.h/2), //Centering the bird
                            this.w, this.h
                         );
            
            ctx.drawImage(
                           sprite_sheet, 
                            bird.spriteX, bird.spriteY, 
                            bird.spriteW, bird.spriteH, 
                            (this.x2 - this.w2/2), (this.y2 - this.h2/2),
                            this.w2, this.h2
                         );
        }
    },
}

//HOME
const home = 
{
    logo : 
    {
        spriteX : 552,
        spriteY : 236,
        spriteW : 384,
        spriteH : 87,
    },

    studio_name : 
    {
        spriteX : 172,
        spriteY : 284,
        spriteW : 380,
        spriteH : 28,
    },

    start_button : 
    {
        spriteX : 388,
        spriteY : 171,
        spriteW : 160,
        spriteH : 56,
    },

    score_button : 
    {
        spriteX : 388,
        spriteY : 114,
        spriteW : 160,
        spriteH : 56,
    },

    //TODO: Animate logo on home state

    draw : function() 
    {
        ctx.drawImage(
            sprite_sheet,
            this.logo.spriteX, this.logo.spriteY, 
            this.logo.spriteW, this.logo.spriteH, 
            this.logo.x, this.logo.y, 
            this.logo.w, this.logo.h
        );
        ctx.drawImage(
            sprite_sheet, 
            this.studio_name.spriteX, this.studio_name.spriteY, 
            this.studio_name.spriteW, this.studio_name.spriteH, 
            this.studio_name.x, this.studio_name.y, 
            this.studio_name.w, this.studio_name.h
        );
        ctx.drawImage(
            sprite_sheet, 
            this.start_button.spriteX, this.start_button.spriteY, 
            this.start_button.spriteW, this.start_button.spriteH, 
            this.start_button.x, this.start_button.y, 
            this.start_button.w, this.start_button.h
                     );
        /*
        ctx.drawImage(
            sprite_sheet, 
            this.score_button.spriteX, this.score_button.spriteY, 
            this.score_button.spriteW, this.score_button.spriteH, 
            this.score_button.x, this.score_button.y, 
            this.score_button.w, this.score_button.h
                     );
        */
    }
}

//GET READY MESSAGE
const getReady = 
{
    get_ready : 
    {
        spriteX : 552,
        spriteY : 324,
        spriteW : 348,
        spriteH : 88,
    },

    tap : 
    {
        spriteX : 232,
        spriteY : 0,
        spriteW : 155,
        spriteH : 196,
    },

    draw : function() 
    {
            ctx.drawImage(
                            sprite_sheet, 
                            this.get_ready.spriteX, this.get_ready.spriteY, 
                            this.get_ready.spriteW, this.get_ready.spriteH, 
                            this.get_ready.x, this.get_ready.y,
                            this.get_ready.w, this.get_ready.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            this.tap.spriteX, this.tap.spriteY, 
                            this.tap.spriteW, this.tap.spriteH, 
                            this.tap.x, this.tap.y,
                            this.tap.w, this.tap.h
                         );
    }
}

//PAUSE/RESUME BUTTONS
const gameButtons = 
{
    pause_button : 
    {
        spriteX : 388,
        spriteY : 228,
        spriteW : 52,
        spriteH : 56,
    },

    resume_button : 
    {
        spriteX : 441,
        spriteY : 228,
        spriteW : 52,
        spriteH : 56,
    },

    // TODO: If game is paused change to resume button

    draw : function() 
    {
        ctx.drawImage(
                        sprite_sheet, 
                        this.pause_button.spriteX, this.pause_button.spriteY, 
                        this.pause_button.spriteW, this.pause_button.spriteH, 
                        this.x, this.y, 
                        this.w, this.h
                     );
    }
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
    home.draw();
    getReady.draw();
    gameButtons.draw();
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

    //Get bird measurements for home screen canvas
    bird.x2 = cvs.width * 0.861;
    bird.y2 = cvs.height * 0.321;
    bird.w2 = cvs.width * 0.117;
    bird.h2 = cvs.height * 0.059;

    //Logo measurements for canvas
    home.logo.x = cvs.width * 0.098;
    home.logo.y = cvs.height * 0.279;
    home.logo.w = cvs.width * 0.665;
    home.logo.h = cvs.height * 0.109; 

    //Studio Name measurements for canvas
    home.studio_name.x = cvs.width * 0.171;
    home.studio_name.y = cvs.height * 0.904;
    home.studio_name.w = cvs.width * 0.659;
    home.studio_name.h = cvs.height * 0.034; 

    //Start button measurements for canvas
    home.start_button.x = cvs.width * 0.359;
    //home.start_button.x = cvs.width * 0.147;
    home.start_button.y = cvs.height * 0.759;
    home.start_button.w = cvs.width * 0.276;
    home.start_button.h = cvs.height * 0.068;

    /*
    //Score button measurements for canvas
    home.score_button.x = cvs.width * 0.576;
    home.score_button.y = cvs.height * 0.759;
    home.score_button.w = cvs.width * 0.276;
    home.score_button.h = cvs.height * 0.068;
    */

    //Get Ready Message measurements for canvas
    getReady.get_ready.x = cvs.width * 0.197;
    getReady.get_ready.y = cvs.height * 0.206;
    getReady.get_ready.w = cvs.width * 0.602;
    getReady.get_ready.h = cvs.height * 0.109;  

    //Tap measurements for canvas
    getReady.tap.x = cvs.width * 0.433;
    getReady.tap.y = cvs.height * 0.435;
    getReady.tap.w = cvs.width * 0.270;
    getReady.tap.h = cvs.height * 0.244;

    //Pause button measurements for canvas
    gameButtons.x = cvs.width * 0.087;
    gameButtons.y = cvs.height * 0.045;
    gameButtons.w = cvs.width * 0.088;
    gameButtons.h = cvs.height * 0.069;  
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