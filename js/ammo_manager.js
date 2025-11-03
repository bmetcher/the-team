import { tad, time, load, make, keys } from "../lib/TeachAndDraw.js";

const ammo_info = {
    bullet: {
        filepath: "./images/ammo/bullet.png",
        speed: 3
    },
    missile: {
        filepath: "./images/ammo/missile.png",
        speed: 2
    }
}

export class AmmoManager {
    constructor(ammo_name, ship_x, ship_y, offset_points) {
        /*
        Parameters:
            ammo_name : str : name of ammunition being fired
            ship_x : centre x-coordinate of ship
            ship_y : centre y-coordinate of ship
            offsets_points : array of tuples of numbers : offset of coordinates from centre of ship; allows multiple turrets
                                                                        e.g. [ (0,3) , (5,6) ] indicates ammo should fire from points (0,3) and (5,6)
        */

        this.ammo_name = ammo_name;
        // this.ammo_image = load.image(0,0,ammo_info.ammo_name)    

        this.origin_firepoints = []
        for (let offset_point in offset_points){
            
        }

        this.collider = this.create_ammo_collider();


    }

    update(){
        console.log("Here");
    }




    create_ammo_collider(){
        const tmp = make.boxCollider(this.ship_x, this.ship_y, 4, 5);
        tmp.asset = this.ship_image;
        tmp.speed = 10;
        tmp.direction = 0;
        tmp.friction = 0;
        return tmp;
    }



};

