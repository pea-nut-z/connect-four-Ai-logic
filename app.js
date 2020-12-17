document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const result = document.getElementById("result");
  const restart = document.querySelector("button");
  const movesDisplay = document.getElementById("moves");

  const displayCurrentPlayer = document.getElementById("current-player");
  let currentPlayer = "Player 1";

  restart.onclick = function () {
    location.reload();
  };

  //create squares with divs that turn into circles when it is clicked
  for (let i = 0; i <= 48; i++)
    (function (index) {
      const square = document.createElement("div");
      square.classList.add("square");
      grid.appendChild(square);

      const circle = document.createElement("div");
      circle.classList.add("circle");
      square.appendChild(circle);

      // for the last 7 squares at the base outside of the grid
      if (i >= 42) {
        circle.classList.add("taken");
        square.style.borderColor = "white";
        square.style.borderTopColor = "black";
        circle.style.borderColor = "white";
      }
    })(i);

  const winningArrays = [
    [1, 0, 2, 3],
    [39, 38, 40, 41],
    [8, 7, 9, 10],
    [32, 31, 33, 34],
    [15, 14, 16, 17],
    [25, 24, 26, 27],
    [22, 21, 23, 24],
    [18, 11, 19, 20],
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

  // Player2's automated move functions
  function filterList(arrs, move, results) {
    for (i in arrs) {
      if (arrs[i].includes(move)) {
        results.push(arrs[i]);
        arrs[i] = [];
      }
    }
  }

  function findAValidMove(arr, pendingMoves = []) {
    for (ele of arr) {
      if (ele === null) {
        continue;
      } else {
        if (pendingMoves.length != 0) {
          if (
            circles[ele + 7].classList.contains("taken") &&
            !circles[ele].classList.contains("taken") &&
            !pendingMoves.includes(ele)
          ) {
            return ele;
          }
        } else {
          if (
            circles[ele + 7].classList.contains("taken") &&
            !circles[ele].classList.contains("taken")
          ) {
            return ele;
          }
        }
      }
    }
  }

  function findPendingWin(arr) {
    for (ele of arr) {
      if (
        !circles[ele + 7].classList.contains("taken") &&
        !circles[ele].classList.contains("taken")
      ) {
        return ele;
      }
    }
  }

  function makeAMove(i) {
    circles[i].classList.add("taken");
    circles[i].classList.add("player-two");
  }

  function removeCombo(arrs, move, leftOvers) {
    for (i in arrs) {
      if (arrs[i].includes(move)) {
        for (ele of arrs[i]) {
          if (!circles[ele].classList.contains("taken")) {
            leftOvers.push(ele);
          }
        }
        arrs[i].splice(0, 4);
      }
    }
  }

  function removeEle(arr, move) {
    for (i in arr)
      if (arr[i] === move) {
        arr[i] = null;
      }
  }

  const circles = document.querySelectorAll(".circle");
  const player1Moves = [];
  const player2Moves = [];
  let toBlock = [];
  let toWin = [];
  let leftOvers = [];
  let middleMoves = [38, 31, 24, 17, 10, 3];

  function player2() {
    console.log("BEGINS");

    // filter winningArrays, toWin and middleMoves according to player1's last move
    filterList(winningArrays, player1Moves[0], toBlock);
    removeCombo(toWin, player1Moves[0], leftOvers);
    removeEle(middleMoves, player1Moves[0]);
    removeEle(leftOvers, player1Moves[0]);

    //sort toWin by number of matching moves to player2Moves from greatest to least
    let winningCounts2 = [];
    let sortedToWin = [];

    if (toWin.length != 0) {
      for (let x = 0; x < toWin.length; x++) {
        let count = 0;
        for (let y = 0; y < player2Moves.length; y++) {
          if (toWin[x].includes(player2Moves[y])) {
            count += 1;
          }
        }
        winningCounts2.push([count, x]);
      }

      winningCounts2.sort((a, b) => {
        return a > b ? -1 : 1;
      });

      for (i in winningCounts2) {
        let idx = winningCounts2[i][1];
        sortedToWin.push(toWin[idx]);
      }
      toWin = sortedToWin;
    }

    // sort toBlock by number of matching moves to player1Moves from greatest to least
    let winningCounts1 = [];
    let toBlockSorted = [];

    if (toBlock.length != 0) {
      for (let x = 0; x < toBlock.length; x++) {
        let count = 0;
        let matchedMoveArr = [];
        for (let y = 0; y < player1Moves.length; y++) {
          if (toBlock[x].includes(player1Moves[y])) {
            count += 1;
          }
        }
        winningCounts1.push([count, x]);
      }

      winningCounts1.sort((a, b) => {
        return a > b ? -1 : 1;
      });

      for (i in winningCounts1) {
        let idx = winningCounts1[i][1];
        toBlockSorted.push(toBlock[idx]);
      }
      toBlock = toBlockSorted;
    }

    // The process of player2 planning its move
    // toWin --> block --> middle -> winningArrays -> tie
    let nextMove;
    let pendingWinsNeed1 = [];
    let pendingWinsNeed2 = [];
    let concatPendingWins;
    // player 1 has matching counts of 4
    if (winningCounts1[0][0] === 4) {
      result.innerHTML = "You win!";
      result.style.color = "#F012BE";
      currentPlayer = null;
      displayCurrentPlayer.innerHTML = null;
      return;
    }

    // player 2 has matching counts of 3
    for (i in toWin) {
      if (winningCounts2[i][0] === 3) {
        nextMove = findAValidMove(toWin[i]);
        if (nextMove) {
          makeAMove(nextMove);
          result.innerHTML = "Peanutbot wins!";
          result.style.color = "#2ECC40";
          currentPlayer = null;
          displayCurrentPlayer.innerHTML = null;
          // cornify_add();
          return;
        } else {
          // console.log("player 2 has matching counts of 3, but invalid toWin");
          let pendingWin = findPendingWin(toWin[i]);
          pendingWinsNeed2.push(pendingWin + 7);
        }
      }
    }

    // player 1 has matching counts of 2 or higher, play toBlock
    for (i in toBlock) {
      if (winningCounts1[i][0] === 3) {
        // console.log("player 1 has matching counts of 3, play toBlock");
        nextMove = findAValidMove(toBlock[i]);
        if (nextMove) {
          break;
        } else {
          // console.log("player 1 has matching counts of 3, but invalid toBlock");
          let pendingWin = findPendingWin(toBlock[i]);
          pendingWinsNeed1.push(pendingWin + 7);
        }
      }

      // combine pendingWins to avoid letting player1 wins or blocking player2
      concatPendingWins = pendingWinsNeed1.concat(pendingWinsNeed2);

      if (winningCounts1[i][0] === 2) {
        // console.log("player 1 has matching counts of 2, play toBlock");
        nextMove = findAValidMove(toBlock[i], concatPendingWins);
        if (nextMove) {
          break;
        }
      }
    }

    // player 1 has counts of 1 or none, play toWin
    if (!nextMove) {
      // console.log("player 1 has counts of 1 or none, play toWin");
      for (i in toWin) {
        nextMove = findAValidMove(toWin[i], concatPendingWins);
        if (nextMove) {
          break;
        }
      }
    }

    // toWin is empty, play middle
    if (!nextMove) {
      // console.log("toWin is empty, play middle");
      nextMove = findAValidMove(middleMoves, concatPendingWins);
    }

    // middle is empty, play leftOvers with concatPendingWins restrictions
    if (!nextMove) {
      // console.log(
      //   "middle is empty, play leftOvers with concatPendingWins restrictions"
      // );
      nextMove = findAValidMove(leftOvers, concatPendingWins);
    }

    // leftOvers is empty, play winningArrays with concatPendingWins restrictions
    if (!nextMove) {
      // console.log(
      //   "middle is all taken, play winningArrays with pendingWinsNeed1 restrictions"
      // );
      for (i in winningArrays) {
        nextMove = findAValidMove(winningArrays[i], concatPendingWins);
        if (nextMove) {
          break;
        }
      }
    }

    // Removing restriction to find valid move
    // no winningArrays found with both restrictions
    // combine toWin, toBlock and winningArrays to find a move without pendingWinsNeed2 restrictions
    let combinedArrs = [leftOvers].concat(toWin, winningArrays, toBlock);

    if (!nextMove) {
      // console.log(
      //   "combine toWin, toBlock and winningArrays to find a move without pendingWinsNeed2 restrictions"
      // );
      for (i in combinedArrs) {
        nextMove = findAValidMove(combinedArrs[i], pendingWinsNeed1);
        if (nextMove) {
          break;
        }
      }
    }
    // no move found with pendingWinsNeed1 restrictions , play without any restrictions
    if (!nextMove) {
      console.log(
        "no move found with pendingWinsNeed1 restrictions , play without any restrictions"
      );
      console.log({ leftOvers });
      console.log({ combinedArrs });

      for (i in combinedArrs) {
        nextMove = findAValidMove(combinedArrs[i]);
        if (nextMove) {
          break;
        }
      }
    }

    // No moves found, game is over
    if (!nextMove) {
      // console.log("All empty, game is over");
      result.innerHTML = "It is a tie!";
      return;
    }

    // filter winningArrays, toWin and middleMoves according to player2's last move
    filterList(winningArrays, nextMove, toWin);
    removeEle(middleMoves, nextMove);
    player2Moves.unshift(nextMove);
    makeAMove(nextMove);
    removeCombo(toBlock, nextMove, leftOvers);
    removeEle(leftOvers, nextMove);
    currentPlayer = "Player 1";
    displayCurrentPlayer.textContent = "Your turn";
    displayCurrentPlayer.style.color = "#F012BE";
    movesDisplay.innerText = player1Moves;
    return;
  }

  //add an onclick to each circle in square
  for (var i = 0; i < circles.length - 7; i++)
    (function (i) {
      circles[i].onclick = function () {
        //if the square below your current square is taken, you can go ontop of it
        if (
          circles[i + 7].classList.contains("taken") &&
          !circles[i].classList.contains("taken") &&
          currentPlayer === "Player 1"
        ) {
          {
            circles[i].classList.add("taken");
            circles[i].classList.add("player-one");
            player1Moves.unshift(i);
            console.log({ player1Moves });
            //change the player
            currentPlayer = "Player 2";
            displayCurrentPlayer.innerHTML = "Peanutbot's turn";
            displayCurrentPlayer.style.color = "#2ecc40";
            setTimeout(player2, 700);
          }
          //if the square below your current square is not taken, you can't go there
        } else {
          displayCurrentPlayer.innerHTML = "Invalid Move!!!";
          displayCurrentPlayer.style.color = "red";
        }
        // alert("Invalid Move");
      };
    })(i);
});
