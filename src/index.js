
// Crear paredes
let player = new Player(0, 0, document.getElementById('player'))
player.setInitialPosition()
let enemies
let timerId
let obstacles
let currentStage
let countDown

const canvas = {
  width: 640,
  height: 480
}


let level = 1
startGame(level)
setLife()


// COLISIONES
function colision (targetObj, collidedObj) {
  if ((targetObj.left < collidedObj.left + collidedObj.width) &&
    (targetObj.top < collidedObj.top + collidedObj.height) &&
    (collidedObj.left < targetObj.left + targetObj.width) &&
    (collidedObj.top < targetObj.top + targetObj.height)) {
    return true
  } else {
    return false
  }
}

function collisionCanvas (targetObj) {
  if (targetObj.top < 0 ||
    targetObj.left < 0 ||
    targetObj.left + targetObj.width > canvas.width ||
    targetObj.top + targetObj.height > canvas.height
  ) {
    return true
  } else {
    return false
  }
}

function collisionEnemies (targetObj, enemies) {
  for (let i = 0; i < enemies.length; i++) {
    if (colision(targetObj, enemies[i]) === true) {
      return true
    }
  }
  return false
}

function collisionObstacles (targetObj, obstacles) {
  for (let i = 0; i < obstacles.length; i++) {
    if (colision(targetObj, obstacles[i]) === true) {
      return true
    }
  }
  return false
}

function animate () {
  timerId = setInterval(function () {
    if (player.direction !== 0) {
      const playerNextPos = player.getNextPosition()

      if (collisionEnemies(playerNextPos, enemies) === true) {
        console.log('enemigo')
        gameOver()
      } else if (collisionCanvas(playerNextPos) === true) {
        console.log('canvas')
      } else if (colision(playerNextPos, currentStage.goal) === true) {
        console.log('goal')
        winLevel()
      } else if (collisionObstacles(playerNextPos, obstacles) === true) {
        console.log('obstacle')
      } else {
        player.move()
      }
    }
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].getDirection !== 0) {
        const enemyNextPos = enemies[i].getNextPosition()
        if (colision(enemyNextPos, player)) {
          console.log('enemigo2')
          gameOver()
        } else {
          enemies[i].move()
        }
      }
    }
  }, 20)
}

function startGame (level) {
  const gameOverMsg = document.getElementById('gameOver')
  gameOverMsg.style.display = 'none'
  const nextLevelMsg = document.getElementById('nextLevel')
  nextLevelMsg.style.display = 'none'
  const overlay = document.getElementById('overlay')
  overlay.style.display = 'none'
  currentStage = STAGES[`stage${level}`]
  countDown = currentStage.time
  player.top = currentStage.player.top
  player.left = currentStage.player.left
  player.elem.style.top = player.top + 'px'
  player.elem.style.left = player.left + 'px'

  enemies = []
  for (let i = 0; i < currentStage.enemies.length; i++) {
    enemies.push(new Enemy(currentStage.enemies[i].top, currentStage.enemies[i].left, currentStage.enemies[i].id, currentStage.enemies[i].path, currentStage.enemies[i].distance))
    enemies[i].create()
  }

  document.getElementById('goal').style.top = currentStage.goal.top + 'px'
  document.getElementById('goal').style.left = currentStage.goal.left + 'px'

  obstacles = []

  for (let i = 0; i < currentStage.obstacles.length; i++) {
    obstacles.push(new Obstacle(
      currentStage.obstacles[i].top,
      currentStage.obstacles[i].left,
      currentStage.obstacles[i].width,
      currentStage.obstacles[i].height,
      currentStage.obstacles[i].id,
      currentStage.obstacles[i].clase
    ))
    obstacles[i].create()
  }
  animate()
  setTime()
}

function setLife () {
  let left = 0
  console.log(player)
  for (let i = 1; i <= player.lifes; i++) {
    const life = document.createElement('div')
    life.setAttribute('class', 'life')
    life.setAttribute('id', `life${i}`)
    life.style.left = left + 'px'
    const container = document.getElementById('life-container')
    container.appendChild(life)
    left += 20
  }
}

function gameOver () {
  clearInterval(timerId)
  const gameOverMsg = document.getElementById('gameOver')
  const overlay = document.getElementById('overlay')
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].destroyEnemy()
  }
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].destroy()
  }
  gameOverMsg.style.display = 'block'
  overlay.style.display = 'block'
}

function retry () {
  level = 1
  const container = document.getElementById('life-container')
  const lifeElement = document.getElementById(`life${player.lifes}`)
  container.removeChild(lifeElement)
  player.lifes--
  startGame(level)
}

function winLevel () {
  clearInterval(timerId)
  const winLevalMsg = document.getElementById('nextLevel')
  const overlay = document.getElementById('overlay')

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].destroyEnemy()
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].destroy()
  }
  winLevalMsg.style.display = 'block'
  overlay.style.display = 'block'
}

function setTime () {
  const timer = setInterval(function () {
    countDown--
    if (countDown === 0) {
      clearInterval(timer)
      document.getElementById('timer').innerText = ''
      gameOver()
    } else {
      document.getElementById('timer').innerText = 'time ' + countDown
    }
  }, 1000)
}

function nextLevel () {
  level++
  startGame(level)
}

// Player movements
window.addEventListener('keydown', function (e) {
  player.setDirection(e.code)
})

// Retry
const retryButton = document.getElementById('retry')
console.log(retryButton)
retryButton.onclick = retry

// Next Level
const nextLevelButton = document.getElementById('nextLevel')
console.log(nextLevelButton)
nextLevelButton.onclick = nextLevel
