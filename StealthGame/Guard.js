Guard = function (world, game, key_str) {//, xPos, yPos, patrolLoactions, inloop) {
    var played = false;
    var _self = this;
    // Next index of the patrol loction
    var currentPathLoc = 0;
    // All locations guard tarvels to
    var _patrol;
    // Whether the guard will loop around the loctions
    var loop;
    // Used to check if guard is moving foarwad through partol array
    var forwad = true;
    // State whether player is found
    var found = false;
    // Check if arived at next loction
    var arived = true;
    // Set the velocity of guard movement
    var _VELOCITY = 60;
    // Used to check if in pursuit of player
    var pursuit = false;
    // Used to set if guard is nocked out
    var knockedOut = false;
    // Delay used for next bullet fire
    var delay = 0;
    var bulletDelayTime = 40;
    var maxbullets = 4;
    // Craete bullets
    var bullet_grp = game.add.group();
    for (i = 0; i < maxbullets; i++) {
        bullet_grp.add(new Bullet(game));
    }
    bullet_grp.enableBody = true;
    // Create Sight
    var sight = game.add.existing(new Sight(game));
    var _myPath = {
        path_ary: []
    };
    
    var _myTileX, _myTileY, _xDir, _yDir;

    // Move the in direction xdir ydir
    var _move = function (xDir, yDir) {
        if(!(found || knockedOut)){
            this.body.velocity.x = xDir * _VELOCITY;
            this.body.velocity.y = yDir * _VELOCITY;
        } else {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
        
        // add
        if(yDir > 0){
			 this.play('down', 2, true);
		} else if(yDir < 0){
			 this.play('up', 2, true);
		} else if(xDir > 0){
			 this.play('left', 2, true);
		} else if(xDir < 0){
			 this.play('right', 2, true);
		} else if( knockedOut == true){
			this.play('idle' , 1, true);
		}
    }.bind(this); //_move()

    // Used to update direction depedent on its interal _path
    var _updateMove = function () {
        _myTileX = world.groundLayer.getTileX(_self.x);
        _myTileY = world.groundLayer.getTileY(_self.y);
        // Only consider moving if there is a path
        if (_myPath.path_ary.length !== 0) {
            //check if at current destination tile
            if (_myTileX === _myPath.path_ary[0].x && _myTileY === _myPath.path_ary[0].y) {
                //check whether there are any more tiles in path
                if (_myPath.path_ary.length > 1) {
                    //get next destination tile
                    _myPath.path_ary.shift();
                    // calculate move direction
                    _xDir = _myPath.path_ary[0].x - _myTileX;
                    _yDir = _myPath.path_ary[0].y - _myTileY;
                } else {
                    _myPath.path_ary = [];
                    arived = true;
                    if(found = true){
                       found = false;
                    } if(loop == true){
                         if(currentPathLoc == (_patrol.length)-1){
                            currentPathLoc = 0;
                         } else {
                            currentPathLoc++;
                         }
                    } else if(forwad){
                        if(currentPathLoc == (_patrol.length)-1){
                            forwad = false;
                            currentPathLoc--;
                        } else {
                            currentPathLoc++;
                        }
                    } else {
                        if(currentPathLoc == 0){
                            forwad = true;
                            currentPathLoc++;
                        } else {
                            currentPathLoc--;
                        }
                    }
                    
                }
            } // end of getting next tile in path
        } // end of working out next move
        _move(_xDir, _yDir);
    }; // end of _updateMove()
    
    // Resets the guard to position (xpos,ypos) and sets its patrol ...
    // loactions and whether the guard will loop back to the first location
    this.restart = function (xPos, yPos, patrolLoactions, inloop) {
        _patrol = patrolLoactions;
        loop = inloop[0];
        _xDir = 0;
        _yDir = 0;
        currentPathLoc = 0;
        forwad = true;
        found = false;
        arived = true;
        pursuit = false;
        knockedOut = false;
        delay = 0;
        this.reset(xPos,yPos)
        this.revive();
        sight.revive();
    }
    
    // Used to update the movement of the bullets
    this.updateBullet = function (){
        bullet_ary = bullet_grp.children;
        for (x = 0; x < bullet_ary.length; x++) {
            if (bullet_ary[x].exists) {
                bullet_ary[x].updateMe();
            }
        }
        delay--;
    }
    
    // Used to fire the weapon where the guard is looking
    this.fire = function (){
        if(delay <= 0){
            game.sound.play('shot');
            bullet_ary = bullet_grp.children;
            for (x = 0; x < bullet_ary.length; x++) {
                if (!(bullet_ary[x].exists)) {
                    if(_xDir > 0){
                        // right
                        bullet_ary[x].restart(this.x,this.y,1);
                    } else if (_xDir < 0) {
                        // left
                        bullet_ary[x].restart(this.x,this.y,3);
                    } else if (_yDir < 0) {
                        // up
                        bullet_ary[x].restart(this.x,this.y,0);
                    } else if (_yDir > 0) {
                        // down
                        bullet_ary[x].restart(this.x,this.y,2);
                    }
                    x = bullet_ary.length;
                }
            }
            delay = bulletDelayTime;
        }
    }

    // Change the direction of the flash light of this guard
    this._updateSight = function () {
        var answer;
        if(_xDir > 0){
            // right
            answer = sight.seePlayer(Math.floor(this.x),Math.floor(this.y),1);
        } else if (_xDir < 0) {
            // left
            answer = sight.seePlayer(Math.floor(this.x),Math.floor(this.y),3)
        } else if (_yDir < 0) {
            // up
            answer = sight.seePlayer(Math.floor(this.x),Math.floor(this.y),0)
        } else if (_yDir > 0) {
            // down
            answer = sight.seePlayer(Math.floor(this.x),Math.floor(this.y),2)
        }
        return answer;
    }
    
    // Used to remove all objects ascociated to the guard
    this.myKill = function() {
        sight.enlargeSight(false);
        sight.kill();
        this.kill();
    }
    
    // Used to check if a guard has spotted the player.
    this.checkSight = function() {
        if(!knockedOut){
            if(this._updateSight()){
                this.fire();
                if(found == false){
                    found = true;
                    sight.enlargeSight(true);
                }
            } else if(found == true){
                this.foundPlayer();
                found = false;
                pursuit = true;
            }
        }
    }
    
    // Check if guard collides with Player
    this.checkKnockedOut = function (){
        
        if(checkCol(this,player)){
            console.log("snap");
           if(played == false){
			    game.sound.play('punch');
				played = true;
			}
            knockedOut = true;
            sight.kill();
        }
    }

    // Used to call methods to update all of guard responsiblitys
    this.update = function () {
        _updateMove();
        this.checkSight();
        this.checkArived();
        this.checkKnockedOut();
        this.updateBullet();
    };
    
    // Used to asighn the guard the next location to travel to
    this.checkArived = function (){
        if(arived){
            if(pursuit){
                //this.investigate();
                pursuit = false;
                sight.enlargeSight(false);
            }
            this.nextLocation()
        }
    }
    
    // Call back function used in easyStar
    var _updateMyPath = function (path) {
        _myPath.path_ary = path || [];
        // USE THIS IF YOU WANT TO SEE THE GUARDS  PATROL LOCATIONS
        //for (var i = 0, ilen = _myPath.path_ary.length; i < ilen; i++) {
            //if(ilen == i+1){
                //
            //    world.map.putTile(46, _myPath.path_ary[i].x, _myPath.path_ary[i].y);
            //}
        //}
    };
    
    // Sets the guards next locaton to the players location
    this.foundPlayer = function () {
        arived = false;
        this.findPathTo(world.groundLayer.getTileX(player.x),world.groundLayer.getTileY(player.y));
    };
    
    // Sets the guards next locaton to the next patrol location
    this.nextLocation = function () {
        arived = false;
        this.findPathTo(_patrol[currentPathLoc][0],_patrol[currentPathLoc][1]);
    };
    
    // Used to set the location of the guards nect loction using the easy algo
    this.findPathTo = function (targetTileX, targetTileY) {
        game.pathfinder.setCallbackFunction(_updateMyPath);
        game.pathfinder.preparePathCalculation([_myTileX, _myTileY], [targetTileX, targetTileY]);
        game.pathfinder.calculatePath();
    }.bind(this);

    Phaser.Sprite.call(this, game, 0, 0, key_str, 0);
    this.anchor.set(0.5, 0.5);
    this.kill();
    sight.kill();
    _xDir;
    _yDir;
    _myTileX = world.groundLayer.getTileX(_self.x);
    _myTileY = world.groundLayer.getTileY(_self.x);
    game.physics.arcade.enable(this);
    this.animations.add('right', [16,17]);
    this.animations.add('left', [8,9]);
	this.animations.add('up', [4,5]);
    this.animations.add('down', [12,13]);
	this.animations.add('idle', [2]);
};

Guard.prototype = Object.create(Phaser.Sprite.prototype);
Guard.prototype.constructor = Guard;