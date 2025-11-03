import { tad, time, load, make, keys } from "../lib/TeachAndDraw.js";

export class AmmoManager {

    constructor(ship_name, ship_x, ship_y, all_ammo_images, all_ships_ammo_data) {
        /*
        Parameters:
            ship_name : str : name of firing ship; use to access data from all_ships_ammo_data
            ship_x : centre x-coordinate of ship
            ship_y : centre y-coordinate of ship
            all_ammo_images : dictionary of images : all ammunition-images
            all_ships_ammo_data : JSON data from ship_ammo.json
        */

        this.ship_name = ship_name;     
        this.ship_x = ship_x;
        this.ship_y = ship_y;                                                               
        this.all_ammo_images = all_ammo_images;
        this.all_ships_ammo_data = all_ships_ammo_data;

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
    
        const ship_data = this.all_ships_ammo_data[this.ship_name]

        for (const this_ammo of ship_data.ammo){
            const this_ammo_img = this.all_ammo_images[this_ammo.ammo_name];
            this_ammo_img.scale = 10;
            const this_ammo_speed = this_ammo.speed;

            for (const coordinates of this_ammo.firing_origin_xy_offset_from_player_centre){
                const this_ammo_x = ship_x + coordinates[0];
                const this_ammo_y = ship_y + coordinates[1];
                this.create_ammo(this_ammo_x, this_ammo_y, this_ammo_img, this_ammo_speed);
            }
            
        }
    }

    create_ammo(this_ammo_x, this_ammo_y, this_ammo_img, this_ammo_speed){
        const tmp = make.boxCollider(this_ammo_x, this_ammo_y, 4, 5);
        tmp.asset = this_ammo_img;
        tmp.speed = this_ammo_speed;
        tmp.direction = 0;
        tmp.friction = 0;
        this.fired_ammo.push(tmp);
    }

};
