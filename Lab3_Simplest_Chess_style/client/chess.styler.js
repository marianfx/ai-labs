
var sweetAlert = require("sweetAlert");

var defaults = {
  unitLength: 60, // Height / Width of a square
  fontSize: 40,
  startingFen: '8/pppppppp/8/8/8/8/PPPPPPPP/8',
  colors: {
    inactiveDark: 'rgb(192,192,255)',
    inactiveLight: 'rgb(255,255,255)',
    active: 'rgb(127,255,255)'
  }
};

var activeSquare = null;
var activePiece = null;

var pieceCharMap = {
  white: {
    pawn: "\u2659"
  },
  black: {
    pawn: "\u265f"
  }
};

var pieceSymbolMap = {
  'P': {
    color: 'white',
    name: 'pawn'
  },
  'p': {
    color: 'black',
    name: 'pawn'
  },
};

var armies = {
  white: [{
    type: 'P',
    loc: [1, 0]
  }, {
    type: 'P',
    loc: [1, 1]
  }, {
    type: 'P',
    loc: [1, 2]
  }, {
    type: 'P',
    loc: [1, 3]
  }, {
    type: 'P',
    loc: [1, 4]
  }, {
    type: 'P',
    loc: [1, 5]
  }, {
    type: 'P',
    loc: [1, 6]
  }, {
    type: 'P',
    loc: [1, 7]
  }],
  black: [{
    type: 'p',
    loc: [6, 0]
  }, {
    type: 'p',
    loc: [6, 1]
  }, {
    type: 'p',
    loc: [6, 2]
  }, {
    type: 'p',
    loc: [6, 3]
  }, {
    type: 'p',
    loc: [6, 4]
  }, {
    type: 'p',
    loc: [6, 5]
  }, {
    type: 'p',
    loc: [6, 6]
  }, {
    type: 'p',
    loc: [6, 7]
  }]
};

function drawSquare(ctx, row, col, style) {
  var len = defaults.unitLength;
  if (!!style) {
    ctx.fillStyle = defaults.colors[style];
  } else if (row % 2 === col % 2) {
    // Light on Right
    ctx.fillStyle = defaults.colors.inactiveLight;
  } else {
    ctx.fillStyle = defaults.colors.inactiveDark;
  }
  ctx.fillRect(len * col, len * row, len, len);
}

function drawSquares(ctx) {
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      drawSquare(ctx, i, j);
    }
  }
}

function drawPiece(ctx, char, row, col) {
  var x = defaults.unitLength * col + (defaults.unitLength - defaults.fontSize) / 2;
  var y = defaults.unitLength * row - (defaults.unitLength - defaults.fontSize) / 4;
  var color = pieceSymbolMap[char].color;
  var symb = pieceSymbolMap[char].name;
  var outChar = pieceCharMap[color][symb];
  ctx.strokeText(outChar, x, y);
}

function undrawPiece(ctx, row, col) {
  drawSquare(ctx, row, col);
}

function drawPiecesFen(ctx, fen) {
  if (!fen) {
    fen = defaults.startingFen;
  }

  var row = 7,
    col = 0;
  for (var i = 0; i < fen.length; i++) {
    var char = fen.charAt(i);
    if (char === '/') { // "Newline"
      row--;
      col = 0;
    } else if (char.match(/\d/)) {
      col += parseInt(char, 10); // "Spacer"
    } else { // Piece
      drawPiece(ctx, char, row, col);
      col++;
    }
  }

}

function drawArmies(ctx) {
  for (var army in armies) {
    if (armies.hasOwnProperty(army)) {
      for (var i = 0; i < armies[army].length; i++) {
        var piece = armies[army][i];
        drawPiece(ctx, piece.type, piece.loc[0], piece.loc[1]);
      }
    }
  }
}

/**
 * Return the piece on that square, otherwise null
 */
function getPiece(row, col) {
  for (var army in armies) {
    if (armies.hasOwnProperty(army)) {
      for (var i = 0; i < armies[army].length; i++) {
        var piece = armies[army][i];
        if (piece.loc[0] === row && piece.loc[1] === col) {
          return piece;
        }
      }

    }
  }
  return null;
}

function cbSelectPiece(evt) {
  // Get square coordinates of click

  // console.log(evt);
  var canvas = evt.target;
  var ctx = canvas.getContext('2d');

  var row = Math.floor((evt.y - 8) / defaults.unitLength);
  var col = Math.floor((evt.x - 8) / defaults.unitLength);

  // Check if there is already an active square - if so, deselect it
  // if (!!activeSquare) {
  //   var activeRow = activeSquare[0],
  //     activeCol = activeSquare[1];
  //   // Find out old piece first
  //   var oldPiece = getPiece(activeRow, activeCol);
  //   drawSquare(ctx, activeRow, activeCol); // Default
  //   drawPiece(ctx, oldPiece.type, activeRow, activeCol);
  //   activeSquare = null;

  //   // If this is the active square, nothing further is required
  //   if (activeRow === row && activeCol === col) {
  //     return;
  //   }
  // }

  // Find out what piece (if any) is on the square so it can be redrawn
  activePiece = getPiece(row, col);

  // If there is no piece here, return
  if (!activePiece) {
    return;
  }

  if(activePiece.type != 'p'){
    sweetAlert("Oops...", "You can move your pieces only!", "error");
  }

  // activeSquare = [row, col];
  // drawSquare(ctx, row, col, 'active');
  // drawPiece(ctx, activePiece.type, row, col);

}

function cbReleasePiece(evt) {
  //check if valid
  //if valid, drop piece there
  var canvas = evt.target;
  var ctx = canvas.getContext('2d');

  var row = Math.floor((evt.y - 8) / defaults.unitLength);
  var col = Math.floor((evt.x - 8) / defaults.unitLength);

  // If there is no piece here, return
  if (!activePiece) {
    return;
  }

  if(activePiece.type != 'p'){
    sweetAlert("Oops...", "You can move your pieces only!", "error");
  }

  movePieceVisually(ctx, 'p', activePiece.loc[0], activePiece.loc[1], row, col);
}

function movePieceVisually(ctx, char, srow, scol, erow, ecol){
  undrawPiece(ctx, srow, scol);
  drawPiece(ctx, char, erow, ecol);
  var color = 'black'
  if(char == 'P')
    color = 'white'

  for(var i = 0; i < 8; i++){
	  if(armies[color][i].loc[0] == srow && armies[color][i].loc[1] == scol){
        armies[color][i].loc[0] = erow;
        armies[color][i].loc[1] = ecol;
	  }
  }
}

function prepareChessBoard() {
  var canvas = document.getElementById('board');
  var ctx = canvas.getContext('2d');

  // defaults.fontSize = defaults.unitLength * .75;
  ctx.font = defaults.fontSize + "px \"Arial Unicode MS\"";
  ctx.textBaseline = "top";

  // Draw board
  drawSquares(ctx);

  // Draw pieces
  drawArmies(ctx);

  // Add event handlers
  canvas.addEventListener('mousedown', cbSelectPiece);
  canvas.addEventListener('mouseup', cbReleasePiece);
};

export { prepareChessBoard, movePieceVisually };
