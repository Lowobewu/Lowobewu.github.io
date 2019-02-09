class Particle {
    constructor(mass, x, y, velocityX, velocityY) {
        this.mass = mass
        this.position = new Vector(x, y)
        this.velocity = new Vector(velocityX, velocityY)
        this.forces = []
    }

    update(timeStep) {
        const forceVector = Vector.sum(...this.forces)
        const acceleration = forceVector.times(1 / this.mass)
        this.velocity = this.velocity.add(acceleration.times(timeStep))
        this.position = this.position.add(this.velocity.times(timeStep))

        this.forces = []
        return this
    }

    get x() {
        return this.position.x
    }

    get y() {
        return this.position.y
    }

    applyForce(callback) {
        if (typeof (callback) === 'function') {
            this.forces.push(callback(this.mass, this.position, this.velocity))
        }
        return this
    }
}
