let Coordinate = require('./coordinate.js');
let _ = require('lodash');

let Map = function(){
	this.coordinates = [];
	this.hexagons = [];
}

Map.prototype.generateHexPoints = function(inputObj){ //refactor this method
	let output = [];

	let xPlane = inputObj.xCoor == 0; 
	let yPlane = inputObj.yCoor == 0; 
	let zPlane = inputObj.zCoor == 0;

	let zEdge = xPlane && yPlane;
	let xEdge = yPlane && zPlane;
	let yEdge = zPlane && xPlane;

	let xPlaneExclusive = xPlane && !yPlane && !zPlane;
	let yPlaneExclusive = !xPlane && yPlane && !zPlane;
	let zPlaneExclusive = !xPlane && !yPlane && zPlane;

	let center = xPlane && yPlane && zPlane;
	let exceptions = function(x,y,z){
		return true;
	}

	if(center){
		xInit = inputObj.xCoor;
		xTerm = inputObj.xCoor+1;

		yInit = inputObj.yCoor;
		yTerm = inputObj.yCoor+1;

		zInit = inputObj.zCoor;
		zTerm = inputObj.zCoor+1;

		exceptions = function(x,y,z){
			return (x==inputObj.xCoor && y==inputObj.yCoor && z===inputObj.zCoor) || (x==y && y==z);
		}
	} else if(zEdge){
		xInit = inputObj.xCoor;
		xTerm = inputObj.xCoor+1;

		yInit = inputObj.yCoor;
		yTerm = inputObj.yCoor+1;

		zInit = inputObj.zCoor-1;
		zTerm = inputObj.zCoor+1;

		exceptions = function(x,y,z){
			let center = x==inputObj.xCoor && y==inputObj.yCoor && z===inputObj.zCoor;
			let pointsOnEdge = (z==inputObj.zCoor-1 && x > inputObj.xCoor || z==inputObj.zCoor-1 && y > inputObj.yCoor) ;
			let pointNotOnPlane = x>inputObj.xCoor && y>inputObj.yCoor;
			return center || pointsOnEdge || pointNotOnPlane;
		}
	} else if(xEdge){
		xInit = inputObj.xCoor-1;
		xTerm = inputObj.xCoor+1;

		yInit = inputObj.yCoor;
		yTerm = inputObj.yCoor+1;

		zInit = inputObj.zCoor;
		zTerm = inputObj.zCoor+1;

		exceptions = function(x,y,z){
			let center = x==inputObj.xCoor && y==inputObj.yCoor && z===inputObj.zCoor;
			let pointsOnEdge = (x==inputObj.xCoor-1 && z > inputObj.zCoor || x==inputObj.xCoor-1 && y > inputObj.yCoor) ;
			let pointNotOnPlane = z>inputObj.zCoor && y>inputObj.yCoor;
			return center || pointsOnEdge || pointNotOnPlane;
		}
	} else if(yEdge){
		xInit = inputObj.xCoor;
		xTerm = inputObj.xCoor+1;

		yInit = inputObj.yCoor-1;
		yTerm = inputObj.yCoor+1;

		zInit = inputObj.zCoor;
		zTerm = inputObj.zCoor+1;

		exceptions = function(x,y,z){
			let center = x==inputObj.xCoor && y==inputObj.yCoor && z===inputObj.zCoor;
			let pointsOnEdge = (y==inputObj.yCoor-1 && z > inputObj.zCoor || y==inputObj.yCoor-1 && x > inputObj.xCoor) ;
			let pointNotOnPlane = z>inputObj.zCoor && x>inputObj.xCoor;
			return center || pointsOnEdge || pointNotOnPlane;
		}
	} else if(xPlaneExclusive){
		xInit = inputObj.xCoor;
		xTerm = inputObj.xCoor;

		yInit = inputObj.yCoor-1;
		yTerm = inputObj.yCoor+1;

		zInit = inputObj.zCoor-1;
		zTerm = inputObj.zCoor+1;

		exceptions = function(x,y,z){
			let center = x==inputObj.xCoor && y==inputObj.yCoor && z===inputObj.zCoor;
			let endCorners = z==inputObj.zCoor-1 && y == inputObj.yCoor +1 || y==inputObj.yCoor-1  && z == inputObj.zCoor +1;
			return center || endCorners;
		}
	} else if(yPlaneExclusive){
		xInit = inputObj.xCoor-1;
		xTerm = inputObj.xCoor+1;

		yInit = inputObj.yCoor;
		yTerm = inputObj.yCoor;

		zInit = inputObj.zCoor-1;
		zTerm = inputObj.zCoor+1;

		exceptions = function(x,y,z){
			let center = x==inputObj.xCoor && y==inputObj.yCoor && z===inputObj.zCoor;
			let endCorners = z==inputObj.zCoor-1 && x == inputObj.xCoor +1 || x==inputObj.xCoor-1  && z == inputObj.zCoor +1;
			return center || endCorners;
		}
	}  else if(zPlaneExclusive){
		xInit = inputObj.xCoor-1;
		xTerm = inputObj.xCoor+1;

		yInit = inputObj.yCoor-1;
		yTerm = inputObj.yCoor+1;

		zInit = inputObj.zCoor;
		zTerm = inputObj.zCoor;

		exceptions = function(x,y,z){
			let center = x==inputObj.xCoor && y==inputObj.yCoor && z===inputObj.zCoor;
			let endCorners = y==inputObj.yCoor-1 && x == inputObj.xCoor +1 || x==inputObj.xCoor-1  && y == inputObj.yCoor +1;
			return center || endCorners;
		}
	} else {
		return false;
	} 

	for(let i=xInit; i<=xTerm; i++){
		for(let ii=yInit; ii<=yTerm; ii++){
			for(let iii=zInit; iii<=zTerm; iii++){
				if(exceptions(i,ii,iii)){
					continue
				}
				output.push({xCoor: i, yCoor: ii, zCoor: iii});
			}
		}
	}

	return _.sortBy(output, ['xCoor', 'yCoor', 'zCoor']);
}

Map.prototype.generateHexTile = function(inputCoord){
	let output = {
		coordinates: [],
		center: inputCoord
	};

	let startX;
	let startY;
	let startZ;

	xPlane = inputCoord.xCoor == 0; 
	yPlane = inputCoord.yCoor == 0; 
	zPlane = inputCoord.zCoor == 0;

	output.coordinates=this.generateHexPoints(inputCoord);

	return output;
}

Map.prototype.generateHexTiles = function(){
	let coords = this.coordinates;

	for(var i=0; i<coords.length; i++){
		this.hexagons.push(this.generateHexTile(coords[i]));
	}
}
Map.prototype.generateCoordinates = function(input){
	if(input == undefined || input.constructor != Number){
		throw 'invalid input, generateMap method requires Number'
	}

	for(let i=0; i<=2; i++){ //3 planes
		for(let ii=0; ii<input; ii++){
			let dir = {
				xCoor: undefined,
				yCoor: undefined,
				zCoor: undefined,
				plane: undefined
			};
			for(let iii=0; iii<input; iii++){
				switch(i){
					case 0:
						dir.xCoor = ii;
						dir.yCoor = iii;
						dir.zCoor = 0;
					break;
					case 1:
						dir.xCoor = iii
						dir.zCoor = ii;
						dir.yCoor = 0;
					break;
					case 2:
						dir.yCoor = ii;
						dir.zCoor = iii;
						dir.xCoor = 0;
					break;
					default:
					break;
				}
				if(_.find(this.coordinates, dir))continue; //ignore duplicates
				this.coordinates.push(new Coordinate(dir.xCoor, dir.yCoor, dir.zCoor, dir.plane));
			}
		}	
	}
}

module.exports = Map;