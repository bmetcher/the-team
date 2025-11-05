import { tad, load, make, keys, time, text } from "../lib/TeachAndDraw.js";

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
        this.ship_data = all_ship_data[this.ship_name];
        
        this.collider = null;

        // track projectiles to be created
        this.created_projectiles = [];
    }

    update(){

        if (time.frameCount === 0){
            // ---- Create Player Collider ----
            // initial position of player on canvase
            const init_x = tad.w/2;        // midway width-wise
            const init_y = tad.h/3*2;     // 2/3 down height-wise
            this.collider = this.create_player_collider(init_x, init_y);
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
            this.collider.speed = 5;
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
            //this.ammo_manager.fire(this.collider.x, this.collider.y);
            for (const this_point in this.ship_data.firing_origins){
                console.log(this.ship_data.firing_origins[this_point]);
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

        // ---- Set Minimum Speed ----
        // if (this.collider.speed < this.ship_data.minimum_speed){
        //     this.collider.speed = this.ship_data.minimum_speed;
        // }

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
        // mass or static?
        // tmp.static = true;
        tmp.mass = this.ship_data.mass;
        tmp.direction = 270;
        tmp.xOffset = this.ship_data.ship_xoffset;
        tmp.yOffset = this.ship_data.ship_yoffset;
        return tmp;
    }
};
