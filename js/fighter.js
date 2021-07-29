const jumping = 'jumping';
const falling = 'falling';
const fall = 'fall';
const highKick = 'high-kick';
const lowPunch = 'low-punch';
const fireBall = 'fireball';
const stand = 'stand';
const walking = 'walking';
const walkingBackward = 'walking-backward';
const win = 'win';

const hitted = (type, dmg) => {
    setTimeout(() => { //300ms timeout bcs I want to lower the hp when kick animation ends
        for(let i=0; i<10; i++) { //to shrink hp smoothly there is for loop which loops 10 times
            setTimeout(() => {
                if(type === 'kano') player.hp-=dmg; //lowering player hp
                if(type === 'subzero') enemy.hp-=dmg; //lowering enemy hp
            }, 50*i); //and creates 10 timeout each of these is 50ms later 50,100,150...
        }
    }, 300);
}

class Fighter {
    constructor(x,y,type,direction) {
        this.x = x;
        this.y = y;
        this.positionX = 0;
        this.positionY = 0;
        this.width = 75;
        this.height = 135;

        this.state = stand;
        this.type = type;
        this.bar =  document.querySelector(`.hp__${this.type === 'kano' ? 'player' : 'enemy'}Bar`);
        this.direction = direction;
        this.frame = 0;
        this.drawed = false;

        this.hp = 100;

        this.move = 0;
        this.speedX = 4;

        this.speedY = 10;
        this.fallingSpeed = 0;
        this.gravity = .3;
        this.grounded = true;
        this.jumping = false;
        this.falling = false;
        this.attacked = false;
        this.end = false;

        this.botTimer = 0;
        this.botMoves = [0, -1, -1, 1, 1];

        this.fireBall = new Fireball(this.x, this.y, this.direction, this.type, true);
    }

    draw() {
        this.fireBall.draw();
        this.update();
        ctx.fillStyle = 'red';
        //ctx.fillRect(this.x + this.positionX, this.y + this.positionY, this.width, this.height);
        if(images[this.type][this.direction][this.state][this.frame])
            ctx.drawImage(images[this.type][this.direction][this.state][this.frame], this.x + this.positionX, this.y + this.positionY);
        this.bar.style.width = `${this.hp}%`;
    }

    update() {
        if(this.hp === 0) {
            if(this.type === 'kano') {
                player.state = fall;
                enemy.state = win;
            } else {
                player.state = win;
                enemy.state = fall;
            }
        }


        if(this.state === win || this.state === fall) { //you cant move if game ends
            this.move = 0;
            return;
        }

        if(this.type === 'subzero') this.bot(); //if this is subzero run bot function
        if(this.direction === 'left' && [highKick, lowPunch].includes(this.state)) {
            //changing width of player when highKick or punch
            this.positionX = -35;
        } else {
            this.positionX = 0;
        }

        if(!this.grounded && !this.jumping) this.falling = true;

        if(this.move !== 0) {
            const tempX = this.x + this.move * this.speedX;
            if(tempX > 0 && tempX < WIDTH - this.width) {
                this.x = tempX;
            }
        }

        if(this.jumping) {
            const tempY = this.y - this.speedY;
            if(tempY > 270) {
                this.y = tempY;
            } else {
                this.falling = true;
                this.jumping = false;
            }
        }

        if(this.falling) {
            const tempY = this.y + this.fallingSpeed;
            this.fallingSpeed += this.gravity;

            //430 is ground level
            if(tempY < 430) {
                this.y = tempY;
            } else {
                //fighter is on ground
                this.y = 430;
                this.fallingSpeed = 0;
                this.botTimer = 0;
                this.botMove = this.botMoves[Math.floor(Math.random() * 4)];
                this.grounded = true;
                this.falling = false;
                //sets state after falling
                if(this.move === 0) this.state = stand;
                if((this.move === 1 && this.direction === 'left') ||
                (this.move === -1 && this.direction === 'right')) this.state = walkingBackward;
                if((this.move === -1 && this.direction === 'left') ||
                (this.move === 1 && this.direction === 'right')) this.state = walking;
            }
        }

        if([highKick, lowPunch].includes(this.state)) {
            this.width = 110;
            if(player.x + player.positionX < enemy.x + enemy.positionX + enemy.width &&
                player.x + player.positionX + player.width > enemy.x + enemy.positionX &&
                player.y < enemy.y + enemy.height && //collision detection for punch/kick
                player.y + player.height > enemy.y && !this.attacked) {
                    this.attacked = true;
                    if(this.type === 'kano') hitted('subzero', 1);
                    if(this.type === 'subzero') hitted('kano', 0.5);
                }
        } else this.width = 75;
    }

    changeFrame() {
        this.fireBall.changeFrame();
        let maxFrame = 0;
        if(this.state === fireBall) maxFrame = 2;
        if(this.state === lowPunch) maxFrame = 4;
        if(this.state === jumping) maxFrame = 5;
        if(this.state === fall) maxFrame = 6;
        if([stand, walking, walkingBackward].includes(this.state)) maxFrame = 8;
        if(this.state === win) maxFrame = 9;
        if(this.state === highKick) maxFrame = 11;
        //sets maxFrame based on state type


        this.frame++;
        if(this.frame > maxFrame) { //if frame is above maxFrame
            this.frame = 0;
            if(this.state === win || this.state === fall) {
                //ending game if state is win or fall (lose)
                this.frame = maxFrame;
                this.end = true;
                return;
            }
            //if jumping animation ended then you are falling
            if(this.state === jumping) {
                this.state = falling;
            }
            //after kick, punch, fireball sets state based on move variable
            if([highKick, lowPunch, fireBall].includes(this.state)) {
                if(this.type === 'kano') this.attacked = false;
                if(this.move === 0) this.state = stand;
                if((this.move === 1 && this.direction === 'left') ||
                (this.move === -1 && this.direction === 'right')) this.state = walkingBackward;
                if((this.move === -1 && this.direction === 'left') ||
                (this.move === 1 && this.direction === 'right')) this.state = walking;
            }
        }
    }

    bot() {
        this.botTimer++;
        if(player.x + player.positionX < enemy.x + enemy.positionX + enemy.width &&
            player.x + player.positionX + player.width > enemy.x + enemy.positionX &&
            player.y < enemy.y + enemy.height && //if bot is colliding with player it may attack him
            player.y + player.height > enemy.y && !this.attacked && Math.random() < 0.1) {
                this.state = Math.random() > 0.5 ? highKick : lowPunch;
                this.attacked = true;
                setTimeout(() => {
                    this.attacked = false;
                }, 1000);
                if(this.type === 'kano') hitted('subzero', 0.5);
                if(this.type === 'subzero') hitted('kano', 1);
            }
        if(this.state === stand && this.botTimer > 20) { //if bot stands he throws fireball
            if(this.fireBall.out) this.fireBall = new Fireball(this.x, this.y, this.direction, this.type, false);
            this.botTimer = 0;
            this.move = this.botMoves[Math.floor(Math.random() * 5)];//choosing random move from botMoves array
            if(this.move === 0) this.state = stand;
            if((this.move === 1 && this.direction === 'left') ||
            (this.move === -1 && this.direction === 'right')) this.state = walkingBackward;
            if((this.move === -1 && this.direction === 'left') ||
            (this.move === 1 && this.direction === 'right')) this.state = walking;
        }
        if([walking, walkingBackward].includes(this.state) && this.botTimer > 30) {
            this.botTimer = 0;
            this.move = this.botMoves[Math.floor(Math.random() * 5)];//choosing random move from botMoves array
            if(this.move === 0) this.state = stand;
            if((this.move === 1 && this.direction === 'left') ||
            (this.move === -1 && this.direction === 'right')) this.state = walkingBackward;
            if((this.move === -1 && this.direction === 'left') ||
            (this.move === 1 && this.direction === 'right')) this.state = walking;
        }
    }
}

class Fireball {
    constructor(x, y, direction, type, draw) {
        this.x = x + (direction === 'right' ? 25 : -25);
        this.y = y + 25;
        this.direction = direction;
        this.frame = 0;
        this.speed = 10;
        this.type = type === 'kano' ? 'fireball' : 'fireballblue';
        this.out = draw;
    }

    draw() {
        if(this.out) return; //if fireball is out of screen it shouldnt be drawed
        this.update();

        ctx.drawImage(images[this.type][this.direction][this.frame], this.x, this.y, 40, 40); //draws fireball
    }

    update() {
        let tempX = 0;
        if(this.direction === 'left') {
            tempX = this.x - this.speed;
        } else {
            tempX = this.x + this.speed;
        } //changing position based on direction of fireball

        if(tempX >= -40 && tempX <= 1000) {
            this.x = tempX;
        } else { //if is out of screen sets out to true
            this.out = true;
        }

        this.collision();
    }

    changeFrame() {
        //animating fireball
        this.frame++;
        if(this.frame > 4) {
            this.frame = 0;
        }
    }

    collision() {
        if(this.type === 'fireball' &&
        this.x < enemy.x + enemy.width &&
        this.x + 40 > enemy.x &&
        this.y < enemy.y + enemy.height &&
        this.y + 40 > enemy.y
        ) {
            //collision with subzero (bot)
            hitted('subzero', 0.5);
            this.out = true;
        }

        if(this.type === 'fireballblue' &&
        this.x < player.x + player.width &&
        this.x + 40 > player.x &&
        this.y < player.y + player.height &&
        this.y + 40 > player.y
        ) {
            //collision with kano (player)
            hitted('kano', 1);
            this.out = true;
        }
    }
}