var direction = 0;
Block = function (game) {
        Phaser.Sprite.call(this, game, GAMEWIDTH/2, GAMEHEIGHT/2, 'player');
        this.anchor.setTo(0, 0); // set the anchor to the bottom middle
        this.alpha = 0;
    }

Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;

// This a function used to update the sight of a guard 
// and check if his sight has collided with a player.
Block.prototype.checkHit = function () {
    if(checkCol(this, player)){
        //debug.log("NextLevel plz")
        nextLevel();
    }
}

Block.prototype.restart = function (x,y) {
    this.reset(x, y);
    this.revive();
}