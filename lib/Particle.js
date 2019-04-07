/** Class representing a free particle */
class Particle {
    /**
     * Create particle
     * @param {Number} mass - The mass of the particle
     * @param {Number} x - The inital x position of the particle
     * @param {Number} y - The inital y position of the particle
     * @param {Number} vx - The inital x velocity of the particle
     * @param {Number} vy - The inital y velocity of the particle
     */
    constructor(mass, x, y, vx, vy) {
        this.mass = mass
        this.position = new Vector(x, y)
        this.velocity = new Vector(vx, vy)
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
