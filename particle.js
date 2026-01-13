class Particle {

    constructor(type, { x, y },facing) {
        this.type = type
        this.p = { x: x, y: y };
        this.life = 150;
        this.facing = facing;
    }
    update (delta) {
        this.life -= delta;
        return this.life<=0;
    }
}
const particles = [];
function newParticle({x, y}, type) {
    particles.push(
        new Particle(type, { x, y })
    );
}