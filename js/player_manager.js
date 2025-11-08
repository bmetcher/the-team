import { tad, load, make, keys, time, text, camera, math, mouse } from "../lib/TeachAndDraw.js";
import { Timer } from "./timer.js";

const FLY_IN_TIME = 5;

export class PlayerManager {

    constructor(player_name, all_players_images, all_ship_data, all_effects) {
        /*
        Parameters;
            player_name : str : allow selection of player image and knowing weapons, ammo, etc. belonging to specific player
            all_players_images : dictionary of images : all player-related images
            all_ship_data : JSON data from ships.json
        */
        this.game_paused = false;

        // ---- Name of Player to Determine Appropriate Actions ----
        this.ship_name = player_name;

        // ---- Get Player Ship Image ----
        this.ship_image = all_players_images[this.ship_name];
        this.ship_data = all_ship_data[this.ship_name];
        this.all_effects = all_effects;
        this.max_hp = this.ship_data.max_hp;
        this.current_hp = this.max_hp;
        // ---- Player Attack Timers ----
        // Primary Attack (attack_speed = how many attacks per second)
        this.attack_cooldown_timer = new Timer(1 / this.ship_data.attack_speed);
        this.attack_cooldown_timer.start();
        // Ability Cooldown (requires 4*duration to recharge)
        this.ability_cooldown_timer = new Timer(this.ship_data.ability_duration * 4);
        this.ability_cooldown_timer.start();
        // Active Ability Duration
        this.ability_activation_timer = new Timer(this.ship_data.ability_duration);
        // this.ability_activation_timer.start();   // start 
        this.ability_percentage = 0;
        this.shots_fired = 0;       // for default ship barrage
        this.invincible = false;    // for tank ship

        this.iframe = new Timer(0.8);   // for projectiles
        
        this.collider = null;
        // track projectiles to be created
        this.created_projectiles = [];

        this.init_time = time.seconds + 1;
        this.init_frame_count = time.frameCount;
        this.has_started = false;
    }

    update(){

        if (!this.has_started){
            this.init_time = time.seconds;
            this.has_started = true;

            // ---- Create Player Collider ----
            this.collider = this.create_player_collider();
            // ---- Create Boost Fuel ----
            this.current_fuel = this.ship_data.max_boost_fuel;
        }

        if (time.seconds >= this.init_time + FLY_IN_TIME){
            this.specialise_player_settings();
        }

        // ---- Change Direction based on WASD (Allows Diagonal) ----
        let dx = 0;
        let dy = 0;
        let boost_status = 0;
        
        if (keys.down("W")) dy -= 1;
        if (keys.down("S")) dy += 1;
        if (keys.down("A")) dx -= 1;
        if (keys.down("D")) dx += 1;

        if (dx !== 0 || dy !== 0) {
            
            let angle_rad = Math.atan2(dy, dx);  // standard math angle (0 = right); in radians
            let angle_deg = angle_rad * 180 / Math.PI;        // convert to degrees
            this.collider.direction = angle_deg + 90; // adjust so 0 = up          
            // ---- Boost Movement ----
            if (keys.down("shift") && this.current_fuel > 1){

                boost_status = 1

                if (this.collider.speed < this.ship_data.boost_max_speed){
                    this.collider.speed += this.ship_data.boost_acceleration;
                }
                else{
                    this.collider.speed = this.ship_data.boost_max_speed;
                }

                // Use boost fuel
                this.current_fuel -= 1;
                if (this.current_fuel <= 0) {
                    this.current_fuel = 0;
                }  
            }

            // ---- Normal movement ---- 
            else{

                boost_status = 0;

                if (this.collider.speed < this.ship_data.max_speed){
                    this.collider.speed += this.ship_data.acceleration;
                }

                else{
                    this.collider.speed = this.ship_data.max_speed;
                }

                this.collider.friction = this.ship_data.slowdown;
            }

        // Slow down ship
        } else {

            this.collider.friction = this.ship_data.slowdown;  
        }

        // Recharge Boost
        if (!boost_status && this.current_fuel < this.ship_data.max_boost_fuel ){

            this.current_fuel += this.ship_data.boost_recharge
            
            if (this.current_fuel > this.ship_data.max_boost_fuel){

                this.current_fuel = this.ship_data.max_boost_fuel;
            }
        }  
        
        // ---- Keep Player Within Bounds ----
        const x_gap = this.width/2
        const y_gap = this.height/2

        if (this.collider.x < x_gap){
            this.collider.x = x_gap;
        }
        else if (this.collider.x > tad.w - x_gap){ 
            this.collider.x = tad.w - x_gap;
        }

        if (this.collider.y < y_gap){
            this.collider.y = y_gap

        }
        else if (this.collider.y > tad.h - y_gap){
            this.collider.y = tad.h - y_gap
        }

        // ---- Update Combat Timers ----
        this.iframe.update();
        this.attack_cooldown_timer.update();
        this.ability_cooldown_timer.update();
        this.ability_activation_timer.update();

        // ---- Primary Attack (default: "space") ----
        if (keys.down(" ") || mouse.leftDown) {
            if (this.attack_cooldown_timer.done()) {
                for (const this_point in this.ship_data.firing_origins){
                    const this_x = this.collider.x + this.ship_data.firing_origins[this_point][0];
                    const this_y = this.collider.y + this.ship_data.firing_origins[this_point][1];
                    this.created_projectiles.push({
                        origin: [this_x, this_y],
                        target: "none",
                        type: this.ship_data.primary_weapon,
                        friendly: true
                    });
                    this.attack_cooldown_timer.start(); // back to max 100 value
                }
            }
        }
        // console.log("Attack Timer running: ", this.attack_cooldown_timer.running,
        //     "\nFinished: ", this.attack_cooldown_timer.finished);

        // Update invincibility (can be overwritten by later states/cases here)
        this.invincible = false;
        // ---- Special Ability (default: "G") ----
        if (keys.released("g") || mouse.rightReleased) {
            // if "cooldown is finished" and "ability isn't already being used"
            if (this.ability_cooldown_timer.done() && !this.ability_activation_timer.running) {
                console.log("Ability activated!");
                this.ability_activation_timer.start();
                this.ability_cooldown_timer.start();    // restart the cooldown timer
                this.shots_fired = 0;
            } else {
                console.log("Ability not ready yet!");
            }
        }
        // console.log(this.ability_activation_timer.running);
        if (this.ability_activation_timer.running) {
            if (this.ship_data.special_ability === "invincibility") {
                //console.log("INVINCIBLE!!");
                this.all_effects.felspell.x = this.collider.x;
                this.all_effects.felspell.y = this.collider.y;
                this.all_effects.felspell.scale = 150;
                this.all_effects.felspell.draw();
                this.invincible = true;
            } else if (this.ship_data.special_ability === "barrage") {
                //console.log("BARRAGING!!");
                this.all_effects.vortex.x = this.collider.x;
                this.all_effects.vortex.y = this.collider.y;
                this.all_effects.vortex.scale = 100;
                this.all_effects.vortex.draw();

                const intervals = this.ability_activation_timer.intervals(30);

                if (intervals > this.shots_fired) {
                    let x = this.collider.x;
                    let y = this.collider.y;
                    for (const this_point in this.ship_data.firing_origins){
                        const this_x = this.collider.x + this.ship_data.firing_origins[this_point][0];
                        const this_y = this.collider.y + this.ship_data.firing_origins[this_point][1];
                        this.created_projectiles.push({
                            origin: [this_x, this_y],
                            target: "random",
                            type: this.ship_data.primary_weapon,
                            friendly: true
                        });
                    this.attack_cooldown_timer.start(); // back to max 100 value
                    }
                    this.shots_fired = intervals;
                }

            }
        }

        // --- Experimental Reactive Camera Effect ---

        // Rotate camera slightly according to player's x co-ordinate
        //camera.rotation = 1 + ((tad.w/2 - this.collider.x) / 100);

        // Pan camera slightly in a direction according to the player's x/y co-ordinates
        camera.x = tad.w/2 - ((tad.w/2 - this.collider.x) / 10);
        camera.y = tad.h/2 - ((tad.h/2 - this.collider.y) / 10);
        // Zoom the camera slightly as the player moves upwards 
        camera.zoom = 1.1 - (this.collider.y / tad.h) / 4;  // arbitrary; should we clamp this?

        // 🛑🛑🛑🛑 NO CAMERA USED (YET???) 🛑🛑🛑🛑
        // Would we like manual camera controls? We could add them here

        // Dev's "t" hotkey (put whatever you wanna activate/test here if you like!)
        if (keys.down("t") && tad.debug === true) {
            camera.zoom = 0.25;
        }

        // ---- Create HP and Boost bars ----
        text.colour = "rgb(255, 255, 255)";
        text.size = 45;
        text.print(tad.w/8, 1000, "HP");
        text.print(tad.w/4, 1000, this.current_hp.toString());

        this.ability_percentage = this.ability_cooldown_timer.get_percentage();
        if (this.ability_percentage === 1) { 
            this.ability_percentage = "READY!"
        } else {
            this.ability_percentage = math.round(this.ability_percentage * 100) + " %";
        }
        text.print(435, 1000, "Ability");
        text.print(630, 1000, this.ability_percentage.toString());

        // if (this.iframe.running) { text.print(tad.w/2, tad.h/2, "IFRAME ACTIVE!") }

        // --- Draw the Player's Collider ---- 
        this.collider.draw();
    }


    pause(){
        if (!this.game_paused){
            this.game_paused = true;
            this.stored_speed = this.collider.speed;
            this.collider.speed = 0;
        }
    }


    play(){
        if (this.game_paused){
            this.game_paused = false;
            this.collider.speed = this.stored_speed;
        }
    }


    create_player_collider(){
        this.width = this.ship_data.collider_width;
        this.height = this.ship_data.collider_height;
        const INIT_X = tad.w/2;        // midway width-wise
        const INIT_Y = tad.h + this.height * 2; //3*2;     // 2/3 down height-wise
        const tmp = make.boxCollider(INIT_X, INIT_Y, this.width, this.height); 
        this.ship_image.scale = this.ship_data.ship_scale;
        tmp.asset = this.ship_image;
        tmp.speed = 30;
        tmp.direction = 0;
        tmp.xOffset = this.ship_data.ship_xoffset;
        tmp.yOffset = this.ship_data.ship_yoffset;
        return tmp;
    }

    specialise_player_settings(){
        // mass or static?
        // tmp.static = true;
        this.collider.mass = this.ship_data.mass;
        // this.collider.direction = 270;
        // this.collider.speed = this.ship_data.minimum_speed;
    }
};
