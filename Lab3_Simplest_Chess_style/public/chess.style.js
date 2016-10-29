var debug = {
  outChar: false,
  mouseCoords: false
};

var defaults = {
  unitLength: 60, // Height / Width of a square
  fontSize: 40,
  startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  colors: {
    inactiveDark: 'rgb(192,192,255)',
    inactiveLight: 'rgb(255,255,255)',
    active: 'rgb(127,255,255)'
  }
};

var activeSquare = null;

var pieceCharMap = {
  white: {
    king: "\u2654",
    queen: "\u2655",
    rook: "\u2656",
    bishop: "\u2657",
    knight: "\u2658",
    pawn: "\u2659"
  },
  black: {
    king: "\u265a",
    queen: "\u265b",
    rook: "\u265c",
    bishop: "\u265d",
    knight: "\u265e",
    pawn: "\u265f"
  }
};

var pieceSymbolMap = {
  'K': {
    color: 'white',
    name: 'king'
  },
  'Q': {
    color: 'white',
    name: 'queen'
  },
  'R': {
    color: 'white',
    name: 'rook'
  },
  'N': {
    color: 'white',
    name: 'knight'
  },
  'B': {
    color: 'white',
    name: 'bishop'
  },
  'P': {
    color: 'white',
    name: 'pawn'
  },

  'k': {
    color: 'black',
    name: 'king'
  },
  'q': {
    color: 'black',
    name: 'queen'
  },
  'r': {
    color: 'black',
    name: 'rook'
  },
  'n': {
    color: 'black',
    name: 'knight'
  },
  'b': {
    color: 'black',
    name: 'bishop'
  },
  'p': {
    color: 'black',
    name: 'pawn'
  },
};

var armies = {
  white: [{
    type: 'K',
    loc: [0, 4]
  }, {
    type: 'Q',
    loc: [0, 3]
  }, {
    type: 'R',
    loc: [0, 0]
  }, {
    type: 'R',
    loc: [0, 7]
  }, {
    type: 'B',
    loc: [0, 2]
  }, {
    type: 'B',
    loc: [0, 5]
  }, {
    type: 'N',
    loc: [0, 1]
  }, {
    type: 'N',
    loc: [0, 6]
  }, {
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
    type: 'k',
    loc: [7, 4]
  }, {
    type: 'q',
    loc: [7, 3]
  }, {
    type: 'r',
    loc: [7, 0]
  }, {
    type: 'r',
    loc: [7, 7]
  }, {
    type: 'b',
    loc: [7, 2]
  }, {
    type: 'b',
    loc: [7, 5]
  }, {
    type: 'n',
    loc: [7, 1]
  }, {
    type: 'n',
    loc: [7, 6]
  }, {
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
  for (i = 0; i < 8; i++) {
    for (j = 0; j < 8; j++) {
      drawSquare(ctx, i, j);
    }
  }
}

function drawPiece(ctx, char, row, col) {
  var x = defaults.unitLength * col + (defaults.unitLength - defaults.fontSize) / 2;
  var y = defaults.unitLength * row - (defaults.unitLength - defaults.fontSize) / 4;
  var outChar = pieceCharMap[pieceSymbolMap[char].color][pieceSymbolMap[char].name];
  if (!!debug.outChar) {
    console.log("outChar: " + outChar + "  x: " + x + "  y: " + y)
  }
  ctx.strokeText(outChar, x, y);
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

  if (!!debug.mouseCoords) {
    console.log([row, col]);
  }

  // Check if there is already an active square - if so, deselect it
  if (!!activeSquare) {
    var activeRow = activeSquare[0],
      activeCol = activeSquare[1];
    // Find out old piece first
    var oldPiece = getPiece(activeRow, activeCol);
    drawSquare(ctx, activeRow, activeCol); // Default
    drawPiece(ctx, oldPiece.type, activeRow, activeCol);
    activeSquare = null;

    // If this is the active square, nothing further is required
    if (activeRow === row && activeCol === col) {
      return;
    }
  }

  // Find out what piece (if any) is on the square so it can be redrawn
  var piece = getPiece(row, col);

  // If there is no piece here, return
  if (!piece) {
    return;
  }

  activeSquare = [row, col];
  drawSquare(ctx, row, col, 'active');
  drawPiece(ctx, piece.type, row, col);

}

function cbReleasePiece(evt) {}

function cbDisplayCoords(evt) {
  var x = evt.clientX;
  var y = evt.clientY;

  document.getElementById('coords').innerHTML = '(' + x + ', ' + y + ')';

}

window.onload = function() {
  var canvas = document.getElementById('board');
  var ctx = canvas.getContext('2d');

  // defaults.fontSize = defaults.unitLength * .75;
  ctx.font = defaults.fontSize + "px \"Arial Unicode MS\"";
  ctx.textBaseline = "top";

  // Draw board
  drawSquares(ctx);

  // Draw pieces
  drawArmies(ctx);

  drawPiece(ctx, 'P', 3, 3)

  // Add event handlers
  canvas.addEventListener('mousedown', cbSelectPiece);
  canvas.addEventListener('mouseup', cbReleasePiece);

  canvas.addEventListener('mousemove', cbDisplayCoords);
};
