class Particle {
    constructor(mass, x, y, velocityX, velocityY) {
        this.mass = mass
        this.position = new Vector(x, y)
        this.velocity = new Vector(velocityX, velocityY)
        this.acceleration = new Vector()
    }

    update(timeStep) {
        this.velocity = this.velocity.add(this.acceleration.times(timeStep))
        this.position = this.position.add(this.velocity.times(timeStep))
        return this
    }
    
    get x() {
        return this.position.x
    }

    get y() {
        return this.position.y
    }

    applyForce(forceVector = new Vector ()) {
        this.acceleration = forceVector.times(1/this.mass)
        return this
    }
}
