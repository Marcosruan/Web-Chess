import { globals, elements, chess } from "../game/main.js";
import { updatePossibleMoveDisplay } from "../game/ui.js";

export function isWhiteToMove() {
  return chess.turn() === "w";
}

export function getBoardCoords(e, inverted) {
  const boardRect = elements.board.getBoundingClientRect();
  const numCols = 8;

  const cellWidth = boardRect.width / numCols;
  const cellHeight = boardRect.height / numCols;

  let coordX, coordY
  if (inverted){
    const xInsideBoard = e.clientX - boardRect.right;
    const yInsideBoard = e.clientY - boardRect.top;

    coordX = Math.floor(xInsideBoard / cellWidth) * -1;
    coordY = Math.floor(yInsideBoard / cellHeight) + 1;
  }else {
    const xInsideBoard = e.clientX - boardRect.left;
    const yInsideBoard = e.clientY - boardRect.bottom;
  
    coordX = Math.floor(xInsideBoard / cellWidth) + 1;
    coordY = Math.floor(yInsideBoard / cellHeight) * -1;
  }

  return { x: coordX, y: coordY };
}

export function translateCoords(dict) {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return `${letters[dict.x - 1]}${String(dict.y)}`;
}

export function getPieceColor(e) {
  if (e.target.classList.contains("pieces")) {
    if (e.target.classList.contains("w")) return "w";
    if (e.target.classList.contains("b")) return "b";
  }
  return undefined;
}

export function getUlCoord(nextPieceCoord) {
  let ulCoord = nextPieceCoord;
  let index = 5;
  if (!isWhiteToMove()) {
    const [file, currentRank] = nextPieceCoord.split("");
    const targetRank = parseInt(currentRank) + 4;
    ulCoord = `${file}${targetRank}`;
    index = 0;
  }
  return {
    coord: ulCoord,
    index: index,
  };
}

export async function getPiecePromotionType() {
  const { ul } = elements;
  return new Promise((resolve) => {
    ul.addEventListener(
      "mousedown",
      (e) => {
        const pieceType = e.target.classList[0];
        resolve(pieceType);
      },
      { once: true },
    );
  });
}

export function initEnPassantAttackSquare(enPassantFen) {
  globals.enPassantAttackedSquare = enPassantFen;
}

export function getCastlingSide(move) {
  if (move.flags.includes("k")) return "k";
  if (move.flags.includes("q")) return "q";
}

export function getCastlingRookInfo(castlingSide) {
  const rank = isWhiteToMove() ? "8" : "1";
  const fileMap = {
    k: { current: "h", next: "f" },
    q: { current: "a", next: "d" },
  };
  const file = fileMap[castlingSide];
  return {
    rookCurrentPosition: `${file.current}${rank}`,
    rookNextPosition: `${file.next}${rank}`,
  };
}

export function getPieceToRemove() {
  const { enPassantAttackedSquare } = globals;
  const [file, rankStr] = enPassantAttackedSquare.split("");
  const currentRank = parseInt(rankStr);
  const targetRank = isWhiteToMove() ? currentRank + 1 : currentRank - 1;
  return `${file}${targetRank}`;
}

export function getPossibleCastlingSide(possibleMovesList) {
  let queenSide = 0,
    kingSide = 0;
  possibleMovesList.forEach((move) => {
    if (move === "O-O") kingSide++;
    if (move === "O-O-O") queenSide++;
  });
  if (kingSide && queenSide) return kingSide + queenSide;
  return queenSide;
}

export function getPossibleCastlingCoord(queenSide) {
  const file = queenSide ? "c" : "g";
  const rank = isWhiteToMove() ? "1" : "8";
  return `${file}${rank}`;
}

export function verifyAttackedPiece(possibleMoveElement) {
  const pieces = document.querySelectorAll(".pieces:not(.moved)");
  const coord = possibleMoveElement.classList[0];
  pieces.forEach((divPiece) => {
    updatePossibleMoveDisplay(
      possibleMoveElement,
      divPiece.classList.contains(coord) ||
        coord === globals.enPassantAttackedSquare,
    );
  });
}

export function isBoardInverted(){
  return elements.board.classList.contains('board-flipped') ? true : false;
}
