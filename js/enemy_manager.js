import { tad, make, keys, time, math } from "../lib/TeachAndDraw.js";

export class EnemyManager {

    constructor (all_enemy_images, all_enemies_data) {
        this.gap = this.width/2 + 40;
        
        this.all_enemy_images = all_enemy_images;
        this.all_enemies_data = all_enemies_data;

        // ---- Store number of enemies ----
        this.num_enemy_types = Object.keys(this.all_enemies_data).length;

        // ---- Create enemy groups + Scale all enemy images ----
        this.all_groups = make.group();    // to manage drawing for ALL enemies
        this.enemy_groups = {};     // to manage individual enemy types
        for (const key of Object.keys(this.all_enemies_data)){
            this.enemy_groups[key] = make.group();
            this.all_enemy_images[key].scale = this.all_enemies_data[key].scale;    // scaling
        }

        // ---- Queue for enemy projectiles to be created ----
        this.created_projectiles = [];
    }


    update() {
        // spawn wave of enemies periodically
        if (time.seconds%5 === 0 && this.spawning === false) {
            this.spawn_wave();
            this.spawning = true;
        } else if (time.seconds%5 !== 0) {
            this.spawning = false;
        }

        // firing methods for each enemy group
        this.general_enemy_behaviour()
        // this.grunt_behaviour();

        this.all_groups.collides(this.all_groups);

        this.all_groups.draw();
    }


    spawn_wave() {
        // console.log("Spawned wave");
        let wave_size = 5;
        for (let i = 0; i < wave_size; i++) {
            let gap = i * 50;
            let random_x = 50 + ((i / wave_size) * tad.w);
            let random_y = 50 - (i / wave_size);
            this.make_enemy(random_x, random_y, "grunt");
        }
    }


    make_enemy(x, y, type) {
        let this_enemy = this.all_enemies_data[type];
        //console.log(this_enemy);
        let temp = make.boxCollider(x, y, this_enemy.height, this_enemy.width);
        // physics
        temp.direction = 180;
        temp.speed = 10;
        temp.friction = this_enemy.friction;
        temp.mass = this_enemy.mass;
        // set lifespan later
        temp.lifespan = 8;
        temp.asset = this.all_enemy_images[type];
        
        // stats
        temp.max_hp = this_enemy.max_hp;
        temp.current_hp = temp.max_hp;
        temp.score = this_enemy.score;

        //console.log("Enemy max hp:", temp.max_hp, "and current hp:", temp.current_hp);

        this.enemy_groups[type].push(temp);
        this.all_groups.push(temp);
    }


    // handle behaviour specific to "grunt" enemy type
    // grunt_behaviour() {
    //     for (let i = 0; i < this.enemy_groups["grunt"].length; i++) {
    //         this.random_pathing(this.enemy_groups["grunt"][i], "grunt");
    //         // temporary attack timer
    //         if (time.frameCount%300 === 0) {
    //             // console.log(`Grunt ${i} firing from:`, this.enemy_groups["grunt"][i].x, this.enemy_groups["grunt"][i].y);
    //             this.created_projectiles.push({ 
    //                 origin: [this.enemy_groups["grunt"][i].x, this.enemy_groups["grunt"][i].y], 
    //                 target: "player",
    //                 type: this.all_enemies_data["grunt"].primary_weapon,
    //                 friendly: false
    //             });
    //         }
    //     }
    // }

    general_enemy_behaviour() {
        for (let enemy_type in this.enemy_groups) {
            for (let i = 0; i < this.enemy_groups[enemy_type].length; i++) {
                this.random_pathing(this.enemy_groups[enemy_type][i], enemy_type);
                // temporary attack timer
                if (time.frameCount%300 === 0) {
                    // console.log(`enemy2 ${i} firing from:`, this.enemy_groups[enemy_type][i].x, this.enemy_groups[enemy_type][i].y);
                    this.created_projectiles.push({ 
                        origin: [this.enemy_groups[enemy_type][i].x, this.enemy_groups[enemy_type][i].y], 
                        target: "player",
                        type: this.all_enemies_data[enemy_type].primary_weapon,
                        friendly: false
                    });
                }
            }
        }
    }


    // Cause semi-erratic movement whenever "speed < speed_limit"
    random_pathing(unit, enemy_type, speed_limit = 2, threshold = 80) {
        // triggered when slower than "speed_limit"
        // direction by threshold as % of canvas (default 80% of canvas)
        for (let i = 0; i < this.enemy_groups[enemy_type].length; i++) {
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
