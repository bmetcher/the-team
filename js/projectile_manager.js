import { tad, time, load, make, keys } from "../lib/TeachAndDraw.js";

export class ProjectileManager {

    constructor(unit, ammo_data) {
        this.unit = unit;   // standard unit

        // load ammo data from the .json
        this.projectile_data = ammo_data;

        // track existing projectiles for entities
        this.player_projectiles = make.group();
        this.enemy_projectiles = make.group();
    }

    update(player, enemy){
        // check any projectiles being created
        this.get_player_projectiles(player);
        this.get_enemy_projectiles(enemy);

        // update projectile movement


        // check projectile collisions

        
        // return entity updates
        
    }

    get_player_projectiles(player) {
        for (let projectile of player.created_projectiles) {
            console.log(projectile);
            //this.create_projectile(player.x, player.y, )
            
        }
    }

    get_enemy_projectiles(enemy) {

    }

    create_projectile(origin_x, origin_y, target, type = "woops") {
        let pew = make.boxCollider(origin_x, origin_y, 10, 10);
        console.log(pew);
    }


    fire(ship_x, ship_y){
        /*
        Parameters:
            ship_x : current centre x-coordinate of ship
            ship_y : current centre y-coordinate of ship
        */
    
        // ---- Extract Data for Current Ship ----
        const ship_data = this.all_ammo_data[this.ship_name]

        // ---- Create Ammo Colliders ----
        for (const this_ammo of ship_data.ammo){    // for each ammo type

            // get image for current ammo
            const this_ammo_img = this.all_ammo_images[this_ammo.ammo_name];
            this_ammo_img.scale = this_ammo.ammo_scale;

            // get speed, direction, and collider dimensions of current ammo
            const this_ammo_speed = this_ammo.speed;
            const this_ammo_direction = this_ammo.direction;
            const collider_width = this_ammo.collider_width;
            const collider_height = this_ammo.collider_height;

            for (const coordinates of this_ammo.firing_origin_xy_offset_from_player_centre){        // for each instance of ammo type

                // calculate ammo coordinates
                const this_ammo_x = ship_x + coordinates[0];
                const this_ammo_y = ship_y + coordinates[1];

                // create ammo collider and add to fired_ammo group
                this.create_ammo(this_ammo_x, this_ammo_y, this_ammo_img, this_ammo_speed, this_ammo_direction, collider_width, collider_height);
            }
        }
    }

    
    create_ammo(this_ammo_x, this_ammo_y, this_ammo_img, this_ammo_speed, this_ammo_direction, collider_width, collider_height){
        const tmp = make.boxCollider(this_ammo_x, this_ammo_y, collider_width, collider_height);
        tmp.asset = this_ammo_img;
        tmp.speed = this_ammo_speed;
        tmp.direction = this_ammo_direction;
        tmp.friction = 0;
        tmp.lifespan = 10;  // automatically delete ammo colliders that go off screen
        this.fired_ammo.push(tmp);
    }

};
