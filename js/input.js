let moving = '';

//some key is pressed variables
let leftPressed = false;
let rightPressed = false;
let jumpPressed = false;
let kickPressed = false;
let punchPressed = false;
let firePressed = false;

document.addEventListener('keydown', ({key}) => {
    if(player.state === fall || player.state === win) return;
    switch(key) {
        case 'z':
            if(not() && !punchPressed)  {
                /*
                if punch isnt pressed or
                state !== jumping, falling, highKick, lowPunch,
                fireBall, win, fall (not functions gives this)
                you can punch it works the same for rest attacks / jump
                */
                punchPressed = true;
                player.frame = 0;
                player.state = lowPunch;
            }
            break;
        case 'x':
            if(not() && !firePressed && player.fireBall.out) {
                firePressed = true;
                player.frame = 0;
                player.state = fireBall;
                player.fireBall = new Fireball(player.x, player.y, player.direction, player.type, false);
            }
            break;
        case ' ':
            if(not() && !kickPressed) {
                kickPressed = true;
                player.frame = 0;
                player.state = highKick;
            }
            break;
        case 'ArrowUp':
            if(not() && !jumpPressed) {
                jumpPressed = true;
                player.state = jumping;
                player.frame = 0;
                player.jumping = true;
                player.grounded = false;
            }
            break;
        case 'ArrowLeft':
            leftPressed = true;
            goLeft();
            break;
        case 'ArrowRight':
            rightPressed = true;
            goRight();
            break;
    }
});

document.addEventListener('keyup', ({key}) => {
    switch(key) {
        case 'z':
            punchPressed = false;
            break;
        case 'x':
            firePressed = false;
            break;
        case ' ':
            kickPressed = false;
            break;
        case 'ArrowUp':
            jumpPressed = false;
            break;
        case 'ArrowLeft':
            leftPressed = false;
            if(moving !== 'right') {
                player.move = 0;
                if(not()) player.state = stand;
            }
            if(rightPressed) {
                goRight();
            }
            break;
        case 'ArrowRight':
            rightPressed = false;
            if(moving !== 'left') {
                player.move = 0;
                if(not()) player.state = stand;
            }
            if(leftPressed) {
                goLeft();
            }
            break;

    }
});

const goLeft = () => {
    moving = 'left';
    if(player.direction === 'right') {
        player.move = -1;
        if(not()) player.state = walking;
    }
    player.move = -1;
    if(not()) player.state = walkingBackward;
}

const goRight = () => {
    moving = 'right';
    if(player.direction === 'right') {
        player.move = 1;
        if(not()) player.state = walkingBackward;
    }
    player.move = 1;
    if(not()) player.state = walking;
}

const not = () => ![jumping, falling, highKick, lowPunch, fireBall, win, fall].includes(player.state);