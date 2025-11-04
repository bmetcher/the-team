import { tad, time, load, make, keys } from "../lib/TeachAndDraw.js";

export class AmmoManager {

    constructor(ship_name, ship_x, ship_y, all_ammo_images, all_ammo_data) {
        /*
        Parameters:
            ship_name : str : name of firing ship; use to access data from all_ammo_data
            ship_x : centre x-coordinate of ship
            ship_y : centre y-coordinate of ship
            all_ammo_images : dictionary of images : all ammunition-images
            all_ammo_data : JSON data from ship_ammo.json
        */

        this.ship_name = ship_name;     
        this.ship_x = ship_x;
        this.ship_y = ship_y;                                                               
        this.all_ammo_images = all_ammo_images;
        this.all_ammo_data = all_ammo_data;

        this.fired_ammo = make.group() // hold all live ammo colliders

    }


    update(ship_x, ship_y){
        this.fired_ammo.draw();
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
