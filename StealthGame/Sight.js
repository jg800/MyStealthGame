var direction = 0;
Sight = function (game) {
        Phaser.Sprite.call(this, game, GAMEWIDTH/2, GAMEHEIGHT/2, 'sights');
        this.anchor.setTo(0, 0); // set the anchor to the bottom middle
        this.alpha = 0.6;
        largeSight = false;
        this.animations.add('up',    [3]);
        this.animations.add('left',  [2]);
        this.animations.add('right', [0]);
        this.animations.add('down',  [1]);
    }

Sight.prototype = Object.create(Phaser.Sprite.prototype);
Sight.prototype.constructor = Sight;

// This a function used to update the sight of a guard 
// and check if his sight has collided with a player.
Sight.prototype.seePlayer = function (x,y,r) {
    var seenPlayer;
    if(r == 0) { // up
        y -= (this.height);
        x -= (this.width/2);
        this.play('up', 1, true);
    } else if(r == 1) { // right
        y -= (this.height/2);
        this.play('right', 1, true);
    } else if(r == 2) { // down
        x -= (this.width/2);
        this.play('down', 1, true);
    } else if(r == 3) { // left
        x -= (this.width);
        y -= (this.height/2);
        this.play('left', 1, true);
    }
    this.reset(x, y);
    if(checkCol(this,player)){
        seenPlayer = true;
    } else {
        seenPlayer = false;
    }
    return seenPlayer;
}

// Used to increas the guards Sight
Sight.prototype.enlargeSight = function (enlarge) {
    if(enlarge){
        this.scale.setTo(3, 3);
    } else {
        this.scale.setTo(1, 1);
    }
}