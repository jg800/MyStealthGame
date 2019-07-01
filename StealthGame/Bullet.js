var bspeed = 7;
var dir;
// Create Bullet
Bullet = function (game) {
        Phaser.Sprite.call(this, game, 20,20,'bullet');
        this.anchor.setTo(0.5, 0.5);
        this.kill();
        me = this;
    }

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;
// Used to intialize bullet
Bullet.prototype.restart = function (x,y,direction) {
    console.log("Restart bullet");
    this.dir = direction;
    this.reset(x, y);
    this.angle = 45;
    this.revive();
}

// Updates the bullet checking whether we have hit the player or scenery
Bullet.prototype.updateMe = function () {
    var myTilePosX = Math.floor(this.x / world.map.tileWidth);
    var myTilePosY = Math.floor(this.y / world.map.tileWidth);
    if(checkCol(this,player)){
        player.decHealth();
        //console.log('player death');
        this.kill();
    } else if(world.map.getTile(myTilePosX, myTilePosY).index != 36 ||
       this.x < 0 || this.y < 0 || this.x > GAMEWIDTH || this.y > GAMEHEIGHT){
        game.sound.play('hit_wall');
       this.kill();
    } else {
        this._move();
    }
}

// Move the bullet in direction dir
Bullet.prototype._move = function () {
    if(this.dir == 0) {
        this.y -= bspeed;
    } else if (this.dir == 1) {
        this.x += bspeed;
    } else if(this.dir == 2) {
        this.y += bspeed;
    } else if(this.dir == 3) {
        this.x -= bspeed;
    }
}