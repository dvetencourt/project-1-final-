const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = 1000;
const HEIGHT = 600;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const player = new Fighter(50, 430,'kano','right'); //50
const enemy = new Fighter(875, 430,'subzero','left'); //875

let frameTimerPlayer = 0;
let frameTimerEnemy = 0;

const gameLoop = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    player.draw();
    enemy.draw();

    frameTimerPlayer++;
    frameTimerEnemy++;
    if(frameTimerPlayer > 6 || (player.state === highKick && frameTimerPlayer > 3)) {
        if(!player.end) {
            frameTimerPlayer = 0;
            player.changeFrame();
        }
    }
    if(frameTimerEnemy > 6 || (enemy.state === highKick && frameTimerEnemy > 3)) {
        if(!enemy.end) {
            frameTimerEnemy = 0;
            enemy.changeFrame();
        }
    }

    if(player.x > enemy.x) {
        player.direction = 'left';
        enemy.direction = 'right';
    } else {
        player.direction = 'right';
        enemy.direction = 'left';
    }

    if(enemy.end && player.end) {
        document.querySelector('.winlose').innerHTML = player.state === win ? 'Kano won!' : 'Subzero won!';
        document.querySelector('.winlose').classList.remove('hide');
        return;
    }
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);