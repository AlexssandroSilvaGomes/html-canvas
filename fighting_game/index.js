'use strict'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './resources/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './resources/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './resources/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './resources/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './resources/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './resources/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './resources/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './resources/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './resources/samuraiMack/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './resources/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 40
        },
        width: 160,
        height: 40
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './resources/Kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 168
    },
    sprites: {
        idle: {
            imageSrc: './resources/Kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './resources/Kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './resources/Kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './resources/Kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './resources/Kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './resources/Kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './resources/Kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 60
        },
        width: 170,
        height: 40
    }
})


let lastKey

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

//movement events
window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            //players keys
            case "d":
                keys.d.pressed = true
                player.lastKey = 'd'
                break;
            case "a":
                keys.a.pressed = true
                player.lastKey = 'a'
                break;
            case "w":
                player.velocity.y = -20
                break;
            case 's':
                player.attack()
                break;
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            //enemys keys
            case "ArrowRight":
               keys.ArrowRight.pressed = true
               enemy.lastKey = 'ArrowRight'
               break;
           case "ArrowLeft":
               keys.ArrowLeft.pressed = true
               enemy.lastKey = 'ArrowLeft'
               break;
           case "ArrowUp":
               enemy.velocity.y = -20
               break;
           case 'ArrowDown':
               enemy.attack()
           default:
               break;
       }
    }  
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //players keys
        case "d":
            keys.d.pressed = false
            break;
        case "a":
            keys.a.pressed = false
            break;

        //enemys keys
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break;
        default:
            break;
    }
})

decreasetimer()

const animate = () => {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, innerWidth, innerHeight)

    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, innerWidth, innerHeight)
    player.update()
    enemy.update()

    //player movement
    player.velocity.x = 0

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprites('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprites('run')
    } else {
        player.switchSprites('idle')
    }

    //player jumping
    if (player.velocity.y < 0) {
        player.switchSprites('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprites('fall')
    }

    //enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprites('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprites('run')
    } else {
        enemy.switchSprites('idle')
    }

    //enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprites('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprites('fall')
    }

    //detect for collision
    //player attack & enemy gets hit
    if (
        retangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false

        // const enemyHealth = document.querySelector('#enemyHealth')
        // enemyHealth.style.width = enemy.health + '%'

        //enemy health decrease animation at gsap lib 
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    //enemy attack & player gets hit
    if (

        retangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        player.takeHit()
        enemy.isAttacking = false
        
        // const playerHealth = document.querySelector('#playerHealth')
        // playerHealth.style.width = player.health + '%'
        //player health decrease animation at gsap lib
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //end the game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()