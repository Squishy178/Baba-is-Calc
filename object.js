class BabaEntity {
    #obj;
    #type;

    constructor(objName, { x, y }) {
        this.#obj = objName;
        this.#type = objectData[objName].TYPE;
        this.p = { x: x, y: y };
        this.vP = { x: x, y: y };
    }

    getType() {
        return this.#type;
    }

    getObject() {
        return this.#obj;
    }

    moveBy(dir) {
        const nx = this.p.x + dir.x;
        const ny = this.p.y + dir.y;

        const blockers = findEntitiesAt({ x: nx, y: ny });
        
        let canmove = true;
        let testedPush = false;
        for (const blocker of blockers) {
            if (blocker) {
                if (blocker.isPush() && !testedPush) {
                    canmove = blocker.moveBy(dir);
                    testedPush = true;
                }
                if (blocker.isStop()) canmove = false;
            }
        }
        
        if (canmove) {
            this.p.x = nx;
            this.p.y = ny;
        }
        return canmove;
    }

    isAttribute(attr) {
        return rules[this.#obj].includes(attr);
    }

    isYou = () => this.isAttribute('you');
    isStop = () => this.isAttribute('stop');

    // special case for TEXT IS PUSH
    isPush = () => this.isAttribute('push') || (['attribute', 'subject', 'verb', 'value'].includes(this.#type));

    getCoOccupiers() {
        return findEntitiesAt(this.p).filter(e => e !== this);
    }

    getNeighbors() {
        DIRECTIONS.map(dir => {
            const tp = { x: this.p.x + dir.x, y: this.p.y + dir.y };
            return findEntitiesAt(tp);
        }).flat();
    }
}

const objects = [];
function findEntitiesAt({ x, y }) {
    return objects.filter(o => o.p.x === x && o.p.y === y);
}

const rules = {};
Object.keys(objectData).forEach(name => rules[name] = []);

function addRule(name, attr) {
    if (rules[name].includes(attr)) return;
    rules[name].push(attr);
}
function removeRule(name, attr) {
    const i = rules[name].findIndex(attr);
    if (i === -1) return;
    rules[name].splice(i, 1);
}



function newObject(x, y, type) {
    objects.push(
        new BabaEntity(type, { x, y })
    );
}