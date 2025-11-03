import { tad, load, make, keys, camera } from "../lib/TeachAndDraw.js";

export class PlayerManager {
    constructor(unit, player_width, player_height, player_name) {
        /*
        Parameters;
            unit :
            player_width : width of player collider
            player_height : height of player collider
            player_name : allow selection of player image and knowing weapons, ammo, etc. belonging to specific player
        */

        this.unit = unit;

        // ---- Name of Player to Determine Appropriate Actions ----
        this.name = player_name;

        // ---- Initial Position of Player on Canvas ----
        this.x = tad.w/2;        // midway width-wise
        this.y = tad.h/3*2;     // 2/3 down height-wise

        // ---- Dimensions of Player Collider ----
        this.width = player_width;
        this.height = player_height;

        // ---- Load Ship Image ----
        if (this.name === "player1"){
            this.ship_image = load.image(0,0,"./images/player/player1.png");
        } else if (this.name === "player2"){
            this.ship_image = load.image(0,0,"./images/player/player2.png");
        }
        this.ship_image.scale = this.height/2;      // ⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️⬅️ SCALE NOT WORKING FLEXIBLY

        // ---- Create Player Collider ----
        this.collider = this.create_player_collider();

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
            this.collider.direction = 90;
        }
        if (keys.down("D")){     // right
            this.collider.direction = 180;
        }

        // ---- Change Speed ----
        if (keys.down("Q")){    // accelerate
            this.collider.speed += 0.1;
        } else if (keys.down("E")){    // decelerate
            this.collider.speed -= 0.11;
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

        this.collider.draw();

        // 🛑🛑🛑🛑 NO CAMERA USED (YET???) 🛑🛑🛑🛑

    }

    create_player_collider(){
        const tmp = make.boxCollider(this.x, this.y, this.width, this.height); 
        tmp.asset = this.ship_image;
        tmp.speed = 10;
        tmp.direction = 270;
        tmp.friction = 0;
        return tmp;
    }

};

