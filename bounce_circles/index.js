'use strict'

const canvas = document.querySelector('canvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

var c = canvas.getContext('2d')

//create mouse obj
var mouse = {
    x: undefined,
    y: undefined
}

//reads the mouse movement
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x
    mouse.y = event.y
})

//ramdomize de circle colors
var circleColorArray = [
    '#8C1F28',
    '#591C21',
    '#044040',
    '#D92525',
    '#F2F2F2'
]

//resizes the canvas to window size
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    init()
})

//create de circle class
function Circle(x, y, dx, dy, radius) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.minRadius = radius
    this.color = circleColorArray[Math.floor(Math.random() * circleColorArray.length)]

    this.draw = () => {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    this.moveAndBounce = () => {
        // let minRadius = 2
        let maxRadius = 40

        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx
        }

        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy
        }

        this.x += this.dx
        this.y += this.dy

        //interactivity
        if (mouse.x - this.x < 80 && mouse.x - this.x > -80 && mouse.y - this.y < 80 && mouse.y - this.y > -80) {
            if (this.radius < maxRadius) {
                this.radius += 0.5
            }
        } else if (this.radius > this.minRadius) {
            this.radius -= 0.5
        }
    }
}

//create all the circles
var circleArray = []


//recreate all the circles to fill the canvas size
const init = () => {
    circleArray = []
    for (var i = 0; i < 1000; i++) {
        var radius = Math.random() * 3 + 1
        var x = Math.random() * (innerWidth - radius * 2) + radius
        var y = Math.random() * (innerHeight - radius * 2) + radius
        var dx = (Math.random() - 0.5) * 2
        var dy = (Math.random() - 0.5) * 2

        circleArray.push(new Circle(x, y, dx, dy, radius))
    }
}


//makes the loop o refreshing the window
const animate = () => {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].draw()
        circleArray[i].moveAndBounce()
    }


}

init()
animate()