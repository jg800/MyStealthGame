var pspeed = 3;
var plength = 36;
var health = 2;
var myTileX;
var myTileY;
// Aisghn anitial postion with the player keys and animation for left and right
Player = function (game, keys) {
        Phaser.Sprite.call(this, game, GAMEWIDTH/2, GAMEHEIGHT/2, 'player');
        this.anchor.setTo(0.5, 0.5); // set the anchor to the bottom middle
    //-------------------------------------------------------------------------------
        this.animations.add('right', [8,9]);
        this.animations.add('left', [16,17]);
	    this.animations.add('up', [4,5]);
        this.animations.add('down', [12,13]);
	    this.animations.add('idle', [2]);
    //-------------------------------------------------------------------------------
        this.cursors = keys;
        this.frame = 0;
    } //Player()

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// Used to intialize player
Player.prototype.restart = function (x,y) {
    this.reset(x[0], y[0]);
    this.revive();
}

Player.prototype.decHealth = function () {
    if(health == 1){
        this.kill();
        gameOver();
    } else {
        health -= 1;
        console.log('hit '+ health);
    }
}

// Checks keys for player movement  and ensure player cannot move past screen or tile map objects
Player.prototype.updateMe = function () {
    myTileX = Math.floor(this.x / world.map.tileWidth);
    myTileY = Math.floor(this.y / world.map.tileHeight);
    //-------------------------------------------------------------------------------start
    //change current code(code has brackets to close this function and adds another function in this code)
    if(this.cursors.right.isDown){
        if (this.x < GAMEWIDTH -plength && Player.prototype.checkTile(0)) {
            this.x += pspeed;
            player.play('right', 5, true);
        }
    } else if(this.cursors.left.isDown && Player.prototype.checkTile(1)){
        if (this.x > 0) {
            this.x -= pspeed;
            player.play('left', 5, true);
        }
    }
    if(this.cursors.down.isDown && Player.prototype.checkTile(2)){
        if (this.y < GAMEHEIGHT-plength) {
            this.y += pspeed;
            player.play('down', 5, true);
        }
    } else if(this.cursors.up.isDown && Player.prototype.checkTile(3)){
        if (this.y > 0) {
            this.y -= pspeed;
            player.play('up', 5, true);
        }
       
    }
	else if(this.cursors.up.isUp && this.cursors.down.isUp && this.cursors.left.isUp && this.cursors.right.isUp)
		{
			 player.play('idle', 1, true);
		}
}

function walk(){
	 if(cursors.right.isDown){
			game.sound.play('footstep');
    } else if(cursors.left.isDown){
			game.sound.play('footstep');
    }
    if(cursors.down.isDown){
			game.sound.play('footstep');
    } else if(cursors.up.isDown){
			game.sound.play('footstep');
	}
}

 //-------------------------------------------------------------------------------end
// Check if we can move into next tile
Player.prototype.checkTile = function (dir) {
    var answer = false;
    if(dir == 0){
        if(Math.floor(world.map.getTile(myTileX+1,+myTileY).index == 36)){
            answer = true; 
        }
    } else if(dir == 1){
        if(Math.floor(world.map.getTile(myTileX-1,+myTileY).index == 36)){
            answer = true;
        }
    } else if(dir == 2){
        if(Math.floor(world.map.getTile(myTileX,+myTileY+1).index == 36)){
            answer = true;
        }
    } else if(dir == 3){
        if(Math.floor(world.map.getTile(myTileX,+myTileY-1).index == 36)){
            answer = true;
        }
    }
    return answer;
}

Player.prototype.destroy = function (){
    this.kill();
}