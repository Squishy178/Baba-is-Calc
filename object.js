class BabaEntity {
    #obj;
    #type;

    constructor(objName, { x, y }) {
        this.#obj = objName;
        this.#type = objectData[objName].TYPE;
        this.p = { x: x, y: y };
        this.vP = { x: x, y: y };

        this.facing = RIGHT;
    }

    update() {
        if (this.isAttribute('move')) {
            this.moveBy(this.facing);
        }
    }

    getType() {
        return this.#type;
    }

    getObject() {
        return this.#obj;
    }

    changeObject(newObj) {
        this.#obj = newObj;
        this.#type = objectData[newObj].TYPE;
    }

    moveBy(dir) {
        const nx = this.p.x + dir.x;
        const ny = this.p.y + dir.y;
        const blockers = findEntitiesAt({ x: nx, y: ny });
        
        let testedPush = false;
        for (const blocker of blockers) {
            if (blocker.isPush()) {
                if (testedPush) {
                    blocker.moveWithoutCheck(dir);
                }
                else {
                    if (!blocker.moveBy(dir)) return false;
                    testedPush = true;
                }
            }
            if (blocker.isStop()) return false;
        }
        //  Checks if the space behind is empty to spawn move effect
        if (findEntitiesAt({ x: this.p.x-dir.x, y: this.p.y-dir.y }).length == 0) {

            newParticle(this.#obj,this.p,"trail",this.facing); //move effect :)
        }

        this.p.x = nx;
        this.p.y = ny;

        return true;
    }

    moveWithoutCheck(dir) {
        this.p.x += dir.x;
        this.p.y += dir.y;
        
    }

    isAttribute(attr) {
        const allVerbRules = getRulesForVerb(this.#obj, 'is');
        for (const rule of allVerbRules) {
            if (rule.obj === attr) {
                return true;
            }
        }

        return getRulesForVerb(this.#obj, 'is').some(r => r.obj === attr);
    }

    isYou = () => this.isAttribute('you');
    isStop = () => this.isAttribute('stop');

    // special case for TEXT IS PUSH
    isPush = () => this.isAttribute('push') || (['attribute', 'subject', 'verb'].includes(this.#type));

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

function getObjectsWithName(name) {
    return objects.filter(o => o.getObject() === name);
}
function getObjectsOfType(type) {
    return objects.filter(o => o.getType() === type);
}

const rules = {};
Object.keys(objectData).forEach(name => rules[name] = []);

function getRulesForVerb(name, verb) {
    return rules[name].filter(r => r.verb === verb);
}
function getRulesForVerbEx(name, verb) {
    return rules[name].filter(r => r.verb === verb && !r.preposition && !r.indirect);
}

function addRule(name, verb, attr, preposition = '', indirect = '') {
    const rule = { verb, obj: attr, preposition, indirect };

    if (rules[name].some(r => r.verb === verb && r.obj === attr && r.preposition === preposition && r.indirect === indirect)) return;
    rules[name].push(rule);
}
function removeRule(name, verb, attr, preposition = '', indirect = '') {
    const i = rules[name].findIndex(r => r.verb === verb && r.obj === attr && r.preposition === preposition && r.indirect === indirect);
    if (i === -1) return;
    rules[name].splice(i, 1);
}



function newObject(x, y, type) {
    objects.push(
        new BabaEntity(type, { x, y })
    );
}