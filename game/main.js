import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.0.0-beta.8/+esm";
import * as game from "./gameRules.js";
import * as ui from "./ui.js";
import * as utils from "../scripts/utils.js";
import { saveFen, localStorageController } from "../scripts/saveGame.js";
import { createGameOverParagraph } from '../scripts/gameOver.js'

export const chess = new Chess();
export const COORD_REGEX = /([a-h][1-8])/;

export const globals = {
  enPassantAttackedSquare: null,
  currentPieceCoord: null,
  nextPieceCoord: null,
  possibleMovesList: null,
  promoting: null,
};

export const elements = {
  gameOver: false,
  board: document.querySelector("#chess-board"),
  get whiteKing() {
    return this.board?.querySelector(".wk");
  },
  get blackKing() {
    return this.board?.querySelector(".bk");
  },
  get checkKing() {
    return this.board?.querySelector(".check");
  },
  get currentKing() {
    return utils.isWhiteToMove() ? this.whiteKing : this.blackKing;
  },

  get ul() {
    return this.board?.querySelector(".promotionList");
  },
  get movedPiece() {
    return this.board?.querySelector(".movedPiece");
  },
  get highlightPiece() {
    return this.board?.querySelector(".highlight");
  },
  get highlightTrail() {
    return this.board?.querySelector(".moved");
  },

  get pieceElement() {
    return this.board?.querySelector(`.${globals.currentPieceCoord}`);
  },
};

elements.board.addEventListener("mousedown", (e) => {
  if (e.button !== 0 || globals.promoting === true || elements.gameOver) return;
  const coords = utils.getBoardCoords(e);
  const translatedCoords = utils.translateCoords(coords);
  const pieceColor = utils.getPieceColor(e);
  verifyUserClicks(translatedCoords, pieceColor);
});

elements.board.addEventListener("drop", (e) => {
  if (globals.promoting === true || elements.gameOver) return;
  const coords = utils.getBoardCoords(e);
  const translatedCoords = utils.translateCoords(coords);
  const pieceColor = utils.getPieceColor(e);
  verifyUserClicks(translatedCoords, pieceColor);
});

async function verifyUserClicks(coord, pieceColor) {
  const element =
    document.querySelector(`.${coord}:not(.moved)`) ?? elements.board;
  if (globals.currentPieceCoord != null && globals.currentPieceCoord != undefined && !(chess.turn() === `${pieceColor}`)) {
    globals.nextPieceCoord = coord;
    await mainController();
    globals.currentPieceCoord = null;
    globals.nextPieceCoord = null;
  } else if (element.classList.contains("pieces")) {
    globals.currentPieceCoord = coord;
    globals.possibleMovesList = chess.moves({
      square: `${globals.currentPieceCoord}`,
    });
    possibleMovesController();
    highlightPieceController();
    possibleCastlingController();
  }
}

async function mainController() {
  const move = await getMoveObject();
  checkController();
  enPassantController();
  if (move) {
    castlingController(move);
    if (move.captured) {
      if (move.flags.includes("e")) {
        enPassantUIController();
      } else {
        ui.makeCapture();
      }
    }
    movePieceController();
    saveFen(chess.fen());
    gameOverController();
  }
}

async function getMoveObject() {
  try {
    let move;
    if (game.isPromotion()) move = await promotionController();
    else move = game.makeMove();
    return move;
  } catch (error) {
    console.log("Movimento inválido segundo as regras do xadrez", error);
  }
}

export async function promotionController() {
  const { nextPieceCoord } = globals;
  const ulCoord = utils.getUlCoord(nextPieceCoord);
  ui.createPromotionList(ulCoord);
  globals.promoting = true;
  const pieceType = await utils.getPiecePromotionType();
  globals.promoting = null;
  let make = null;
  if (!(pieceType === "wclose" || pieceType === "bclose")) {
    ui.updatePromotingPiece(pieceType);
    make = game.makePromotionMove(pieceType);
  }
  ui.deletePromotionList();
  return make;
}

function checkController() {
  ui.clearCheckDisplay();
  if (chess.inCheck() && !chess.isCheckmate()) ui.createCheckDisplay();
}

function enPassantController() {
  const enPassantFen = chess.fen().split(" ")[3];
  if (enPassantFen !== "-") utils.initEnPassantAttackSquare(enPassantFen);
}

function castlingController(move) {
  const { possibleMovesList } = globals;
  if (!game.isCastling(possibleMovesList)) return;
  const castlingSide = utils.getCastlingSide(move);
  const info = utils.getCastlingRookInfo(castlingSide);
  ui.updateRookWhenCastling(info);
}

function enPassantUIController() {
  const pieceToRemove = utils.getPieceToRemove();
  ui.removePieceWhenEnPassant(pieceToRemove);
  utils.initEnPassantAttackSquare(null);
}

function movePieceController() {
  ui.moveUIPiece();
  ui.clearPossibleMovesIndicator();
  highlightTrailController();
  movedPieceBackgroundController();
}

function highlightTrailController() {
  ui.clearHighlightTrail();
  ui.createHighlightTrail();
}

function movedPieceBackgroundController() {
  ui.clearMovedPieceBackground();
  ui.createMovedPieceBackground();
}

function possibleMovesController() {
  ui.clearPossibleMovesIndicator();
  ui.createPossibleMovesIndicator();
}

function highlightPieceController(coord) {
  ui.clearHighlightPiece();
  ui.createHighlightPiece(coord);
}

function possibleCastlingController() {
  const { possibleMovesList } = globals;
  if (game.isCastling(possibleMovesList)) {
    const queenSide = utils.getPossibleCastlingSide(possibleMovesList);
    let coord;
    if (queenSide === 2) {
      for (let i = 0; i < 2; i++) {
        coord = utils.getPossibleCastlingCoord(i);
        ui.createPossibleCastlingIndicator(coord);
      }
    } else {
      coord = utils.getPossibleCastlingCoord(queenSide);
      ui.createPossibleCastlingIndicator(coord);
    }
  }
}

function gameOverController() { //testar lógica do game over ---------------------------------------------------
  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      ui.createCheckmateDisplay();
      createGameOverParagraph('checkmate');
    } else if (chess.isDraw()) {
      const reason = game.getDrawReason();
      createGameOverParagraph(reason);
    }
  }
}

elements.board.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
});

addEventListener("mousedown", (e) => {
  if (
    e.target.classList[0] !== "pieces" ||
    e.target.classList[1] !== chess.turn()
  ) {
    ui.clearHighlightPiece();
    ui.clearPossibleMovesIndicator();
  }
});

localStorageController();
