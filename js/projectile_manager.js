import { tad, time, load, make, keys } from "../lib/TeachAndDraw.js";

export class ProjectileManager {

    constructor(unit, all_ammo_data, all_ammo_images, all_explosions, all_effects) {
        this.unit = unit;   // standard unit

        // ---- Load Ammo Data & images ----
        this.all_ammo_data = all_ammo_data;
        this.all_ammo_images = all_ammo_images;
        this.all_explosions = all_explosions;
        this.all_effects = all_effects;

        // ---- Track Active Projectiles ----
        this.all_projectiles = make.group();    // global tracker

        this.player_projectiles = make.group();
        this.enemy_projectiles = make.group();

        // Explosion effects group
        this.explodes = make.group();
    }

    update(player, enemy){
        // ---- Fetch Any Created Projectiles ----
        this.get_player_projectiles(player, enemy);
        this.get_enemy_projectiles(player, enemy);

        // ---- Check Projectile Collisions ----
        this.see_if_player_hits(enemy);
        this.see_if_enemy_hits(player);

        // ---- Clean-up Out of Bounds Projectiles ----
        this.clean_up_all();
        
        // ---- Draw All Projectiles ----
        this.all_projectiles.draw();
    }

    // Process any queued player projectiles to be created
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
    // Enemy version of above function
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

    // See if any player projectiles collide with any of the enemies
    see_if_player_hits(enemies) {
        for (let enemy of enemies.all) {
            for (let projectile of this.player_projectiles) {
                
                if (projectile.collides(enemy)) {
                    //console.log("BANG! enemy: ", enemy, " was hit");
                    this.damage_target(enemy, projectile);
                    this.destroy_projectile(projectile, "enemy");
                }

            }
        }
    }
    // See if any enemy projectiles collide with the player
    see_if_enemy_hits(player) {
        for (let projectile of this.enemy_projectiles) {
            if (projectile.collides(player.collider)) {
                //console.log("OW! player was hit by:", projectile);
                this.damage_player(player, projectile);
                this.destroy_projectile(projectile, "player");
            }
        }
    }

    // Calculate damage for some target that was hit by a projectile
    damage_target(target, projectile) {
        // Handle if the target should be dead
        if ((target.current_hp -= projectile.damage) <= 0) {
            target.remove();
        } else if (target.current_hp > 0) {
            // Handle a regular damage interval
            target.current_hp -= projectile.damage;
        }
    }
    // Handle damaging the player
    damage_player(player, projectile) {
        player.current_hp -= projectile.damage;
        // ** TBD ** Player Death
    }

    // Remove the projectile and create an explosion animation in it's place
    destroy_projectile(projectile, dieing_sprite_name) {
        let explode = make.boxCollider(projectile.x, projectile.y, 15, 15);
        explode.colour = "red";
        explode.lifespan = 1;
        explode.static;
        let this_explosion;
        // Handle if the explosion should be purple (enemy) or orange (player)
        if (dieing_sprite_name=="player"){
            this_explosion = this.all_explosions.player_explosion;
        } else if (dieing_sprite_name=="enemy"){
            this_explosion = this.all_explosions.enemy_explosion;
        }
        this_explosion.scale = 10;
        this_explosion.duration = explode.lifespan * 1.2;
        this_explosion.looping = false;
        explode.asset = this_explosion
        explode.scale = 0.1;
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
        
        // Set movement attributes (speed, friction, mass)
        pew.speed = ammo.speed;
        pew.friction = ammo.friction;
        pew.mass = ammo.mass;

        // 15 seconds default safeguard (just in case)
        pew.lifespan = 15;  

        // Fetch image -> Scale it -> Attach as asset
        let image = this.all_ammo_images[type]
        image.scale = ammo.scale;
        pew.asset = image;

        // Custom stats (damage, effect, etc.)
        pew.damage = ammo.damage;

        // Set the direction to a given target
        if (target !== "none") {
            pew.direction = pew.getAngleToPoint(target[0], target[1]);
        }

        // Friendly missiles go straight up
        if (target === "none") {
            if (friendly) { pew.direction = 0; }
        }

        // Push the projectile to relevant groups
        if (friendly) { 
            this.player_projectiles.push(pew);
        } else if (!friendly) {
            this.enemy_projectiles.push(pew);
        };
        // Either way goes to "all_projectiles" group
        this.all_projectiles.push(pew);
    }

    // Clean any projectiles that leave the canvas
    clean_up_all() {
        for (let projectile of this.all_projectiles) {
            // if out-of-bounds -> remove it
            if (projectile.x < 0 || projectile.x > tad.w ||
                projectile.y < 0 || projectile.y > tad.h) {
                projectile.remove();
            }
        }
    }
};
