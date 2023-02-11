//SELECT CANVAS
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

//GAME VARIABLES AND CONSTANTS
let frames = 0;
let birdFlapped = false;
let logoGoUp = true;
const DEGREE = Math.PI/180;

//LOAD SPRITE SHEET
const sprite_sheet = new Image();
sprite_sheet.src = "img/sprite_sheet.png"

//GAME STATES
const state = 
{
    current : 0,
    home : 0,
    getReady : 1,
    game : 2,
    gameOver : 3
}

//CONTROL THE GAME
//This will fire up the fuction whenever the user clicks
cvs.addEventListener("click", function(event) 
{ 
    switch (state.current) 
    {
        case state.home:
            state.current = state.getReady;
            break;
        case state.getReady:
            bird.flap();
            birdFlapped = true;
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;
        case state.gameOver:
            state.current = state.home;
            break;
    }        
});

//This will fire up the fuction whenever the user presses space
document.addEventListener("keydown", function(event) 
{ 
    if (event.key === " ") 
    {
        switch (state.current) 
        {
            case state.getReady:
                bird.flap();
                birdFlapped = true;
                state.current = state.game;
                break;
            case state.game:
                if (!birdFlapped) 
                {
                    bird.flap();
                    birdFlapped = true;
                }
                break;
        } 
    }        
});

//This will fire up the fuction whenever the user stop pressing space
document.addEventListener("keyup", function(event) 
{ 
    if (event.key === " " && state.current == state.game)
    {
        birdFlapped = false;
    } 
});

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
    spriteX : 553,
    spriteY : 577,
    spriteW : 446,
    spriteH : 223,

    draw : function() 
    {
        //Drawing 2 foregroung images because the sprite's width is lower than canvas width
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

    update : function() 
    {
        if(state.current != state.gameOver) 
        {
            //Keeps decrementing x by dx until the foreground be moved by its width / 2
            this.x = (this.x - this.dx) % (this.w/2);
        }
    }
}

//BIRD
const bird = 
{
    animation : 
    [
        {spriteX: 932, spriteY: 429, spriteW: 68, spriteH: 48},
        {spriteX: 932, spriteY: 478, spriteW: 68, spriteH: 48},
        {spriteX: 932, spriteY: 527, spriteW: 68, spriteH: 48}
    ],

    frame : 0,
    gravity : 0,
    jump : 0,
    speed : 0,
    rotation : 0,

    draw : function() 
    {
        let bird = this.animation[this.frame];

        //Saving the state of the canvas so only the bird rotates
        ctx.save();
        //Translation from the (0, 0) origin to the bird orgin so the centre of rotation is the centre of the bird
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation);

        if(state.current != state.home)
        {
            ctx.drawImage(
                            sprite_sheet, 
                            bird.spriteX, bird.spriteY, 
                            bird.spriteW, bird.spriteH, 
                            -this.w/2, -this.h/2, //Centering the bird
                            this.w, this.h
                         );
        }

        //Restore state after rotation
        ctx.restore();
    },

    flap : function() 
    {
        this.speed = -this.jump;
    },

    update: function() 
    {
        //The bird must flap slowly on get ready state
        this.period = (state.current == state.getReady) ? 6 : 4;
        //Incrementing the frame by 1, each period
        this.frame += frames % this.period == 0 ? 1 : 0;
        //Frame goes from 0 to 3, then again to 0
        this.frame = this.frame % this.animation.length; 

        if(state.current == state.getReady)
        {
            //Reset bird's position after game over
            this.y = cvs.height * 0.395;
            this.rotation = 0 * DEGREE;
        } 
        else
        {
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.y + this.h/2 >= foreground.y)
            {
                //Bird position when it collides with the foreground
                this.y = foreground.y - this.h/2;
                if(state.current == state.game)
                {
                    state.current = state.gameOver;
                }
            }

            //If the speed is greater than the jump, means the bird is falling down
            if(this.speed >= this.jump)
            {
                this.rotation = 90 * DEGREE;
                //When bird dies, stop flapping animation
                this.frame = 0;
            }
            else
            {
                this.rotation = -25 * DEGREE;
            }
        }  
    }
}

//PIPES
const pipes =
{
    position : [],
    
    top :
    {
        spriteX : 1000,
        spriteY : 0,
        spriteW : 104,
        spriteH : 800
    },

    bottom : 
    {
        spriteX : 1104,
        spriteY : 0,
        spriteW : 104,
        spriteH : 800
    },

    draw : function()
    {
        if(state.current == state.game || state.current == state.gameOver)
        {
            for(let i = 0; i < this.position.length; i++)
            {
                let p = this.position[i];
                
                let topYPos = p.y;
                let bottomYPos = p.y + this.h + this.gap;
    
                ctx.drawImage( 
                                sprite_sheet, 
                                this.top.spriteX, this.top.spriteY, 
                                this.top.spriteW, this.top.spriteH, 
                                p.x, topYPos, 
                                this.w, this.h
                             ); 
                ctx.drawImage( 
                                sprite_sheet, 
                                this.bottom.spriteX, this.bottom.spriteY, 
                                this.bottom.spriteW, this.bottom.spriteH, 
                                p.x, bottomYPos, 
                                this.w, this.h
                             );
            }
        }
    },

    update : function()
    {
        //Only create pipes in the game state
        if(state.current != state.game) 
        {
            return;
        }

        //Every 80 frames add a new position to our position array
        if(frames%80 == 0) 
        {
            pipes.position.push(
            {
                x : cvs.width,
                y : pipes.maxYPos * (Math.random() + 1)
            });
        }
        
        for(let i = 0; i < this.position.length; i++)
        {
            let p = this.position[i];

            p.x -= this.dx;

            //Delete first half of positions array when it has 4 positions
            if(this.position.length == 4)
            {
                this.position.slice(0, 2);
            }
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
        spriteH : 87
    },

    animation : 
    [
        {spriteX: 932, spriteY: 429, spriteW: 68, spriteH: 48},
        {spriteX: 932, spriteY: 478, spriteW: 68, spriteH: 48},
        {spriteX: 932, spriteY: 527, spriteW: 68, spriteH: 48}
    ],

    bird : 
    {

    },

    start_button : 
    {
        spriteX : 388,
        spriteY : 171,
        spriteW : 160,
        spriteH : 56
    },

    studio_name : 
    {
        spriteX : 172,
        spriteY : 284,
        spriteW : 380,
        spriteH : 28
    },

    frame : 0,

    draw : function() 
    {
        let bird = this.animation[this.frame];

        if(state.current == state.home)
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
                            bird.spriteX, bird.spriteY, 
                            bird.spriteW, bird.spriteH, 
                            this.bird.x, this.bird.y,
                            this.bird.w, this.bird.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            this.start_button.spriteX, this.start_button.spriteY, 
                            this.start_button.spriteW, this.start_button.spriteH, 
                            this.start_button.x, this.start_button.y, 
                            this.start_button.w, this.start_button.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            this.studio_name.spriteX, this.studio_name.spriteY, 
                            this.studio_name.spriteW, this.studio_name.spriteH, 
                            this.studio_name.x, this.studio_name.y, 
                            this.studio_name.w, this.studio_name.h
                         );
        }
    },

    update: function() 
    {
        if (state.current == state.home) 
        {
            if (logoGoUp) 
            {
                this.logo.y -= this.logo.dy;
                this.bird.y -= this.logo.dy;
                if(this.logo.y <= this.logo.MAXY) 
                {
                    logoGoUp = false;
                }
            }
            if (!logoGoUp) 
            {
                this.logo.y += this.logo.dy;
                this.bird.y += this.logo.dy;
                if(this.logo.y >= this.logo.MINY) 
                {
                    logoGoUp = true;
                }
            }
        }

        //The bird must flap slowly on home state
        if(state.current == state.home)
        {
            this.period = 6;
        }
        //Incrementing the frame by 1, each period
        this.frame += frames % this.period == 0 ? 1 : 0;
        //Frame goes from 0 to 3, then again to 0
        this.frame = this.frame % this.animation.length; 
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
        spriteH : 87
    },

    tap : 
    {
        spriteX : 232,
        spriteY : 0,
        spriteW : 155,
        spriteH : 196
    },

    draw : function() 
    {
        if(state.current == state.getReady)
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
}

//PAUSE/RESUME BUTTONS
const gameButtons = 
{
    pause_button : 
    {
        spriteX : 388,
        spriteY : 228,
        spriteW : 52,
        spriteH : 56
    },

    resume_button : 
    {
        spriteX : 441,
        spriteY : 228,
        spriteW : 52,
        spriteH : 56
    },

    draw : function() 
    {
        if(state.current == state.game)
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
}

//GAME OVER
const gameOver = 
{
    game_over : 
    {
        spriteX : 552,
        spriteY : 413,
        spriteW : 376,
        spriteH : 74
    },

    scoreboard : 
    {
        spriteX : 548,
        spriteY : 0,
        spriteW : 452,
        spriteH : 232
    },

    ok_button : 
    {
        spriteX : 388,
        spriteY : 57,
        spriteW : 160,
        spriteH : 56
    },

    draw : function() 
    {
        if(state.current == state.gameOver)
        {
            ctx.drawImage(
                            sprite_sheet, 
                            this.game_over.spriteX, this.game_over.spriteY, 
                            this.game_over.spriteW, this.game_over.spriteH, 
                            this.game_over.x, this.game_over.y, 
                            this.game_over.w, this.game_over.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            this.scoreboard.spriteX, this.scoreboard.spriteY, 
                            this.scoreboard.spriteW, this.scoreboard.spriteH, 
                            this.scoreboard.x, this.scoreboard.y, 
                            this.scoreboard.w, this.scoreboard.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            this.ok_button.spriteX, this.ok_button.spriteY, 
                            this.ok_button.spriteW, this.ok_button.spriteH, 
                            this.ok_button.x, this.ok_button.y, 
                            this.ok_button.w, this.ok_button.h
                         );
        }
    }
}

//CANVAS SCALE
function canvasScale() 
{
    //CANVAS HEIGHT & WIDTH
    cvs.height = window.innerHeight - 2;
    cvs.width  = cvs.height * 0.72 - 2;

    //BACKGROUND
    background.x = 0;
    background.y = cvs.height * 0.631;
    background.w = cvs.width;
    background.h = background.w * 0.74;

    //FOREGROUND
    foreground.x = 0;
    foreground.y = cvs.height * 0.861;
    foreground.w = cvs.width * 0.7;
    foreground.h = foreground.w * 0.46;
    foreground.dx = cvs.width * 0.007;

    //BIRD
    bird.x = cvs.width * 0.290;
    bird.y = cvs.height * 0.395;
    bird.w = cvs.width * 0.117;
    bird.h = cvs.height * 0.059;
    bird.gravity = cvs.height * 0.0006;
    bird.jump = cvs.height * 0.01;

    //PIPES
    for(let i = 0; i < pipes.position.length; i++)
    {
        let w = pipes.w / 0.164;
        let h = pipes.h / 0.888;
        let p = pipes.position[i];

        pipes.position[i] = 
        {
            x : p.x * cvs.width / w,
            y : p.y * cvs.height / h
        }
    }
    pipes.w = cvs.width * 0.164;
    pipes.h = cvs.height * 0.888;
    pipes.gap = cvs.height * 0.177;
    pipes.maxYPos = -(cvs.height * 0.350);
    pipes.dx = cvs.width * 0.007;

    //HOME
    //Logo
    home.logo.x = cvs.width * 0.098;
    home.logo.y = cvs.height * 0.279;
    home.logo.w = cvs.width * 0.665;
    home.logo.h = cvs.height * 0.109; 
    home.logo.MAXY = cvs.height * 0.279 - home.logo.h/7;
    home.logo.MINY = cvs.height * 0.279 + home.logo.h/7;
    home.logo.dy = cvs.width * 0.0012;
    //Bird
    home.bird.x = cvs.width * 0.803;
    home.bird.y = cvs.height * 0.294;
    home.bird.w = cvs.width * 0.117;
    home.bird.h = cvs.height * 0.059;
    //Start Button
    home.start_button.x = cvs.width * 0.359;
    home.start_button.y = cvs.height * 0.759;
    home.start_button.w = cvs.width * 0.276;
    home.start_button.h = cvs.height * 0.068;
    //Studio Name
    home.studio_name.x = cvs.width * 0.171;
    home.studio_name.y = cvs.height * 0.897;
    home.studio_name.w = cvs.width * 0.659;
    home.studio_name.h = cvs.height * 0.034; 

    //GET READY
    //"Get Ready" message
    getReady.get_ready.x = cvs.width * 0.197;
    getReady.get_ready.y = cvs.height * 0.206;
    getReady.get_ready.w = cvs.width * 0.602;
    getReady.get_ready.h = cvs.height * 0.109;  
    //Tap
    getReady.tap.x = cvs.width * 0.433;
    getReady.tap.y = cvs.height * 0.435;
    getReady.tap.w = cvs.width * 0.270;
    getReady.tap.h = cvs.height * 0.244;

    //PAUSE & RESUME BUTTONS
    //Pause button 
    gameButtons.x = cvs.width * 0.087;
    gameButtons.y = cvs.height * 0.045;
    gameButtons.w = cvs.width * 0.088;
    gameButtons.h = cvs.height * 0.069;  

    //GAME OVER
    //"Game Over" message
    gameOver.game_over.x = cvs.width * 0.197;
    gameOver.game_over.y = cvs.height * 0.243;
    gameOver.game_over.w = cvs.width * 0.6049;
    gameOver.game_over.h = cvs.height * 0.095;  
    //Scoreboard
    gameOver.scoreboard.x = cvs.width * 0.107;
    gameOver.scoreboard.y = cvs.height * 0.355;
    gameOver.scoreboard.w = cvs.width * 0.782;
    gameOver.scoreboard.h = cvs.height * 0.289;
    //Ok button
    gameOver.ok_button.x = cvs.width * 0.359;
    gameOver.ok_button.y = cvs.height * 0.759;
    gameOver.ok_button.w = cvs.width * 0.276;
    gameOver.ok_button.h = cvs.height * 0.068;
}

//When window loads or resize
window.addEventListener("load", () => {
    canvasScale();
    window.addEventListener("resize", canvasScale);
});

//DRAW
function draw() 
{
    //Background color of canvas 
    ctx.fillStyle = "#7BC5CD"; 
    ctx.fillRect(0, 0, cvs.width, cvs.height); 

    background.draw();
    pipes.draw();
    foreground.draw();
    bird.draw();
    home.draw();
    getReady.draw();
    gameButtons.draw();
    gameOver.draw();
}

//UPDATE
function update() 
{
    bird.update();
    foreground.update();
    home.update();
    pipes.update();
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