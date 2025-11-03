import { tad, load, make, keys, time } from "../lib/TeachAndDraw.js";
import { AmmoManager } from "./ammo_manager.js";

export class PlayerManager {

    constructor(player_name, player_width, player_height, all_players_images, all_ammo_images, all_ships_ammo_data) {
        /*
        Parameters;
            player_name : str : allow selection of player image and knowing weapons, ammo, etc. belonging to specific player
            player_width : int : width of player collider
            player_height : int : height of player collider
            all_players_images : dictionary of images : all player-related images
            all_ammo_images : dictionary of images : all ammunition-images
            all_ships_ammo_data : JSON data from ship_ammo.json
        */

        // ---- Name of Player to Determine Appropriate Actions ----
        this.ship_name = player_name;

        // ---- Initial Position of Player on Canvas ----
        this.x = tad.w/2;        // midway width-wise
        this.y = tad.h/3*2;     // 2/3 down height-wise

        // ---- Dimensions of Player Collider ----
        this.width = player_width;
        this.height = player_height;

        // ---- Get Player Ship Image ----
        this.ship_image = all_players_images[this.ship_name]
        this.ship_image.scale = this.height/2      // ⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️ SCALE NOT WORKING FLEXIBLY


        // ---- Create Player Collider ----
        this.collider = this.create_player_collider();

        // ---- Create Ammo Mananger ----
        this.ammo_manager = new AmmoManager(this.ship_name, this.collider.x, this.collider.y, all_ammo_images, all_ships_ammo_data);


    }

    update(){

        // ---- Change Direction based on WASD ----
        if (keys.down("W")){        // up
            this.collider.direction = 0;
        } 
        if (keys.down("A")){     // left
            this.collider.direction = 270;
        }
        if (keys.down("S")){     // down
            this.collider.direction = 180;
        }
        if (keys.down("D")){     // right
            this.collider.direction = 90;
        }

        // ---- Accelerate ----
        if (keys.down("shift")){
            this.collider.speed += 3;
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
        if (keys.down(" ")){
            this.ammo_manager.fire(this.collider.x, this.collider.y);
        }

        // ---- Set Minimum Speed ----
        if (this.collider.speed < 10){
            this.collider.speed = 10;
        }


        this.collider.draw();

        // 🛑🛑🛑🛑 NO CAMERA USED (YET???) 🛑🛑🛑🛑

    }


    create_player_collider(){
        const tmp = make.boxCollider(this.x, this.y, this.width, this.height); 
        tmp.asset = this.ship_image;
        tmp.speed = 10;
        tmp.direction = 270;
        tmp.friction = 0.3;
        return tmp;
    }

};

