class Particle {
    #obj
    constructor(obj, { x, y },type,facing) {
        this.#obj = obj
        this.p = { x: x, y: y };
        this.vP = { x: 0, y: 0 };
        this.life = 150;
        this.facing = facing;
        this.type = type;
    }
    update (delta) {
        this.life -= delta;
        return this.life<=0;
    }
    getObject() {
        return this.#obj;
    }
    getPosition() {
        return this.p;
    }
}
const particles = [];
function newParticle(obj, {x, y}, type, facing = RIGHT) {
    particles.push(
        new Particle(obj, { x, y },type,facing)
    );
}