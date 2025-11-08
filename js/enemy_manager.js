import { tad, make, time, math } from "../lib/TeachAndDraw.js";

const FLY_IN_TIME = 5;

export class EnemyManager {

    constructor (all_enemy_images, all_enemies_data) {
        this.gap = this.width/2 + 40;
        this.game_paused = false;
        
        this.all_enemy_images = all_enemy_images;
        this.all_enemies_data = all_enemies_data;

        // ---- Number of enemies ----
        this.all_wave_size = 5; // for resetting wave size
        this.max_enemies = 30;
        this.wave_size = 5;

        // Precaclulate enemy wave numbers
        const grunt_percent = 0.9;
        this.grunt_number = math.floor(grunt_percent * this.wave_size);
        this.special_number = this.wave_size - this.grunt_number;

        // ---- Retreive Enemy Types ----
        this.grunt_types = []
        this.special_types =[]
        this.boss_types = []
        
        for (const key in this.all_enemies_data){
            if (this.all_enemies_data[key].type === "grunt"){
                this.grunt_types.push(key);
            }
            else if(this.all_enemies_data[key].type === "special"){
                this.special_types.push(key);
            }
            else if(this.all_enemies_data[key].type === "boss"){
                this.boss_types.push(key);
            }

        }

        // Wave/level structure
        this.wave_count = 5;
        this.boss_wave = false;
        this.boss_number = this.boss_types.length
        this.big_boss_wave = false;

        // ---- Create enemy groups + Scale all enemy images ----
        this.all_groups = make.group();    // to manage drawing for ALL enemies
        this.enemy_groups = {};     // to manage individual enemy types
        for (const key of Object.keys(this.all_enemies_data)){
            this.enemy_groups[key] = make.group();
            this.all_enemy_images[key].scale = this.all_enemies_data[key].scale;    // scaling
        }

        // ---- Queue for enemy projectiles to be created ----
        this.created_projectiles = [];

        this.has_started = false;
        this.started_spawning = false;
    }

    update() {
        if (!this.has_started){
            this.has_started = true;
            this.init_time = time.seconds;
        }
        
        // spawn wave of enemies periodically
        if (!this.game_paused && time.seconds >= this.init_time + FLY_IN_TIME){
            if (!this.started_spawning){
                this.started_spawning = true;
                this.adjust_by = (time.seconds - this.init_time)%5;
            }
            
            const adjusted_time = Math.floor(time.seconds - this.adjust_by);
            const ready = adjusted_time%5 === 0;
            // spawn wave of 
            if (this.wave_count > 0){
                if (ready && !this.spawning) {
                    //console.log(this.all_groups)
                    this.spawn_wave();
                    this.wave_count -=1;
                }
                this.spawning = ready;
            }
            // Remove old enemies and spawn boss
            else if (this.boss_wave === false){
                // remove old waves 
                for (let enemy of this.all_groups) {
                    enemy.lifespan = 15;
                }                               
                // spawn boss
                this.boss_wave = true;
                this.make_enemy(tad.w/2, -tad.h/2, this.boss_types.pop());
                console.log("mini boss spawn")
            }
            // Check if boss is dead
            else if (this.all_groups.length === 0){
                this.boss_number -= 1;
                // reset waves/start new level if remaining mini bosses
                if (this.boss_number > 0){
                    console.log("next level")
                    console.log(this.boss_number)
                    this.wave_count = this.all_wave_size
                    this.boss_wave = false;
                }
                // spawn game big boss
                else if(this.boss_number === 0 && this.big_boss_wave === false) {
                    console.log("Big boss spawn")
                    this.big_boss_wave = true;
                    this.make_enemy(tad.w/2, -tad.h/2, "big_boss"); 
                }
                else {
                    //won game
                    console.log("won game")
                    console.log(this.boss_number)
                }
                

            }
               
        }
        
        // firing methods for each enemy group
        this.general_enemy_behaviour()
        // this.grunt_behaviour();

        this.all_groups.collides(this.all_groups);

        this.all_groups.draw();
    }

    pause(){
        if (!this.game_paused){
            this.game_paused = true;
            // Freeze all enemies
            for (let enemy_type in this.enemy_groups){
                for (let enemy of this.enemy_groups[enemy_type]){
                    this.stored_speed = enemy.speed;
                    enemy.speed = 0;
                    enemy.stored_lifespan = enemy.lifespan;
                }
            }
        } else {
            for (let enemy_type in this.enemy_groups){
                for (let enemy of this.enemy_groups[enemy_type]){
                    enemy.lifespan = enemy.stored_lifespan;
                }
            }
        }
    }


    play(){
        if (this.game_paused){
            this.game_paused = false;
            // Restore all enemy speeds
            for (let enemy_type in this.enemy_groups){
                for (let enemy of this.enemy_groups[enemy_type]){
                    enemy.speed = this.stored_speed;
                    enemy.lifespan = enemy.stored_lifespan;
                }
            }
        }
    }


    spawn_wave() {
        const new_wave = this.wave_setup();
        for (let i = 0; i < this.wave_size; i++) {
            let random_x = 50 + ((i / this.wave_size) * tad.w);
            let random_y = 50 - (i / this.wave_size);
            this.make_enemy(random_x, random_y, new_wave[i]);
            
        }

    }

    wave_setup(){
        // Randomises the enemies of each wave
        let wave = [];

        // Add grunt names
        let rand_int = 0;
        for (let i = 0; i < this.grunt_number; i++){
            rand_int = math.random(0,this.grunt_types.length-1);
            wave.push(this.grunt_types[rand_int]);
        }

        // Add special names
        for (let i = 0; i < this.special_number; i++){
            rand_int = math.random(0,this.special_types.length-1);
            wave.push(this.special_types[rand_int]);
        }
        
        return wave;

    }

    make_enemy(x, y, name) {
        let this_enemy = this.all_enemies_data[name];
        let temp = make.boxCollider(x, y, this_enemy.height, this_enemy.width);
        // physics
        temp.direction = 180;
        temp.speed = 10;
        temp.stored_speed = temp.speed
        temp.friction = this_enemy.friction;
        temp.mass = this_enemy.mass;
        // set lifespan later
        temp.asset = this.all_enemy_images[name];
        
        // ---- Stats ----
        // Max & Current Hit Points
        temp.max_hp = this_enemy.max_hp;
        temp.current_hp = temp.max_hp;
        // Max & Current "Speed" (Movement intensity & attack speed)
        temp.max_speed = this_enemy.max_speed;
        temp.current_speed = temp.max_speed;
        temp.attack_speed = temp.max_speed;
        // Score gained from killing this enemy
        temp.score = this_enemy.score;

        this.enemy_groups[name].push(temp);
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
                let this_enemy = this.enemy_groups[enemy_type][i];
                
                // if it's time for this enemy to fire
                if (this_enemy.attack_speed === 0) {
                    this.created_projectiles.push({
                        origin: [this_enemy.x, this_enemy.y],
                        target: "player",
                        type: this.all_enemies_data[enemy_type].primary_weapon,
                        friendly: false
                    });

                    this_enemy.attack_speed = this_enemy.max_speed;
                }

                this.random_pathing(this_enemy, enemy_type);
            }
        }
    }

    // Cause semi-erratic movement whenever "speed < speed_limit"
    random_pathing(unit, enemy_type, threshold = 80) {
        // triggered when slower than "speed_limit"
        // direction by threshold as % of canvas (default 80% of canvas)
        for (let i = 0; i < this.enemy_groups[enemy_type].length; i++) {
            // increase unit speed when it's close to stopping
            if (unit.speed < unit.max_speed/10) {
                unit.speed += unit.current_speed * (math.random(2, 4));
                unit.attack_speed -= unit.current_speed / 2;

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
