'use strict'

//the attack box collision shape and detector
const retangularCollision = ({ rectangle1, rectangle2 }) => {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + enemy.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

const determineWinner = ({player, enemy, timerId}) => {
    clearTimeout(timerId)
    const result = document.querySelector('#displayText')
    result.style.display = 'grid'
    if (player.health === enemy.health) {
        result.innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        result.innerHTML = 'Player 1 Wins'
    }else {
        result.innerHTML = 'Player 2 Wins'
    }
}

let timer = 60
let timerId
const decreasetimer = () => {
    if (timer > 0) {
        timerId = setTimeout(decreasetimer, 1000)
        timer--
        const timerNum = document.querySelector('#timer')
        timerNum.innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerId}) 
    }
}