import { tad, make, keys, time, math } from "../lib/TeachAndDraw.js";

export class EnemyManager {

    constructor(unit, all_enemy_images) {
        this.unit = unit;
        this.gap = this.width/2 + 40;
        this.all = make.group();    // use this maybe later?

        this.grunts = make.group();
        
        // temporary storing set enemy values
        this.spec = {
            "grunt": {
                max_hp: 2,
                height: unit/2,
                width: unit/2,
                mass: 1,
                friction: 1,
                asset: all_enemy_images["grunt"],
                primary_weapon: "missile"
            }
        }

        // queue for enemy projectiles to be created
        this.created_projectiles = [];
    }

    update() {
        this.dev_controls();
        // spawn wave of enemies periodically
        if (time.seconds%5 === 0 && this.spawning === false) {
            this.spawn_wave();
            this.spawning = true;
            //console.log(this.grunts);
        } else if (time.seconds%5 !== 0) {
            this.spawning = false;
        }

        this.grunt_behaviour();
        this.grunts.collides(this.grunts);

        this.grunts.draw();
    }

    dev_controls() {
        if (keys.released("G")) {
            this.make_enemy(70, 70, "grunt");
        }
    }

    spawn_wave() {
        console.log("Spawned wave");
        let wave_size = 5;
        for (let i = 0; i < wave_size; i++) {
            let gap = i * 50;
            let random_x = 50 + ((i / wave_size) * tad.w);
            let random_y = 50 - (i / wave_size);
            this.make_enemy(random_x, random_y, "grunt");
        }
    }

    make_enemy(x, y, type) {
        let spec = this.spec[type];
        //console.log(spec);
        let temp = make.boxCollider(x, y, spec.height, spec.width);
        // physics
        temp.direction = 180;
        temp.speed = 10;
        temp.friction = spec.friction;
        temp.mass = spec.mass;
        // set lifespan later
        temp.lifespan = 8;
        temp.asset = spec.asset;
        
        // stats
        temp.max_hp = spec.max_hp;
        temp.current_hp = temp.max_hp;
        //console.log("Enemy max hp:", temp.max_hp, "and current hp:", temp.current_hp);

        if (type === "grunt") {
            this.all.push(temp);
            this.grunts.push(temp);
        }
    }

    // handle behaviour for grunts
    grunt_behaviour() {
        for (let i = 0; i < this.grunts.length; i++) {
            this.random_pathing(this.grunts[i]);
            // temporary attack timer
            if (time.frameCount%300 === 0) {
                console.log(`Grunt ${i} firing from:`, this.grunts[i].x, this.grunts[i].y);
                this.created_projectiles.push({ 
                    origin: [this.grunts[i].x, this.grunts[i].y], 
                    target: "player",
                    type: this.spec["grunt"].primary_weapon,
                    friendly: false
                });
            }
        }
    }

    // Cause semi-erratic movement whenever "speed < speed_limit"
    random_pathing(unit, speed_limit = 2, threshold = 80) {
        // triggered when slower than "speed_limit"
        // direction by threshold as % of canvas (default 80% of canvas)
        for (let i = 0; i < this.grunts.length; i++) {
            // increase unit speed when it's close to stopping
            if (unit.speed < speed_limit) {
                unit.speed = speed_limit * 4;

                // define each threshold on the canvas
                let threshold_right     = tad.w * threshold/100;
                let threshold_left      = tad.w - threshold_right;
                let threshold_bottom    = (tad.h * threshold/100) / 2;
                let threshold_top       = tad.h - (tad.h * threshold/100);

                // angle away from the edge of canvas when beyond a threshold
                if (unit.x > threshold_right) {
                    unit.direction = 225 + (math.random(0, 1) * 90);
                    //console.log("RIGHT: " + threshold_right);
                } else if (unit.x < threshold_left) {
                    unit.direction = 45 + (math.random(0, 1) * 90);
                    //console.log("LEFT: " + threshold_left);
                } else if ((unit.y < threshold_top)) {
                    unit.direction = 135 + (math.random(0, 1) * 90);
                    //console.log("TOP: " + threshold_top);
                } else if (unit.y > threshold_bottom) {
                    unit.direction = 45 - (math.random(0, 1) * 90);
                    //console.log("BOTTOM: " + threshold_bottom);
                } else {            
                    unit.direction = 360 * math.random(0.1);
                    //console.log("RANDOM");
                }
                //console.log("new direction: " + unit.direction);
            }
        }
    }
}