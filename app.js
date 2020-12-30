document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const result = document.getElementById("result");
  const replayButton = document.querySelector("button");
  const huMovesDisplay = document.getElementById("moves");
  const displayCurrentPlayer = document.getElementById("current-player");

  //create squares and circles
  for (let i = 0; i <= 48; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    grid.appendChild(square);

    const circle = document.createElement("div");
    circle.classList.add("circle");
    square.appendChild(circle);

    // for the last hidden 7 squares at the base outside of the grid
    if (i >= 42) {
      circle.classList.add("taken");
      square.style.borderColor = "white";
      square.style.borderTopColor = "black";
    }
  }

  // Replay button
  replayButton.onclick = function () {
    window.location.reload();
  };

  const winningArrays = [
    [1, 0, 2, 3],
    [39, 38, 40, 41],
    [8, 7, 9, 10],
    [32, 31, 33, 34],
    [15, 14, 16, 17],
    [25, 24, 26, 27],
    [22, 21, 23, 24],
    [18, 17, 19, 20],
    [29, 28, 30, 31],
    [11, 10, 12, 13],
    [36, 35, 37, 38],
    [4, 3, 5, 6],
    [7, 0, 14, 21],
    [27, 20, 34, 41],
    [8, 1, 15, 22],
    [26, 19, 33, 40],
    [9, 2, 16, 23],
    [25, 18, 32, 39],
    [10, 3, 17, 24],
    [24, 17, 31, 38],
    [11, 4, 18, 25],
    [23, 16, 30, 37],
    [12, 5, 19, 26],
    [22, 15, 29, 36],
    [13, 6, 20, 27],
    [21, 14, 28, 35],
    [8, 0, 16, 24],
    [25, 17, 33, 41],
    [15, 7, 23, 31],
    [18, 10, 26, 34],
    [22, 14, 30, 38],
    [11, 3, 19, 27],
    [23, 17, 29, 35],
    [12, 6, 18, 24],
    [16, 10, 22, 28],
    [19, 13, 25, 31],
    [9, 3, 15, 21],
    [26, 20, 32, 38],
    [24, 18, 30, 36],
    [11, 5, 17, 23],
    [25, 19, 31, 37],
    [10, 4, 16, 22],
    [10, 2, 18, 26],
    [23, 15, 31, 39],
    [9, 1, 17, 25],
    [24, 16, 32, 40],
    [9, 17, 25, 33],
    [16, 8, 24, 32],
    [17, 11, 23, 29],
    [18, 12, 24, 30],
    [2, 1, 3, 4],
    [3, 2, 4, 5],
    [9, 8, 10, 11],
    [10, 9, 11, 12],
    [16, 15, 17, 18],
    [17, 16, 18, 19],
    [23, 22, 24, 25],
    [24, 23, 25, 26],
    [30, 29, 31, 32],
    [31, 30, 32, 33],
    [37, 36, 38, 39],
    [38, 37, 39, 40],
    [14, 7, 21, 28],
    [15, 8, 22, 29],
    [16, 9, 23, 30],
    [17, 10, 24, 31],
    [18, 11, 25, 32],
    [19, 12, 26, 33],
    [20, 13, 27, 34],
  ];

  const circles = document.querySelectorAll(".circle");

  // functions to use
  function checkForTie() {
    const circlesArr = [...circles];
    const tie = circlesArr.every((circle) =>
      circle.classList.contains("taken")
    );
    if (tie) return (result.textContent = "It is a tie!");
  }

  function filterArr(combos, move, list) {
    const arrsWithoutMove = [];
    combos.forEach((combo) =>
      combo.includes(move) ? list.push(combo) : arrsWithoutMove.push(combo)
    );
    return arrsWithoutMove;
  }

  function findAValidMove(arr, waitsFor = []) {
    if (arr === undefined) return;
    let untaken = arr.filter(
      (ele) =>
        circles[ele + 7].classList.contains("taken") &&
        !circles[ele].classList.contains("taken")
    );
    console.log("after regular valid filter", untaken);

    if (waitsFor.length !== 0) {
      untaken = untaken.filter((ele) => !waitsFor.includes(ele));
      console.log("after waitsfor filtered ", untaken);
    }

    if (untaken.length === 0) return;

    return untaken[0];
  }

  function findPendingWin(arr, waitsFor) {
    let pendingWin = arr.filter(
      (ele) =>
        !circles[ele + 7].classList.contains("taken") &&
        !circles[ele].classList.contains("taken")
    );
    waitsFor.push(pendingWin[0] + 7);
  }

  function makeAMove(i) {
    circles[i].classList.add("taken");
    let circleColor = huPlayer ? "huPlayer" : "aiPlayer";
    return circles[i].classList.add(circleColor);
  }

  function removeArr(arrs, move) {
    return arrs.filter((arr) => !arr.includes(move));
  }

  function sortArrs(arrs, moves, listOfCounts) {
    listOfCounts.length = 0;
    let x;
    for (x in arrs) {
      let counter = 0;
      let y;
      for (y of moves) {
        if (arrs[x].includes(y)) counter += 1;
      }
      listOfCounts.push([counter, x]);
    }

    listOfCounts.sort((a, b) => {
      return a > b ? -1 : 1;
    });

    return listOfCounts.map((count) => arrs[count[1]]);
  }

  // Human Player
  let combos = JSON.parse(JSON.stringify(winningArrays));
  let huPlayerMoves = [];
  let huMatchCounts = [];
  let toBlock = [];
  let toWin = [];
  let huPlayer = true;

  // circles.forEach((circle, index) => (circle.innerText = index));
  circles.forEach((circle, index) =>
    circle.addEventListener("click", function () {
      let nextMove = findAValidMove([index]);
      if (nextMove !== undefined && huPlayer) {
        makeAMove(index);
        checkForTie();
        huPlayerMoves.unshift(index);

        // filter and remove arrs according to human player's last move
        combos = filterArr(combos, huPlayerMoves[0], toBlock);
        toWin = removeArr(toWin, huPlayerMoves[0]);

        // sort toBlock by number of matched moves to Human player's moves
        toBlock = sortArrs(toBlock, huPlayerMoves, huMatchCounts);

        if (huMatchCounts[0][0] === 4) {
          displayCurrentPlayer.innerHTML = "You win!";
          displayCurrentPlayer.style.color = "#F012BE";
          huPlayer = null;
          return;
        }

        displayCurrentPlayer.textContent = "Peanutbot's turn";
        displayCurrentPlayer.style.color = "#2ecc40";
        result.textContent = null;
        huMovesDisplay.innerText = huPlayerMoves;
        huPlayer = !huPlayer;
        setTimeout(ai, 700);
        // ai();
      } else if (huPlayer === null) {
        result.textContent = "Game Over, please replay!";
      } else {
        result.textContent = "Invalid Move!";
      }
    })
  );

  // AI Player
  const aiPlayerMoves = [];

  function ai() {
    let aiMatchCounts = [];
    let huWaitsFor = [];
    let aiWaitsFor = [];
    let concatWaitsFor;
    let nextMove;

    // sort toWin by number of AI player's matched moves
    toWin = sortArrs(toWin, aiPlayerMoves, aiMatchCounts);

    // The process of AI planning its move with moves to avoid - huWaitsFor & aiWaitsFor
    // middleMoves -> toWin --> toBlock --> combos
    // AI player has counts of 3
    for (var i in aiMatchCounts) {
      let count = aiMatchCounts[i][0];

      if (count === 3) {
        nextMove = findAValidMove(toWin[i]);
        if (nextMove !== undefined) {
          makeAMove(nextMove);
          huPlayer = null;
          displayCurrentPlayer.innerHTML = "Peanutbot wins!";
          displayCurrentPlayer.style.color = "#2ECC40";
          return;
        } else {
          console.log("invalid toWin - added move to aiWaitsFor");
          findPendingWin(toWin[i], aiWaitsFor);
        }
      }
    }

    // Find a move according to human player's matching counts
    for (i in huMatchCounts) {
      let count = huMatchCounts[i][0];

      if (count === 3) {
        console.log("use toBlock - human player has counts of 3");
        nextMove = findAValidMove(toBlock[i]);
        if (nextMove !== undefined) break;
        console.log("invalid toBlock - added move to huWaitsFor");
        findPendingWin(toBlock[i], huWaitsFor);
      }

      concatWaitsFor = huWaitsFor.concat(aiWaitsFor);

      if (count === 2) {
        console.log("use toBlock - human player has counts of 2");
        nextMove = findAValidMove(toBlock[i], concatWaitsFor);
        if (nextMove !== undefined) break;
      }
    }

    // If a move still has not been found -
    // human player has counts of 1 or none or failed to block or failed to win
    if (nextMove === undefined) {
      console.log("use middle");
      let middleMoves = [38, 31, 24, 17, 10, 3];
      nextMove = findAValidMove(middleMoves, concatWaitsFor);
    }

    if (nextMove === undefined) {
      for (var ele of toWin) {
        console.log("use toWin");
        nextMove = findAValidMove(ele, concatWaitsFor);
        if (nextMove !== undefined) break;
      }
    }

    if (nextMove === undefined) {
      for (ele of winningArrays) {
        nextMove = findAValidMove(ele, concatWaitsFor);
        console.log("use winningArrays");
        if (nextMove !== undefined) break;
      }
    }

    if (nextMove === undefined) {
      for (ele of winningArrays) {
        nextMove = findAValidMove(ele, huWaitsFor);
        console.log("use winningArrays without any aiWaitsFor");
        if (nextMove !== undefined) break;
      }
    }

    if (nextMove === undefined) {
      for (ele of winningArrays) {
        console.log("use winningArrays without any restrictions");
        nextMove = findAValidMove(ele);
        if (nextMove !== undefined) break;
      }
    }

    // filter and remove arrs according to AI's last move
    makeAMove(nextMove);
    checkForTie();
    combos = filterArr(combos, nextMove, toWin);
    toBlock = removeArr(toBlock, nextMove);
    huPlayer = !huPlayer;
    aiPlayerMoves.unshift(nextMove);
    displayCurrentPlayer.textContent = "Your turn";
    displayCurrentPlayer.style.color = "#F012BE";
    return;
  }
});
