// Game State Variables
let gameState = {
    mode: null,
    singlePlayer: {
        active: false,
        reactionStart: null,
        bestTime: localStorage.getItem('bestTime') || null,
        lastTime: null
    },
    multiPlayer: {
        active: false,
        player1Score: 0,
        player2Score: 0,
        currentWinner: null,
        roundActive: false
    },
    memoryGame: {
        active: false,
        level: 1,
        score: 0,
        pattern: [],
        playerInput: [],
        showingPattern: false,
        replayCount: 2,
        bestLevel: localStorage.getItem('bestLevel') || 1,
        boxes: []
    }
};

// DOM Elements
const gameSelector = document.getElementById('game-selector');
const singlePlayerScreen = document.getElementById('single-player');
const multiPlayerScreen = document.getElementById('multi-player');
const memoryGameScreen = document.getElementById('memory-game');

// Single Player Elements
const startSingleBtn = document.getElementById('start-single');
const backFromSingleBtn = document.getElementById('back-from-single');
const reactionBox = document.getElementById('reaction-box');
const countdown = document.getElementById('countdown');
const bestTimeDisplay = document.getElementById('best-time');
const lastTimeDisplay = document.getElementById('last-time');

// Multi Player Elements
const startMultiBtn = document.getElementById('start-multi');
const backFromMultiBtn = document.getElementById('back-from-multi');
const resetMultiBtn = document.getElementById('reset-multi');
const player1Box = document.getElementById('player1-box');
const player2Box = document.getElementById('player2-box');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');
const multiCountdown = document.getElementById('multi-countdown');
const winnerAnnouncement = document.getElementById('winner-announcement');
const winnerText = document.getElementById('winner-text');

// Memory Game Elements
const startMemoryBtn = document.getElementById('start-memory');
const backFromMemoryBtn = document.getElementById('back-from-memory');
const replayMemoryBtn = document.getElementById('replay-memory');
const memoryBoard = document.getElementById('memory-board');
const currentLevelDisplay = document.getElementById('current-level');
const memoryScoreDisplay = document.getElementById('memory-score');
const replayCountDisplay = document.getElementById('replay-count');
const bestLevelDisplay = document.getElementById('best-level');
const memoryStatus = document.getElementById('memory-status');

// Initialize the game
function init() {
    // Load saved data
    if (gameState.singlePlayer.bestTime) {
        bestTimeDisplay.textContent = `${gameState.singlePlayer.bestTime}ms`;
    }
    
    if (gameState.memoryGame.bestLevel) {
        bestLevelDisplay.textContent = gameState.memoryGame.bestLevel;
    }
    
    // Add event listeners for game mode selection
    document.getElementById('option1').addEventListener('click', () => switchMode('single'));
    document.getElementById('option2').addEventListener('click', () => switchMode('multi'));
    document.getElementById('option3').addEventListener('click', () => switchMode('memory'));
    
    // Single player event listeners
    startSingleBtn.addEventListener('click', startSinglePlayerGame);
    backFromSingleBtn.addEventListener('click', () => switchMode(null));
    reactionBox.addEventListener('click', handleReactionClick);
    
    // Multiplayer event listeners
    startMultiBtn.addEventListener('click', startMultiPlayerRound);
    backFromMultiBtn.addEventListener('click', () => switchMode(null));
    resetMultiBtn.addEventListener('click', resetMultiplayerScores);
    player1Box.addEventListener('click', () => handlePlayerClick(1));
    player2Box.addEventListener('click', () => handlePlayerClick(2));
    
    // Memory game event listeners
    startMemoryBtn.addEventListener('click', startMemoryLevel);
    backFromMemoryBtn.addEventListener('click', () => switchMode(null));
    replayMemoryBtn.addEventListener('click', replayMemoryPattern);
    
    // Initialize memory board
    initializeMemoryBoard();
}

// Switch between game modes
function switchMode(mode) {
    // Hide all screens
    gameSelector.classList.add('hidden');
    singlePlayerScreen.classList.add('hidden');
    multiPlayerScreen.classList.add('hidden');
    memoryGameScreen.classList.add('hidden');
    
    // Reset game states
    resetSinglePlayer();
    resetMultiPlayer();
    resetMemoryGame();
    
    // Show selected screen
    if (mode === null) {
        gameSelector.classList.remove('hidden');
    } else if (mode === 'single') {
        singlePlayerScreen.classList.remove('hidden');
        gameState.mode = 'single';
    } else if (mode === 'multi') {
        multiPlayerScreen.classList.remove('hidden');
        gameState.mode = 'multi';
        updateMultiplayerScores();
    } else if (mode === 'memory') {
        memoryGameScreen.classList.remove('hidden');
        gameState.mode = 'memory';
        updateMemoryDisplay();
    }
}

// ========== SINGLE PLAYER GAME ==========
function startSinglePlayerGame() {
    if (gameState.singlePlayer.active) return;
    
    gameState.singlePlayer.active = true;
    startSingleBtn.disabled = true;
    reactionBox.classList.remove('active');
    reactionBox.querySelector('.reaction-text').textContent = 'Wait for it...';
    
    // Random delay between 2-5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000;
    
    // Countdown sequence
    countdown.textContent = 'Get Ready...';
    
    setTimeout(() => {
        countdown.textContent = '3';
    }, 1000);
    
    setTimeout(() => {
        countdown.textContent = '2';
    }, 2000);
    
    setTimeout(() => {
        countdown.textContent = '1';
    }, 3000);
    
    setTimeout(() => {
        countdown.textContent = 'GO!';
        reactionBox.classList.add('active');
        reactionBox.querySelector('.reaction-text').textContent = 'CLICK NOW!';
        gameState.singlePlayer.reactionStart = Date.now();
    }, 3000 + delay);
}

function handleReactionClick() {
    if (!gameState.singlePlayer.active || !gameState.singlePlayer.reactionStart) return;
    
    const reactionTime = Date.now() - gameState.singlePlayer.reactionStart;
    gameState.singlePlayer.lastTime = reactionTime;
    
    // Update best time if applicable
    if (!gameState.singlePlayer.bestTime || reactionTime < gameState.singlePlayer.bestTime) {
        gameState.singlePlayer.bestTime = reactionTime;
        localStorage.setItem('bestTime', reactionTime);
        bestTimeDisplay.textContent = `${reactionTime}ms`;
    }
    
    lastTimeDisplay.textContent = `${reactionTime}ms`;
    
    // Show reaction time
    reactionBox.querySelector('.reaction-text').textContent = `${reactionTime}ms`;
    
    // Reset game state
    gameState.singlePlayer.active = false;
    gameState.singlePlayer.reactionStart = null;
    startSingleBtn.disabled = false;
    
    // Reset after 2 seconds
    setTimeout(() => {
        if (!gameState.singlePlayer.active) {
            reactionBox.classList.remove('active');
            reactionBox.querySelector('.reaction-text').textContent = 'Wait for it...';
            countdown.textContent = 'Get Ready...';
        }
    }, 2000);
}

function resetSinglePlayer() {
    gameState.singlePlayer.active = false;
    gameState.singlePlayer.reactionStart = null;
    startSingleBtn.disabled = false;
    reactionBox.classList.remove('active');
    reactionBox.querySelector('.reaction-text').textContent = 'Wait for it...';
    countdown.textContent = 'Get Ready...';
}

// ========== MULTIPLAYER GAME ==========
function startMultiPlayerRound() {
    if (gameState.multiPlayer.roundActive) return;
    
    gameState.multiPlayer.roundActive = true;
    startMultiBtn.disabled = true;
    winnerAnnouncement.classList.add('hidden');
    
    // Reset boxes
    player1Box.classList.remove('active');
    player2Box.classList.remove('active');
    
    // Countdown sequence
    multiCountdown.textContent = 'Get Ready...';
    
    setTimeout(() => {
        multiCountdown.textContent = '3';
    }, 1000);
    
    setTimeout(() => {
        multiCountdown.textContent = '2';
    }, 2000);
    
    setTimeout(() => {
        multiCountdown.textContent = '1';
    }, 3000);
    
    // Random delay between 1-4 seconds after countdown
    const delay = Math.floor(Math.random() * 3000) + 1000;
    
    setTimeout(() => {
        multiCountdown.textContent = 'GO!';
        
        // Randomly decide which player's box lights up (or both)
        const random = Math.random();
        
        if (random < 0.45) {
            // Player 1's box lights up
            player1Box.classList.add('active');
        } else if (random < 0.9) {
            // Player 2's box lights up
            player2Box.classList.add('active');
        } else {
            // Both boxes light up (tie possible)
            player1Box.classList.add('active');
            player2Box.classList.add('active');
        }
    }, 3000 + delay);
}

function handlePlayerClick(player) {
    if (!gameState.multiPlayer.roundActive) return;
    
    const player1Active = player1Box.classList.contains('active');
    const player2Active = player2Box.classList.contains('active');
    
    // Check if the clicked player's box is active
    if ((player === 1 && player1Active) || (player === 2 && player2Active)) {
        // Player clicked correctly
        gameState.multiPlayer.currentWinner = player;
        
        // Update score
        if (player === 1) {
            gameState.multiPlayer.player1Score++;
        } else {
            gameState.multiPlayer.player2Score++;
        }
        
        // Update display
        updateMultiplayerScores();
        
        // Show winner
        showWinner(player);
    } else {
        // Player clicked too early
        gameState.multiPlayer.currentWinner = player === 1 ? 2 : 1;
        
        // Update score for the other player
        if (player === 1) {
            gameState.multiPlayer.player2Score++;
        } else {
            gameState.multiPlayer.player1Score++;
        }
        
        // Update display
        updateMultiplayerScores();
        
        // Show winner (the other player)
        showWinner(player === 1 ? 2 : 1);
    }
    
    // End round
    gameState.multiPlayer.roundActive = false;
    startMultiBtn.disabled = false;
    
    // Reset boxes after a delay
    setTimeout(() => {
        if (!gameState.multiPlayer.roundActive) {
            player1Box.classList.remove('active');
            player2Box.classList.remove('active');
            multiCountdown.textContent = 'Get Ready...';
        }
    }, 3000);
}

function showWinner(player) {
    const winnerName = player === 1 ? 'Player 1' : 'Player 2';
    const winnerColor = player === 1 ? '#ff4a4a' : '#4a6bff';
    
    winnerText.textContent = `${winnerName} Wins!`;
    winnerText.style.color = winnerColor;
    winnerAnnouncement.classList.remove('hidden');
}

function updateMultiplayerScores() {
    player1ScoreDisplay.textContent = gameState.multiPlayer.player1Score;
    player2ScoreDisplay.textContent = gameState.multiPlayer.player2Score;
}

function resetMultiplayerScores() {
    gameState.multiPlayer.player1Score = 0;
    gameState.multiPlayer.player2Score = 0;
    gameState.multiPlayer.currentWinner = null;
    gameState.multiPlayer.roundActive = false;
    updateMultiplayerScores();
    winnerAnnouncement.classList.add('hidden');
    player1Box.classList.remove('active');
    player2Box.classList.remove('active');
    multiCountdown.textContent = 'Get Ready...';
    startMultiBtn.disabled = false;
}

function resetMultiPlayer() {
    resetMultiplayerScores();
}

// ========== MEMORY GAME ==========
function initializeMemoryBoard() {
    // Clear the board
    memoryBoard.innerHTML = '';
    
    // For memory game, we'll dynamically create boxes based on level
    gameState.memoryGame.boxes = [];
}

function updateMemoryBoard() {
    // Clear the board
    memoryBoard.innerHTML = '';
    gameState.memoryGame.boxes = [];
    
    // Calculate number of boxes for current level
    // Level 1: 3 boxes, Level 2: 4 boxes, etc.
    const boxesCount = gameState.memoryGame.level + 2;
    
    // Determine grid layout based on number of boxes
    let gridCols;
    if (boxesCount <= 4) {
        gridCols = 2;
    } else if (boxesCount <= 9) {
        gridCols = 3;
    } else if (boxesCount <= 16) {
        gridCols = 4;
    } else {
        gridCols = 5;
    }
    
    // Apply grid layout
    memoryBoard.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    
    // Create boxes for current level
    for (let i = 0; i < boxesCount; i++) {
        const box = document.createElement('div');
        box.className = 'memory-box';
        box.dataset.index = i;
        box.textContent = i + 1;
        
        box.addEventListener('click', () => handleMemoryBoxClick(i));
        
        memoryBoard.appendChild(box);
        gameState.memoryGame.boxes.push(box);
    }
}

function startMemoryLevel() {
    if (gameState.memoryGame.showingPattern) return;
    
    // Reset player input
    gameState.memoryGame.playerInput = [];
    gameState.memoryGame.showingPattern = true;
    gameState.memoryGame.replayCount = 2;
    
    updateMemoryDisplay();
    updateMemoryBoard(); // Update board for current level
    memoryStatus.textContent = 'Watch the pattern...';
    startMemoryBtn.disabled = true;
    replayMemoryBtn.disabled = false;
    
    // Generate pattern for current level
    generatePattern();
    
    // Show pattern
    showPattern();
}

function generatePattern() {
    gameState.memoryGame.pattern = [];
    
    // For level 1: 3 boxes light up, level 2: 4 boxes, etc.
    const boxesToLight = gameState.memoryGame.level + 2;
    
    // When we reach level 8 (10 boxes), from level 10 onwards, 
    // we only light up 10 boxes even though there are more boxes on screen
    let boxesToActuallyLight = boxesToLight;
    if (boxesToLight > 10) {
        // Every 10 levels, increase difficulty but cap at 10 boxes lighting up
        const difficultyLevel = Math.floor((gameState.memoryGame.level - 8) / 10) + 1;
        boxesToActuallyLight = Math.min(10 + difficultyLevel, 10); // Cap at 10
    }
    
    // Generate random pattern
    // For early levels (up to 8): all boxes light up in random order
    // For later levels: random selection of boxesToActuallyLight boxes from all available boxes
    if (boxesToLight <= 10) {
        // Early levels: all boxes light up in random order
        const allBoxes = Array.from({length: boxesToLight}, (_, i) => i);
        // Shuffle the array
        for (let i = allBoxes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allBoxes[i], allBoxes[j]] = [allBoxes[j], allBoxes[i]];
        }
        gameState.memoryGame.pattern = allBoxes;
    } else {
        // Later levels: random selection of boxes (up to 10)
        const availableBoxes = Array.from({length: boxesToLight}, (_, i) => i);
        
        // Randomly select boxesToActuallyLight boxes
        while (gameState.memoryGame.pattern.length < boxesToActuallyLight) {
            const randomIndex = Math.floor(Math.random() * availableBoxes.length);
            const selectedBox = availableBoxes[randomIndex];
            
            if (!gameState.memoryGame.pattern.includes(selectedBox)) {
                gameState.memoryGame.pattern.push(selectedBox);
            }
        }
    }
}

function showPattern() {
    // Reset all boxes
    gameState.memoryGame.boxes.forEach(box => {
        box.classList.remove('active', 'selected', 'correct', 'incorrect');
    });
    
    // Show pattern with delays
    gameState.memoryGame.pattern.forEach((boxIndex, i) => {
        setTimeout(() => {
            const box = gameState.memoryGame.boxes[boxIndex];
            if (box) {
                box.classList.add('active');
                
                // Turn off after 800ms for early levels, faster for later levels
                const turnOffDelay = gameState.memoryGame.level >= 20 ? 600 : 
                                   gameState.memoryGame.level >= 10 ? 700 : 800;
                
                setTimeout(() => {
                    box.classList.remove('active');
                    
                    // After showing the entire pattern, enable player input
                    if (i === gameState.memoryGame.pattern.length - 1) {
                        setTimeout(() => {
                            gameState.memoryGame.showingPattern = false;
                            memoryStatus.textContent = 'Now repeat the pattern!';
                            startMemoryBtn.disabled = false;
                            
                            // Clear any lingering active states
                            gameState.memoryGame.boxes.forEach(box => {
                                box.classList.remove('active');
                            });
                        }, 500);
                    }
                }, turnOffDelay);
            }
        }, i * 1000);
    });
}

function handleMemoryBoxClick(index) {
    if (gameState.memoryGame.showingPattern || gameState.memoryGame.playerInput.length >= gameState.memoryGame.pattern.length) {
        return;
    }
    
    const box = gameState.memoryGame.boxes[index];
    
    // Add to player input
    gameState.memoryGame.playerInput.push(index);
    box.classList.add('selected');
    
    // Check if correct
    const expectedIndex = gameState.memoryGame.pattern[gameState.memoryGame.playerInput.length - 1];
    
    if (index === expectedIndex) {
        // Correct
        box.classList.remove('selected');
        box.classList.add('correct');
        
        // Check if pattern is complete
        if (gameState.memoryGame.playerInput.length === gameState.memoryGame.pattern.length) {
            // Level complete
            const levelBonus = gameState.memoryGame.level * 10;
            const speedBonus = Math.max(0, 100 - gameState.memoryGame.playerInput.length * 5);
            gameState.memoryGame.score += levelBonus + speedBonus;
            gameState.memoryGame.level++;
            
            // Update best level if applicable
            if (gameState.memoryGame.level > gameState.memoryGame.bestLevel) {
                gameState.memoryGame.bestLevel = gameState.memoryGame.level;
                localStorage.setItem('bestLevel', gameState.memoryGame.level);
                bestLevelDisplay.textContent = gameState.memoryGame.level;
            }
            
            updateMemoryDisplay();
            memoryStatus.textContent = `Level ${gameState.memoryGame.level - 1} complete! +${levelBonus + speedBonus} points`;
            memoryStatus.style.color = '#4aff4a';
            
            // Show celebration for level milestones
            if ((gameState.memoryGame.level - 1) % 10 === 0) {
                memoryStatus.textContent = `🎉 LEVEL ${gameState.memoryGame.level - 1} COMPLETE! 🎉 +${levelBonus + speedBonus} points`;
            }
            
            // Start next level after delay
            setTimeout(() => {
                startMemoryLevel();
            }, 2000);
        }
    } else {
        // Incorrect
        box.classList.remove('selected');
        box.classList.add('incorrect');
        memoryStatus.textContent = 'Wrong! Game Over.';
        memoryStatus.style.color = '#ff4a4a';
        
        // Highlight the correct box
        const correctBox = gameState.memoryGame.boxes[expectedIndex];
        if (correctBox) {
            correctBox.classList.add('correct');
        }
        
        // Reset game after delay
        setTimeout(() => {
            gameState.memoryGame.level = 1;
            gameState.memoryGame.score = 0;
            updateMemoryDisplay();
            memoryStatus.textContent = 'Click "Start Level" to begin!';
            memoryStatus.style.color = '#4a6bff';
            
            // Reset all boxes
            gameState.memoryGame.boxes.forEach(box => {
                box.classList.remove('active', 'selected', 'correct', 'incorrect');
            });
        }, 3000);
    }
}

function replayMemoryPattern() {
    if (gameState.memoryGame.replayCount <= 0 || gameState.memoryGame.showingPattern) return;
    
    gameState.memoryGame.replayCount--;
    gameState.memoryGame.showingPattern = true;
    updateMemoryDisplay();
    memoryStatus.textContent = 'Replaying pattern...';
    startMemoryBtn.disabled = true;
    replayMemoryBtn.disabled = gameState.memoryGame.replayCount <= 0;
    
    showPattern();
}

function updateMemoryDisplay() {
    currentLevelDisplay.textContent = gameState.memoryGame.level;
    memoryScoreDisplay.textContent = gameState.memoryGame.score;
    replayCountDisplay.textContent = gameState.memoryGame.replayCount;
    replayMemoryBtn.textContent = `Replay Pattern (${gameState.memoryGame.replayCount} left)`;
    replayMemoryBtn.disabled = gameState.memoryGame.replayCount <= 0;
    
    if (gameState.memoryGame.bestLevel) {
        bestLevelDisplay.textContent = gameState.memoryGame.bestLevel;
    }
    
    // Update instruction based on level
    const instructions = document.querySelector('#memory-game .instructions p');
    if (gameState.memoryGame.level <= 8) {
        instructions.textContent = `Memorize the pattern of all ${gameState.memoryGame.level + 2} boxes!`;
    } else {
        instructions.textContent = `Memorize the pattern of 10 boxes (from ${gameState.memoryGame.level + 2} total boxes)!`;
    }
}

function resetMemoryGame() {
    gameState.memoryGame.active = false;
    gameState.memoryGame.showingPattern = false;
    gameState.memoryGame.playerInput = [];
    gameState.memoryGame.pattern = [];
    startMemoryBtn.disabled = false;
    
    // Reset all boxes
    gameState.memoryGame.boxes.forEach(box => {
        box.classList.remove('active', 'selected', 'correct', 'incorrect');
    });
    
    updateMemoryDisplay();
    memoryStatus.textContent = 'Click "Start Level" to begin!';
    memoryStatus.style.color = '#4a6bff';
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', init);