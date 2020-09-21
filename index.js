const MAX_ENEMY = 2
const HEIGHT_ELEM = 100


const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    topScore = document.querySelector('#topScore'),
    record = document.querySelector('#record'),
    car = document.createElement('div')


const audio = document.createElement('audio')
// const audio = document.createElement('embed')
// audio.remove()
// audio.pause()
const crash = new Audio('./crash.mp3')

audio.src = 'audio.mp3'
audio.type = 'audio/mpeg'
audio.volume = 0.5
audio.loop = true
audio.controls = true
audio.style.cssText = `position: absolute; top: -100px; left: 100px`

car.classList.add('car')

gameArea.style.height = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM) * HEIGHT_ELEM

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
}

const setting = {
    start: false,
    score: 0,
    speed: 0,
    traffic: 0
}

function getQuantityElements(heightElement) {

    return (gameArea.offsetHeight / heightElement)
}



const startGame = (event) => {
    crash.pause()
    crash.currentTime = 0
    const target = event.target
    if (target === start) return
    switch (target.id) {
        case 'easy':
            setting.speed = 3
            setting.traffic = 4
            break;
        case 'medium':
            setting.speed = 5
            setting.traffic = 3
            break;
        case 'hard':
            setting.speed = 8
            setting.traffic = 2
            break;
    }

    start.classList.add('hide')
    gameArea.innerHTML = ''

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM) + 1; i++) {
        const line = document.createElement('div')

        line.classList.add('line')
        line.style.top = (i * HEIGHT_ELEM) + 'px'
        line.style.height = (HEIGHT_ELEM / 2) + 'px'
        line.y = i * HEIGHT_ELEM
        gameArea.appendChild(line)
    }

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
        const randomCar = Math.floor(Math.random() * MAX_ENEMY) + 1
        const enemy = document.createElement('div')
        enemy.classList.add('enemy')
        const periodEnemy = -HEIGHT_ELEM * setting.traffic * (i + 1)
        enemy.y = periodEnemy < 100 ? -100 * setting.traffic * (i + 1) : periodEnemy
        enemy.style.top = enemy.y + 'px'
        enemy.style.background = `transparent url(\'./image/enemy${randomCar}.png\') center / cover no-repeat`
        gameArea.appendChild(enemy)
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px'

    }
    setting.score = 0
    setting.start = true
    gameArea.appendChild(car)
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px'
    car.style.bottom = '15px'
    car.style.top = 'auto'
    document.body.append(audio)
    setting.x = car.offsetLeft
    setting.y = car.offsetTop
    requestAnimationFrame(playGame)
}

const playGame = () => {

    if (setting.start) {
        setting.score += setting.speed
        score.innerHTML = 'SCORE<br>' + setting.score
        moveRoad()
        moveEnemy()
        audio.play()
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed
        }

        car.style.left = setting.x + 'px'
        car.style.top = setting.y + 'px'
        requestAnimationFrame(playGame)
    } else {
        audio.pause()
    }
}

const startRun = (event) => {
    if (event.key !== "F5" && event.key !== 'F12') {
        if (keys.hasOwnProperty(event.key)) {
            event.preventDefault()
            keys[event.key] = true
        }
    }
}



const addLocalStorage = () => {
    const result = parseInt(localStorage.getItem('nfjs_score')) || 0

    if (setting.score > result) {
        localStorage.setItem('nfjs_score', setting.score)
        topScore.textContent = setting.score

    }

}

const stopRun = (event) => {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault()
        keys[event.key] = false
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line')
    lines.forEach(line => {
        line.y += setting.speed
        line.style.top = line.y + 'px'
        if (line.y > gameArea.offsetHeight) {
            line.y = -HEIGHT_ELEM
        }
    })
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy')
    enemy.forEach(item => {
        let carRect = car.getBoundingClientRect()
        let enemyRect = item.getBoundingClientRect()

        if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left &&
            carRect.left + 5 <= enemyRect.right && carRect.bottom >= enemyRect.top) {
            setting.start = false
            audio.pause()
            crash.play()
            crash.volume = 0.3
            console.log('ДТП');
            start.classList.remove('hide')
            start.style.top = score.offsetHeight + 'px'
            addLocalStorage()
        }
        item.y += setting.speed / 2
        item.style.top = item.y + 'px'

        if (item.y > gameArea.offsetHeight) {
            // const checkTop = [...enemy].every(item => item.offsetTop > HEIGHT_ELEM)

            // if(checkTop) {
            //     item.y = -HEIGHT_ELEM * setting.traffic
            // }
            item.y = -HEIGHT_ELEM * setting.traffic
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px'

        }

    })
}

record.addEventListener('click', () => {
    localStorage.clear()
    topScore.innerHTML = 0
})

start.addEventListener('click', startGame)
document.addEventListener('keydown', startRun)
document.addEventListener('keyup', stopRun)