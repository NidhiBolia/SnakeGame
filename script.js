// HTML elements
const board=document.getElementById("game-board");
const text=document.getElementById("text");
const logo=document.getElementById("logo");
const score=document.getElementById("score");
const highScoreElement=document.getElementById("highscore");
let snake=[
    {x:9,y:10}
];
let gridSize=20;
let food=generateFood();
let direction='up';
let gameInterval;
let gameSpeedDelay=200;
let highScore=0;
let start=false;
function draw(){
    board.innerHTML='';
    drawSnake();
    drawFood();
    updateScore();
    updateHighScore();
}
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    }); 
}
function createGameElement(tag,className){
    const element=document.createElement(tag);
    element.className=className;
    return element;
}
function setPosition(element,position){
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
    board.appendChild(element);
}
// draw();
function drawFood(){
    if(start){
        const foodElement=createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }
}
function generateFood(){
    const x=Math.floor(Math.random()*gridSize)+1;
    const y=Math.floor(Math.random()*gridSize)+1;
    return {x,y};
}

// drawFood();
function move(){
    const head={...snake[0]};
    switch(direction){
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head);
    // snake.pop();
    if(head.x===food.x && head.y===food.y){
        food=generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval=setInterval(()=>{
            move();
            collision();
            draw();
        },gameSpeedDelay);
    }else{
        snake.pop();
    }
}

function Start(){
    start=true;
    text.style.display='none';
    logo.style.display='none';
    gameInterval=setInterval(()=>{
        move();
        collision();
        draw();
    },gameSpeedDelay);
}

// keypress event listener
function handleKeyPress(event){
    if((!start && event.code ==='Space')||(!start && event.key===' ')){
        Start();
    }else{
        switch(event.key){
            case 'ArrowUp':
                direction='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                direction='right';
                break;
        }
    }
}

function increaseSpeed(){
    if(gameSpeedDelay>150){
        gameSpeedDelay-=5;
    }else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }else if(gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
}
function collision(){
    const head=snake[0];
    if(head.x<1 || head.y>gridSize || head.x>gridSize || head.y<1){
        resetGame();
    }
    for (let i=1;i<snake.length;i++){
        if(head.x===snake[i].x && head.y===snake[i].y){
           resetGame();
        }
    }
}
function resetGame(){
    updateHighScore();
    stopGame();
    snake=[{x:10,y:10}];
    food=generateFood();
    direction='right';
    gameSpeedDelay=200;
    updateScore();
}
function updateScore(){
    const CurrentScore=snake.length-1;
    score.textContent=CurrentScore.toString().padStart(3,'0');
}
function stopGame(){
    clearInterval(gameInterval);
    start=false;
    text.style.display='block';
    logo.style.display='block';
}
function updateHighScore(){
    const CurrentScore=snake.length-1;
        if(CurrentScore>highScore){
            highScore=CurrentScore;
            highScoreElement.textContent=highScore.toString().padStart(3,'0');
    }
    highScoreElement.style.display='block';
}
document.addEventListener('keydown',handleKeyPress);
