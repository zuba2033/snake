'use strict';

// stopwatch

const minElem = document.querySelectorAll('.min'),
    secElem = document.querySelectorAll('.sec'),
    msElem = document.querySelectorAll('.ms');

let min = 0, sec = 0, ms = 0, interval;

interval = setInterval(stopwatch, 10);

function stopwatch() {
    ms++;

    msElem.forEach(elem => {
        elem.textContent = styleNum(ms);
    });
    
    if (ms > 99) {
        sec++;
        ms = 0;
    }

    secElem.forEach(elem => {
        elem.textContent = styleNum(sec);
    });

    if (sec > 60) {
        min++;
        sec = 0;
    }

    minElem.forEach(elem => {
        elem.textContent = styleNum(min);
    });

}

function clearStopwatch() {
    clearInterval(interval);
    sec = 0;
    ms = 0;
    min = 0;
    interval = setInterval(stopwatch, 10);
}

function styleNum(num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return num
    }
}



// snake

const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    gridSize = 16,
    score = document.querySelector('.score'),
    current = score.querySelector('.current span'),
    best = score.querySelector('.best span'),
    attempt = score.querySelector('.try span'),
    modalScore = document.querySelector('.modal__text span'),
    modal = document.querySelector('.modal');

let count = 0,
    currentScore = 0,
    attemptNum = 1,
    bestScore;


if (localStorage.getItem('bestScore')) {
    bestScore = +localStorage.getItem('bestScore');
} else {
    bestScore = 0;
}

best.textContent = bestScore;

const snake = {
    x: 160,
    y: 160,
    
    dx: gridSize,
    dy: 0,

    body: [],
    maxSegments: 4
};

const food = {
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function loop() {


    let requestLoop = requestAnimationFrame(loop);

    if (++count < 4) return;

    count = 0;
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
        snake.x = canvas.width - gridSize;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - gridSize;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.body.unshift({
        x: snake.x,
        y: snake.y
    });

    if (snake.body.length > snake.maxSegments) {
        snake.body.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, gridSize, gridSize);

    context.fillStyle = 'green';

    snake.body.forEach((segment, index) => {

        context.fillRect(segment.x, segment.y, gridSize - 1, gridSize - 1);

        if ( segment.x == food.x && segment.y == food.y) {

            snake.maxSegments++;

            currentScore++;
            current.textContent = currentScore;

            food.x = getRandomInt(0, 25) * gridSize;
            food.y = getRandomInt(0, 25) * gridSize;
        }

        for(let i = index + 1; i < snake.body.length; i++) {
            if (snake.x == snake.body[i].x && snake.y == snake.body[i].y ) {

                modalScore.textContent = currentScore;
                
                openModal();
                clearInterval(interval);
                cancelAnimationFrame(requestLoop);

                attemptNum++
                attempt.textContent = attemptNum;

                if (currentScore > bestScore) {
                   bestScore = currentScore; 
                   localStorage.setItem('bestScore', bestScore);
                   best.textContent = bestScore; 
                }

                currentScore = 0;
                current.textContent = currentScore;

                snake.x = 160;
                snake.y = 160;
                
                snake.dx =  gridSize;
                snake.dy =  0;

                snake.body = [];
                snake.maxSegments = 4;

                food.x = getRandomInt(0, 25) * gridSize;
                food.y = getRandomInt(0, 25) * gridSize;
            }
        }

    });
};



function openModal() {
    
    modal.classList.add('show');
    modal.classList.remove('hide');

    document.body.style.cssText = `
        height: 100vh;
        overflow: hidden;
        padding-right: 15px;
        top: ${document.scrollTop}px;
    `;
}

function closeModal() {

    modal.classList.add('hide');
    modal.classList.remove('show');

    document.body.style.cssText = '';
}

document.addEventListener('keydown', e => {

    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -gridSize;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -gridSize;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = gridSize;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = gridSize;
        snake.dx = 0;
    }

});

modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
        closeModal();
        clearStopwatch();
        requestAnimationFrame(loop);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) { 
        clearStopwatch();
        requestAnimationFrame(loop);
        closeModal();
    }
});

requestAnimationFrame(loop);








