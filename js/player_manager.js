import { tad, load, make, keys, time, text } from "../lib/TeachAndDraw.js";
import { AmmoManager } from "./ammo_manager.js";

export class PlayerManager {

    constructor(player_name, all_players_images, all_ammo_images, all_ship_data, all_ammo_data) {
        /*
        Parameters;
            player_name : str : allow selection of player image and knowing weapons, ammo, etc. belonging to specific player
            all_players_images : dictionary of images : all player-related images
            all_ammo_images : dictionary of images : all ammunition-images
            all_ship_data : JSON data from ships.json
            all_ammo_data : JSON data from ammo.json
        */

        // ---- Name of Player to Determine Appropriate Actions ----
        this.ship_name = player_name;

        // ---- Get Player Ship Image ----
        this.ship_image = all_players_images[this.ship_name];

        this.all_ammo_images = all_ammo_images;
        this.all_ammo_data = all_ammo_data;
        this.all_ship_data = all_ship_data
        this.ship_ammo_data = null;

        this.collider = null;

    }

    update(){

        if (time.frameCount === 0){
            // ---- Separately Save Data for Current Ship ----
            this.ammo_data = this.all_ammo_data[this.ship_name];
            this.ship_data = this.all_ship_data[this.ship_name]; 

            // ---- Create Player Collider ----
            // initial position of player on canvase
            const init_x = tad.w/2;        // midway width-wise
            const init_y = tad.h/3*2;     // 2/3 down height-wise
            this.collider = this.create_player_collider(init_x, init_y);

            // ---- Create Ammo Mananger ----
            this.ammo_manager = new AmmoManager(this.ship_name, this.collider.x, this.collider.y, this.all_ammo_images, this.all_ammo_data);
        }

        // ---- Change Direction based on WASD (Allows Diagonal) ----
        let dx = 0;
        let dy = 0;

        if (keys.down("W")) dy -= 1;
        if (keys.down("S")) dy += 1;
        if (keys.down("A")) dx -= 1;
        if (keys.down("D")) dx += 1;

        if (dx !== 0 || dy !== 0) {
            let angle_rad = Math.atan2(dy, dx);  // standard math angle (0 = right); in radians
            let angle_deg = angle_rad * 180 / Math.PI;        // convert to degrees
            this.collider.direction = angle_deg + 90; // adjust so 0 = up
            this.collider.friction = this.ship_data.movement_friction;
        } else {
            this.collider.friction = this.ship_data.stationary_friction;  // make ship stationary when not in motion
        }
       
        // ---- Accelerate ----
        if (keys.down("shift")){
            this.collider.speed += this.ship_data.boost_amount;
        }

        // ---- Keep Player Within Bounds ----
        const GAP = this.width/2 + 40; // keep a gap of pixels so player does not go off edge
        if (this.collider.x < GAP){
            this.collider.direction = 90;
        }
        if (this.collider.x > tad.w - GAP){ 
            this.collider.direction = 270;
        }
        if (this.collider.y < GAP){
            this.collider.direction = 180;
        }
        if (this.collider.y > tad.h - GAP){
            this.collider.direction = 0;
        }

        // ---- Boost ----
        if (keys.released(" ")){
            this.ammo_manager.fire(this.collider.x, this.collider.y);
        }

        // ---- Set Minimum Speed ----
        if (this.collider.speed < this.ship_data.minimum_speed){
            this.collider.speed = this.ship_data.minimum_speed;
        }

        this.ammo_manager.update();
        this.collider.draw();

        // 🛑🛑🛑🛑 NO CAMERA USED (YET???) 🛑🛑🛑🛑
    }


    create_player_collider(init_x, init_y){
        this.width = this.ship_data.collider_width;
        this.height = this.ship_data.collider_height;
        const tmp = make.boxCollider(init_x, init_y, this.width, this.height); 
        this.ship_image.scale = this.ship_data.ship_scale;
        tmp.asset = this.ship_image;
        tmp.speed = this.ship_data.minimum_speed;
        tmp.direction = 270;
        return tmp;
    }

};

