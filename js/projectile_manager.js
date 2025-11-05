import { tad, time, load, make, keys } from "../lib/TeachAndDraw.js";

export class ProjectileManager {

    constructor(unit, all_ammo_data, all_ammo_images) {
        this.unit = unit;   // standard unit

        // load all ammo .json data && images
        this.all_ammo_data = all_ammo_data;
        this.all_ammo_images = all_ammo_images;
        this.all_ammo_images.explosion.duration = 1;
        this.all_ammo_images.explosion.looping = false;

        // track existing projectiles for entities
        this.all_projectiles = make.group();    // global tracker

        this.player_projectiles = make.group();
        this.enemy_projectiles = make.group();

        // temporary -- replace with ACTUAL explosions later
        this.explodes = make.group();
    }

    update(player, enemy){
        // check any projectiles being created
        this.get_player_projectiles(player, enemy);
        this.get_enemy_projectiles(player, enemy);

        // update projectile movement
        // ... unnecessary for now -- default physics!
        for (let i = 0; i < this.explodes.length; i++) {
            this.explodes[i].h += 1;
            this.explodes[i].w += 1;
        }

        // check projectile collisions
        this.see_if_player_hits(enemy);
        this.see_if_enemy_hits(player);
        
        // return entity updates

        // clean-up out of bounds projectiles
        this.clean_up_all();
        
        // draw all projectiles
        this.all_projectiles.draw();
    }

    // process any queued player projectiles to be created
    get_player_projectiles(player, enemy) {
        while (player.created_projectiles.length > 0) {
            let new_projectile = player.created_projectiles[0];
            // create front projectile (origin, target, type) & then pop it
            this.create_projectile(
                new_projectile.origin,
                new_projectile.target, 
                new_projectile.type,
                new_projectile.friendly
            );
            player.created_projectiles.shift();
        }
    }
    // enemy version of above function
    get_enemy_projectiles(player, enemy) {
        while (enemy.created_projectiles.length > 0) {
            let new_projectile = enemy.created_projectiles[0];
            let target;
            // if their target is the player -- angle the projectile at them
            if (new_projectile.target === "player") {
                target = [player.collider.x, player.collider.y];
            } else if (new_projectile.target === "none") {
                target = 180;
            }

            this.create_projectile(
                new_projectile.origin,
                target,
                new_projectile.type,
                new_projectile.friendly
            );
            enemy.created_projectiles.shift();
        }
    }

    see_if_player_hits(enemies) {
        // for each enemy, check if any player projectiles landed
        for (let enemy of enemies.all) {
            for (let projectile of this.player_projectiles) {
                if (projectile.collides(enemy)) {
                    //console.log("BANG! enemy: ", enemy, " was hit");
                    this.damage_target(enemy, projectile);
                    this.destroy_projectile(projectile);
                }
            }
        }
    }

    see_if_enemy_hits(player) {
        for (let projectile of this.enemy_projectiles) {
            if (projectile.collides(player.collider)) {
                //console.log("OW! player was hit by:", projectile);
                this.damage_target(player, projectile);
                this.destroy_projectile(projectile);
            }
        }
    }

    damage_target(target, projectile) {
        // if the target should die
        if ((target.current_hp -= projectile.damage) <= 0) {
            target.remove();
            console.log("Killed!");
        } else if (target.current_hp > 0) {
            // just damage the target
            target.current_hp -= projectile.damage;
        }
    }

    destroy_projectile(projectile) {
        let explode = make.boxCollider(projectile.x, projectile.y, 15, 15);
        explode.colour = "red";
        explode.lifespan = 1;
        explode.static;
        explode.asset = this.all_ammo_images.explosion;
        this.explodes.push(explode);
        this.all_projectiles.push(explode);
        projectile.remove();
    }

    // Origin Entity, Target Entity (or direction "up"/"down") and Type (e.g.: missile, bullet..)
    // origin = [x,y], target = direction, type = <ammo name>, friendly = true/false 
    create_projectile(origin, target, type = "woops", friendly) {
        // fetch data for the type of ammo
        let ammo = this.all_ammo_data[type];

        // initialize the collider
        let pew = make.boxCollider(
            origin[0], 
            origin[1], 
            ammo.collider_width, 
            ammo.collider_height
        );
        
        // set movement attributes (speed, friction, mass)
        pew.speed = ammo.speed;
        pew.friction = ammo.friction;
        pew.mass = ammo.mass;

        // 15 seconds default safeguard (just in case)
        pew.lifespan = 15;  

        // fetch image, scale it, attach as asset
        let image = this.all_ammo_images[type]
        image.scale = ammo.scale;
        pew.asset = image;

        // custom stats
        pew.damage = ammo.damage;

        if (target !== "none") {
            pew.direction = pew.getAngleToPoint(target[0], target[1]);
        }

        if (target === "none") {
            if (friendly) { pew.direction = 0; }
        }

        // push the projectile to relevant groups
        if (friendly) { 
            this.player_projectiles.push(pew)
        } else if (!friendly) { 
            this.enemy_projectiles.push(pew) 
        };
        // either way goes to "all_projectiles" group
        this.all_projectiles.push(pew);
    }

    clean_up_all() {
        for (let projectile of this.all_projectiles) {

            if (projectile.x < 0 || projectile.x > tad.w ||
                projectile.y < 0 || projectile.y > tad.h) {
                projectile.remove();
            }
        }
    }
};
