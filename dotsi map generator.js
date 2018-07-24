var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = async (event, context) => {

	var mapId = 01;
	
	console.log("loop");
	var thisMap = {
		ID: mapId,
		Map: [ 	
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11, 
			11, 11, 11, 11, 11, 11, 11  
		], 
		Moves: null
	};

	var startingPosition = Math.floor((Math.random() * 84) + 1);
	
	thisMap.Map[startingPosition] = 0;
	
	var makeFirstMovement = function(startingPosition, thisMap) {
	    var direction = Math.floor((Math.random() * 4) + 1);
		// var direction = Math.round((Math.random(4) * 10)+1);
		var whereToMove = 0;
		 
		if (direction == 1) {
			whereToMove = startingPosition - 7;
		} else if (direction == 2) {
			whereToMove = startingPosition + 1;
		} else if (direction == 3) {
			whereToMove = startingPosition + 7;
		} else if (direction == 4) {
			whereToMove = startingPosition - 1;
		}
		
		// make first movement
		if (canMoveThere(startingPosition, whereToMove, thisMap.Map) == true) {
			// move there 
			thisMap.Map[whereToMove] = 1;

			return {
				position:whereToMove,
				map: thisMap
			};
		} else {
			// don't move there 
			return makeFirstMovement(startingPosition, thisMap);
		}
	};

	// make first movement
	let result = makeFirstMovement(startingPosition, thisMap);
	
	var currentPosition = result.position;

	thisMap = result.map;

	
	for (var i= 0; i < 45; i++) {
		var fail = false;

		makeGeneralMovement(currentPosition, thisMap, [],
			(returnedSuccessValue)=> {
				currentPosition = returnedSuccessValue.currentPosition;
				thisMap = returnedSuccessValue.thisMap;
			}, 
			(returnedFailValue)=> {	
				// return;
				// console.log("returnedFailValue");
				thisMap = returnedFailValue;
				thisMap.Moves = i;
				// console.log("len = " + thisMap.Map.length);
				fail = true;
				return;
			}
		);
		if (fail == true) {
			thisMap.Moves = i;
			break;
		}
		if (i == 45) {
			console.log("len = " + thisMap.Map.length);
			thisMap.Moves = 47;
			break;
		}
	}
	
	thisMap.Map.forEach((item, index, array) => {
		if (thisMap.Map[index] == 11) {
			var randWall = Math.floor((Math.random() * 100) + 1);
			if (randWall > 70) {
				thisMap.Map[index] = 4;
			} else {
				thisMap.Map[index] = 3;
			}
		}
		if (thisMap.Map[index] == 1) {
			thisMap.Map[index] = 2;
		}
	});

	context.succeed(thisMap);
};

function makeGeneralMovement(currentPosition, thisMap, triedNumbers, returnedSuccessValue, returnedFailValue) {
	
	var direction;
	if (triedNumbers.length > 0) {
		
	    var array = [1,2,3,4];
		
		triedNumbers.forEach((directionItem, directionIndex, directionArray) => {
			var thisindex = array.indexOf(directionItem);
			if (thisindex != -1) {
			    array.splice(thisindex, 1);
			}
			
		});
		var num = direction = Math.floor((Math.random() * array.length));
		
		direction = array[num];
		
	} else {

	    direction = Math.floor((Math.random() * 4) + 1);
		
	}
	
	var howFarToMove = Math.floor((Math.random() * 12) + 1);
	
	var whereToMove;
	// console.log("direction = "+ direction);
	if (direction == 1) {
		whereToMove = currentPosition - 7;
	} else if (direction == 2) {
		whereToMove = currentPosition + 1;
	} else if (direction == 3) {
		whereToMove = currentPosition + 7;
	} else if (direction == 4) {
		whereToMove = currentPosition - 1;
	}
	
	// make general movement
	if (canMoveThere(currentPosition, whereToMove, thisMap.Map) == true) {
		// move there 
		thisMap.Map[whereToMove] = 1;
		
		currentPosition = whereToMove;
		
		for (var i= 0; i < howFarToMove; i++) {
			
			if (direction == 1) {
				whereToMove = currentPosition - 7;
			} else if (direction == 2) {
				whereToMove = currentPosition + 1;
			} else if (direction == 3) {
				whereToMove = currentPosition + 7;
			} else if (direction == 4) {
				whereToMove = currentPosition - 1;
			}	
			
			if (canMoveThere(currentPosition, whereToMove, thisMap.Map) == true) {		
				if (i == howFarToMove - 1) {
					thisMap.Map[whereToMove] = 1;
					
					currentPosition = whereToMove;
				} else {
					break;
				}
			}
		}
		
		returnedSuccessValue( 
			{
				currentPosition: currentPosition,
				thisMap: thisMap
			}
		);
	} else {

		triedNumbers.push(direction);
		// console.log("triedNumbers =" + triedNumbers);
		if (triedNumbers.length == 4) {
			returnedFailValue(thisMap);
		} else {							
			makeGeneralMovement(currentPosition, thisMap, triedNumbers, returnedSuccessValue, returnedFailValue);
		}
	}
}

function canMoveThere(currentPosition, whereToMove, map) {
    
	if ((currentPosition == 6 && whereToMove == 7) || (currentPosition == 13 && whereToMove == 14) || (currentPosition == 20 && whereToMove == 21) || (currentPosition == 27 && whereToMove == 28) || (currentPosition == 34 && whereToMove == 35) ||
	    (currentPosition == 41 && whereToMove == 42) || (currentPosition == 48 && whereToMove == 49) || (currentPosition == 55 && whereToMove == 56) || (currentPosition == 62 && whereToMove == 63) || (currentPosition == 69 && whereToMove == 70) ||
	    (currentPosition == 76 && whereToMove == 77) || (currentPosition == 7 && whereToMove == 6) || (currentPosition == 14 && whereToMove == 13) || (currentPosition == 21 && whereToMove == 20) || (currentPosition == 28 && whereToMove == 27) ||
	    (currentPosition == 35 && whereToMove == 34) || (currentPosition == 42 && whereToMove == 41) || (currentPosition == 49 && whereToMove == 48) || (currentPosition == 56 && whereToMove == 55) || (currentPosition == 63 && whereToMove == 62) || 
	    (currentPosition == 70 && whereToMove == 69) || (currentPosition == 77 && whereToMove == 76) || whereToMove > 83 || whereToMove < 0 || map[whereToMove] == 1 || map[whereToMove] == 0){
		return false;
	} else {
	    return true;
	}
}


