// ===============================
// المتغيرات الأساسية
// ===============================
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');
const playerColorSelect = document.getElementById('playerColor');

const gameContainer = document.getElementById('gameContainer');
const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');

const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const coinsDisplay = document.getElementById('coinsCollected');
const enemiesDisplay = document.getElementById('enemiesDodged');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('highScore');

const restartBtn = document.getElementById('restartBtn');

const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const finalCoins = document.getElementById('finalCoins');
const finalEnemies = document.getElementById('finalEnemies');
const finalHighScore = document.getElementById('finalHighScore');
const finalTime = document.getElementById('finalTime');
const playAgainBtn = document.getElementById('playAgainBtn');
const goToStartBtn = document.getElementById('goToStartBtn');

let playerPos = 180;
let playerSpeed = 15;

let score = 0;
let coinsCollected = 0;
let enemiesDodged = 0;
let level = 1;
let timeElapsed = 0;

let enemySpeed = 3;
let coinSpeed = 2;

let enemies = [];
let coins = [];

let gameInterval;
let timerInterval;

let isGameOver = false;

// أفضل سجل باستخدام localStorage
let highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.textContent = highScore;

// ===============================
// بدء اللعبة
// ===============================
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    // إعداد اللاعب
    player.style.backgroundColor = playerColorSelect.value;

    // إعداد مستوى الصعوبة
    const difficulty = difficultySelect.value;
    switch(difficulty){
        case 'easy':
            enemySpeed = 2;
            coinSpeed = 1.5;
            break;
        case 'medium':
            enemySpeed = 3;
            coinSpeed = 2;
            break;
        case 'hard':
            enemySpeed = 4;
            coinSpeed = 3;
            break;
    }

    startGame();
});

// ===============================
// حركة اللاعب بالكيبورد
// ===============================
document.addEventListener('keydown', (e) => {
    if(isGameOver) return;
    if(e.key === 'ArrowLeft' && playerPos > 0) playerPos -= playerSpeed;
    if(e.key === 'ArrowRight' && playerPos < 360) playerPos += playerSpeed;
    player.style.left = playerPos + 'px';
});

// ===============================
// حركة اللاعب باللمس (Swipe)
// ===============================
let touchStartX = 0;

gameArea.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

gameArea.addEventListener('touchmove', (e) => {
    if(isGameOver) return;
    let touchX = e.touches[0].clientX;
    let diff = touchX - touchStartX;
    playerPos += diff / 5; // تعديل السرعة حسب السحب
    if(playerPos < 0) playerPos = 0;
    if(playerPos > 360) playerPos = 360;
    player.style.left = playerPos + 'px';
    touchStartX = touchX;
});

// ===============================
// إنشاء أعداء ونقود
// ===============================
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = Math.floor(Math.random() * 370) + 'px';
    enemy.style.top = '-30px';
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

function createCoin() {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = Math.floor(Math.random() * 370) + 'px';
    coin.style.top = '-30px';
    gameArea.appendChild(coin);
    coins.push(coin);
}

// ===============================
// تحديث اللعبة
// ===============================
function updateGame() {
    if(isGameOver) return;

    // تحريك الأعداء
    for(let i=enemies.length-1; i>=0; i--){
        const enemy = enemies[i];
        let top = parseInt(enemy.style.top);
        top += enemySpeed;
        enemy.style.top = top + 'px';
        const left = parseInt(enemy.style.left);

        // الاصطدام باللاعب
        if(top + 30 >= 560 && left + 30 > playerPos && left < playerPos + 40){
            endGame();
        }

        // تجاوز العدو
        if(top > 600){
            gameArea.removeChild(enemy);
            enemies.splice(i, 1);
            score++;
            enemiesDodged++;
            scoreDisplay.textContent = score;
            enemiesDisplay.textContent = enemiesDodged;

            // زيادة المستوى كل 10 نقاط
            if(score % 10 === 0){
                level++;
                levelDisplay.textContent = level;
                enemySpeed += 0.5;
                coinSpeed += 0.2;
            }
        }
    }

    // تحريك النقود
    for(let i=coins.length-1; i>=0; i--){
        const coin = coins[i];
        let top = parseInt(coin.style.top);
        top += coinSpeed;
        coin.style.top = top + 'px';
        const left = parseInt(coin.style.left);

        // جمع النقود
        if(top + 30 >= 560 && left + 30 > playerPos && left < playerPos + 40){
            coinsCollected++;
            score += 5;
            scoreDisplay.textContent = score;
            coinsDisplay.textContent = coinsCollected;
            gameArea.removeChild(coin);
            coins.splice(i,1);
        }

        // إزالة النقود إذا خرجت
        if(top > 600){
            gameArea.removeChild(coin);
            coins.splice(i,1);
        }
    }

    requestAnimationFrame(updateGame);
}

// ===============================
// المؤقت الرقمي
// ===============================
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = timeElapsed;
    }, 1000);
}

// ===============================
// بدء اللعبة
// ===============================
function startGame(){
    isGameOver = false;
    playerPos = 180;
    score = 0;
    coinsCollected = 0;
    enemiesDodged = 0;
    level = 1;
    timeElapsed = 0;

    enemies = [];
    coins = [];

    scoreDisplay.textContent = score;
    coinsDisplay.textContent = coinsCollected;
    enemiesDisplay.textContent = enemiesDodged;
    levelDisplay.textContent = level;
    timerDisplay.textContent = timeElapsed;

    // توليد الأعداء والنقود
    gameInterval = setInterval(createEnemy, 1500);
    setInterval(createCoin, 3000);

    startTimer();
    updateGame();
}

// ===============================
// إنهاء اللعبة
// ===============================
function endGame(){
    isGameOver = true;

    clearInterval(gameInterval);
    clearInterval(timerInterval);

    // إزالة كل الأعداء والنقود
    enemies.forEach(e => gameArea.removeChild(e));
    coins.forEach(c => gameArea.removeChild(c));
    enemies = [];
    coins = [];

    // تحديث أفضل سجل
    if(score > highScore){
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    finalScore.textContent = score;
    finalCoins.textContent = coinsCollected;
    finalEnemies.textContent = enemiesDodged;
    finalHighScore.textContent = highScore;
    finalTime.textContent = timeElapsed;

    gameOverScreen.classList.remove('hidden');
}

// ===============================
// أزرار إعادة اللعب والعودة للشاشة الرئيسية
// ===============================
playAgainBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startGame();
});

goToStartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameContainer.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

restartBtn.addEventListener('click', () => {
    startGame();
});