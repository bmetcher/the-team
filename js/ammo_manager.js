import { tad, time, load, make, keys } from "../lib/TeachAndDraw.js";

export class AmmoManager {

    constructor(ship_name, all_ammo_images, all_ships_ammo_data) {
        /*
        Parameters:
            ship_name : str : name of firing ship; use to access data from all_ships_ammo_data
            ship_x : centre x-coordinate of ship
            ship_y : centre y-coordinate of ship
            offsets_points : array of tuples of numbers : offset of coordinates from centre of ship; allows multiple turrets
                                                                        e.g. [ (0,3) , (5,6) ] indicates ammo should fire from points (0,3) and (5,6)
        */

        this.ship_name = ship_name;                                                                    
        this.all_ammo_images = all_ammo_images;
        this.all_ships_ammo_data = all_ships_ammo_data;

        this.fired_ammo = make.group() // hold all live ammo colliders

    }


    fire(ship_x, ship_y){

        console.log("Updating");

        this.fired_ammo.draw();

        console.log(this.all_ships_ammo_data)

        for (let this_ammo of this.ship_ammo_data.ammo){
            console.log(this_ammo);
            console.log("Firing");
        }

        /*
        Parameters:
            ship_x : current centre x-coordinate of ship
            ship_y : current centre y-coordinate of ship
        */
        
        
        // const tmp = make.boxCollider(this.ship_x, this.ship_y, 4, 5);
        // tmp.asset = this.ship_image;
        // tmp.speed = 10;
        // tmp.direction = 0;
        // tmp.friction = 0;
        // return tmp;

    }



};

