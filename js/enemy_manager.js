import { tad, make, keys, time, math } from "../lib/TeachAndDraw.js";

export class EnemyManager {
    constructor(unit) {
        this.unit = unit;
        this.gap = this.width/2 + 40;
        this.all = make.group();    // use this maybe later?

        this.grunts = make.group();

        // temporary storing set enemy values
        this.spec = {
            "grunt": {
                height: unit/2,
                width: unit/2
            }
        }
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

        this.grunts.collides(this.grunts);
        this.grunt_movement();

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
            let random_x = 50 + (i / wave_size) * tad.w;
            let random_y = 0;
            this.make_enemy(random_x, random_y, "grunt");
        }
    }

    make_enemy(x, y, type) {
        let spec = this.spec[type];
        let temp = make.boxCollider(x, y, spec.height, spec.width);
        temp.direction = 180;
        temp.speed = 10;
        temp.friction = 1;
        temp.lifespan = 8;
        if (type === "grunt") {
            this.all.push(temp);
            this.grunts.push(temp);
        }
    }

    grunt_movement() {
        for (let i = 0; i < this.grunts.length; i++) {
            if (this.grunts[i].speed < 1) {
                this.grunts[i].speed = 5;
                if (this.grunts[i].y > tad.h/3 && this.grunts[i].x > tad.w/2) {
                    // bottom right
                    this.grunts[i].direction = 270 + (math.random(0, 1) * 90);
                } else if (this.grunts[i].y > tad.h/3 && this.grunts[i].x < tad.w/2) {
                    // bottom left 
                    this.grunts[i].direction = (math.random(0, 1) * 90);
                } else if (this.grunts[i].y < tad.h/3 && this.grunts[i].x < tad.w/2) {
                    // top left
                    this.grunts[i].direction = 90 + (math.random(0, 1) * 90);
                } else if (this.grunts[i].y < tad.h/3 && this.grunts[i].x > tad.w/2) {
                    // top right
                    this.grunts[i].direction = 180 + (math.random(0, 1) * 90);
                }


            }

            // ---- Keep Grunt Within Bounds ----
            if (this.grunts[i].x < this.gap){
                this.grunts[i].direction = 90;
                
            }
            if (this.grunts[i].x > tad.w - this.gap){ 
                this.grunts[i].direction = 270;
                console.log("Changing direction");
            }
        }
    }
}