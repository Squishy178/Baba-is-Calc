class Particle {
    #obj;

    constructor(obj, { x, y }, type, size, { vx, vy } = { vx: 0, vy: 0 }, life = 150, tint = undefined) {
        this.#obj = obj;
        this.vP = { x: x, y: y };
        this.vel = { x: vx, y: vy };
        this.life = life;
        this.maxLife = life;
        this.type = type;
        this.size = size;
        this.tint = tint;
    }
    update (delta) {
        this.vP.x += this.vel.x * delta / 150;
        this.vP.y += this.vel.y * delta / 150;

        this.life -= delta;
        return this.life<=0;
    }
    getObject() {
        return this.#obj;
    }
    getPosition() {
        return this.vP;
    }
}
const particles = [];
function newParticle(obj, {x, y}, type, size, { vx, vy } = { vx: 0, vy: 0 }, life = 150, tint = undefined) {
    particles.push(
        new Particle(obj, { x, y },type,size, { vx, vy }, life, tint)
    );
}