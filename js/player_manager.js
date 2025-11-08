import { tad, make, keys, time } from "../lib/TeachAndDraw.js";

const FLY_IN_TIME = 5;

export class PlayerManager {

    constructor(player_name, all_players_images, all_ship_data) {
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
        this.max_hp = this.ship_data.max_hp;
        this.current_hp = this.max_hp;
        // TODO player iframe
        
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

        // ---- Shoot ----
        if (keys.released(" ")){
            //this.ammo_manager.fire(this.collider.x, this.collider.y);
            for (const this_point in this.ship_data.firing_origins){
                const this_x = this.collider.x + this.ship_data.firing_origins[this_point][0];
                const this_y = this.collider.y + this.ship_data.firing_origins[this_point][1];
                this.created_projectiles.push({
                    origin: [this_x, this_y],
                    target: "none",
                    type: this.ship_data.primary_weapon,
                    friendly: true
                });
            }
        }

        if (keys.down("g")) {
            //tad.camera.rotation += 1;
            tad.camera.zoom -= 0.01;
        }

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
