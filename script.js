//SELECT CANVAS
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

//GAME VARIABLES AND CONSTANTS
let frames = 0;
let birdFlapped = false;
const DEGREE = Math.PI/180;

//LOAD SPRITE SHEET
const sprite_sheet = new Image();
sprite_sheet.src = "img/sprite_sheet.png"

//GAME STATES
const state = 
{
    current  : 0,
    home     : 0,
    getReady : 1,
    game     : 2,
    gameOver : 3
}

//CONTROL THE GAME
//This will fire up the fuction whenever the user clicks
cvs.addEventListener("click", function(event) 
{ 
    let rect = cvs.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    let clickY = event.clientY - rect.top;

    switch (state.current) 
    {
        case state.home:
            if(clickX >= home.start_button.x && clickX <= home.start_button.x + home.start_button.w &&
               clickY >= home.start_button.y && clickY <= home.start_button.y + home.start_button.h)
             {
                 state.current = state.getReady;
             }
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
            if(clickX >= gameOver.restart_button.x && clickX <= gameOver.restart_button.x + gameOver.restart_button.w &&
               clickY >= gameOver.restart_button.y && clickY <= gameOver.restart_button.y + gameOver.restart_button.h)
            {
                pipes.pipesReset();
                bird.speedReset();
                score.scoreReset();
                state.current = state.getReady;
            }
            else if(clickX >= gameOver.home_button.x && clickX <= gameOver.home_button.x + gameOver.home_button.w &&
                    clickY >= gameOver.home_button.y && clickY <= gameOver.home_button.y + gameOver.home_button.h)
            {
                pipes.pipesReset();
                bird.speedReset();
                score.scoreReset();
                state.current = state.home;
            }
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
    x : 0,
    y : 0,
    w : 0,
    h : 0,

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
    x : 0,
    y : 0,
    w : 0,
    h : 0,

    dx : 0,

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
    x : 0, 
    y : 0, 
    w : 0, 
    h : 0,

    frame    : 0,
    gravity  : 0,
    jump     : 0,
    speed    : 0,
    rotation : 0,
    radius   : 0,

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
    },

    speedReset : function()
    {
        this.speed = 0;
    }
}

//PIPES
const pipes =
{
    position : [],
    
    top :
    {
        spriteX: 1000, spriteY: 0, 
        spriteW: 104, spriteH: 800,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    bottom : 
    {
        spriteX: 1104, spriteY: 0, 
        spriteW: 104, spriteH: 800,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    dx      : 0,
    gap     : 0,
    maxYPos : 0,
    scored  : false,

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
                y : pipes.maxYPos * (Math.random() + 1),
                scored : false
            });
        }
        
        for(let i = 0; i < this.position.length; i++)
        {
            let p = this.position[i];
            let bottomYPos = p.y + this.h + this.gap;

            //COLLISION DETECTION
            //Top pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
               bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h)
            {
                state.current = state.gameOver;
            }
            //Bottom pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
               bird.y + bird.radius > bottomYPos && bird.y - bird.radius < bottomYPos + this.h)
            {
                state.current = state.gameOver;
            }

            //Moving the pipes
            p.x -= this.dx;

            //Deleting 1/3 of the pipes every 6 pipes
            if (this.position.length == 6) 
            {
                this.position.splice(0, 2);
            }
            
            //Update score when the bird passes a pipe
            if (p.x + this.w < bird.x && !p.scored) 
            {
                score.game_score++;
                
                if(score.game_score > score.best_score)
                {
                    score.best_score = score.game_score;
                    score.new_best_score = true;
                }

                localStorage.setItem("best_score", score.best_score);
                p.scored = true;
            }
        }
    },

    pipesReset : function()
    {
        this.position = [];
    }
}

//HOME
const home = 
{
    logo : 
    {
        spriteX: 552, spriteY: 233, 
        spriteW: 384, spriteH: 87,
        x: 0, y: 0,
        w: 0, h: 0,
        MAXY: 0, MINY: 0, dy: 0
    },

    animation : 
    [
        {spriteX: 932, spriteY: 429, spriteW: 68, spriteH: 48},
        {spriteX: 932, spriteY: 478, spriteW: 68, spriteH: 48},
        {spriteX: 932, spriteY: 527, spriteW: 68, spriteH: 48}
    ],

    bird : 
    {
        x: 0, y: 0, 
        w: 0, h: 0
    },

    start_button : 
    {
        spriteX: 227, spriteY: 0, 
        spriteW: 160, spriteH: 56,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    studio_name : 
    {
        spriteX: 172, spriteY: 284, 
        spriteW: 380, spriteH: 28,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    frame    : 0,
    logoGoUp : true,

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
            if (this.logoGoUp) 
            {
                this.logo.y -= this.logo.dy;
                this.bird.y -= this.logo.dy;
                if(this.logo.y <= this.logo.MAXY) 
                {
                    this.logoGoUp = false;
                }
            }
            if (!this.logoGoUp) 
            {
                this.logo.y += this.logo.dy;
                this.bird.y += this.logo.dy;
                if(this.logo.y >= this.logo.MINY) 
                {
                    this.logoGoUp = true;
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
        spriteX: 552, spriteY: 321, 
        spriteW: 348, spriteH: 87,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    tap : 
    {
        spriteX: 0, spriteY: 0, 
        spriteW: 155, spriteH: 196,
        x: 0, y: 0, 
        w: 0, h: 0
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
        spriteX: 280, spriteY: 114, 
        spriteW: 52, spriteH: 56,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    resume_button : 
    {
        spriteX: 227, spriteY: 114, 
        spriteW: 52, spriteH: 56,
        x: 0, y: 0, 
        w: 0, h: 0
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
        spriteX: 552, spriteY: 410, 
        spriteW: 376, spriteH: 75,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    scoreboard : 
    {
        spriteX: 548, spriteY: 0, 
        spriteW: 452, spriteH: 232,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    home_button : 
    {
        spriteX: 388, spriteY: 171, 
        spriteW: 160, spriteH: 59,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    restart_button : 
    {
        spriteX: 227, spriteY: 57, 
        spriteW: 160, spriteH: 56,
        x: 0, y: 0, 
        w: 0, h: 0
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
                            this.home_button.spriteX, this.home_button.spriteY, 
                            this.home_button.spriteW, this.home_button.spriteH, 
                            this.home_button.x, this.home_button.y, 
                            this.home_button.w, this.home_button.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            this.restart_button.spriteX, this.restart_button.spriteY, 
                            this.restart_button.spriteW, this.restart_button.spriteH, 
                            this.restart_button.x, this.restart_button.y, 
                            this.restart_button.w, this.restart_button.h
                         );
        }
    }
}

//SCORE
const score = 
{
    new_best :
    {
        spriteX: 921, spriteY: 349, 
        spriteW: 64, spriteH: 28,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    number : 
    [
        {spriteX :  98}, //0
        {spriteX : 127}, //1
        {spriteX : 156}, //2
        {spriteX : 185}, //3
        {spriteX : 214}, //4
        {spriteX : 243}, //5
        {spriteX : 272}, //6 
        {spriteX : 301}, //7
        {spriteX : 330}, //8
        {spriteX : 359}  //9
    ],
    spriteY : 243, 
    spriteW : 28, 
    spriteH : 40,
    x : 0,
    y : 0,
    w : 0,
    y : 0,
    score : {x: 0, y: 0, w: 0, h: 0},
    best  : {x: 0, y: 0, w: 0, h: 0},
    space : 0,

    //If local storage is empty for best_score, best_score is 0
    best_score : parseInt(localStorage.getItem("best_score")) || 0,
    game_score : 0,
    new_best_score : false,

    draw : function()
    {
        let game_score_s = this.game_score.toString();
        let best_score_s = this.best_score.toString();

        if(state.current == state.game)
        {
            //Total width of the game score
            let total_width = game_score_s.length * (this.w + this.space) - this.space;
            //Offset for the game score to center it horizontally
            let offset = this.x - total_width / 2;
            
            for(let i = 0; i < game_score_s.length; i++)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.number[parseInt(game_score_s[i])].spriteX, this.spriteY, 
                                this.spriteW, this.spriteH, 
                                offset, this.y,
                                this.w, this.h
                             );
                offset = offset + this.w + this.space;
            }
        }
        else if(state.current == state.gameOver)
        {
            let offset_1 = 0;
            let offset_2 = 0;

            for(let i = game_score_s.length - 1; i >= 0; i--)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.number[parseInt(game_score_s[i])].spriteX, this.spriteY, 
                                this.spriteW, this.spriteH, 
                                this.score.x + offset_1, this.score.y, 
                                this.w, this.h
                            );
                offset_1 = offset_1 - this.w - this.space;
            }

            for(let i = best_score_s.length - 1; i >= 0; i--)
            {     
                ctx.drawImage(
                                sprite_sheet, 
                                this.number[parseInt(best_score_s[i])].spriteX, this.spriteY, 
                                this.spriteW, this.spriteH, 
                                this.best.x + offset_2, this.best.y, 
                                this.w, this.h
                            );
                offset_2 = offset_2 - this.w - this.space;
            }

            if(this.new_best_score)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.new_best.spriteX, this.new_best.spriteY, 
                                this.new_best.spriteW, this.new_best.spriteH, 
                                this.new_best.x, this.new_best.y, 
                                this.new_best.w, this.new_best.h
                             ); 
            }            
        }
    },

    scoreReset : function()
    {
        this.score = 0;
    }
}

//SCORE MEDALS
const medal = 
{
    bronze   : {spriteX: 554},
    silver   : {spriteX: 642},
    gold     : {spriteX: 731},
    platinum : {spriteX: 820},
    spriteY: 487,
    spriteW: 88, 
    spriteH: 87,
    x : 0,
    y : 0,
    w : 0,
    h : 0,

    medal: "",

    draw: function () 
    {
        let medalSpriteX;
        let hasMedal = false;
        
        if (score.game_score >= 10 && score.game_score < 20) 
        {
            this.medal = "bronze";
            medalSpriteX = this.bronze;
            hasMedal = true;
        } 
        else if (score.game_score >= 20 && score.game_score < 30) 
        {
            this.medal = "silver";
            medalSpriteX = this.silver;
            hasMedal = true;
        }
        else if (score.game_score >= 30 && score.game_score < 40) 
        {
            this.medal = "gold";
            medalSpriteX = this.gold;
            hasMedal = true;
        } 
        else if (score.game_score >= 40) 
        {
            this.medal = "platinum";
            medalSpriteX = this.platinum;
            hasMedal = true;
        }

        if (state.current == state.gameOver && hasMedal) 
        {
            ctx.drawImage(
                            sprite_sheet,
                            medalSpriteX.spriteX, this.spriteY, 
                            this.spriteW, this.spriteH, 
                            this.x, this.y, 
                            this.w, this.h
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
    bird.radius = cvs.height * 0.027;

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
    gameOver.game_over.w = cvs.width * 0.645;
    gameOver.game_over.h = cvs.height * 0.095; 
    //Scoreboard
    gameOver.scoreboard.x = cvs.width * 0.107;
    gameOver.scoreboard.y = cvs.height * 0.355;
    gameOver.scoreboard.w = cvs.width * 0.782;
    gameOver.scoreboard.h = cvs.height * 0.289;
    //Home button
    gameOver.home_button.x = cvs.width * 0.576;
    gameOver.home_button.y = cvs.height * 0.759;
    gameOver.home_button.w = cvs.width * 0.276;
    gameOver.home_button.h = cvs.height * 0.068;
    //Restart button
    gameOver.restart_button.x = cvs.width * 0.147;
    gameOver.restart_button.y = cvs.height * 0.759;
    gameOver.restart_button.w = cvs.width * 0.276;
    gameOver.restart_button.h = cvs.height * 0.068;

    //SCORE
    //New best score label
    score.new_best.x = cvs.width * 0.577;
    score.new_best.y = cvs.height * 0.500;
    score.new_best.w = cvs.width * 0.112;
    score.new_best.h = cvs.height * 0.035;
    //Width & height for every number
    score.w = cvs.width * 0.048;
    score.h = cvs.height * 0.046;
    //Score on game screen
    score.x = cvs.width * 0.476;
    score.y = cvs.height * 0.045;
    //Score on game over screen
    score.score.x = cvs.width * 0.769;
    score.score.y = cvs.height * 0.441;
    //Best score on game screen
    score.best.x = cvs.width * 0.769;
    score.best.y = cvs.height * 0.545;
    //Space between numbers
    score.space = cvs.width * 0.016;

    //Score medals
    medal.x = cvs.width * 0.197;
    medal.y = cvs.height * 0.461;
    medal.w = cvs.width * 0.152;
    medal.h = cvs.height * 0.108;
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
    score.draw();
    medal.draw();
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