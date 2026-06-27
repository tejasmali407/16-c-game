import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { generateCards } from '@/utils/generateCards';
import { shuffleCards } from '@/utils/shuffleCards';
import { distributeCards } from '@/utils/distributeCards';
import { checkWinner } from '@/utils/checkWinner';
import { saveLeaderboard } from '@/utils/localStorage';

const initialState = {
  gameStatus: 'setup',
  players: [],
  deck: [],
  currentPlayerIndex: 0,
  winner: null,
  selectedCardId: null,
  pendingCard: null,
  reactions: [],
  reactionStartTime: null,
  lastPlayerId: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SETUP_GAME': {
      const isObjectPayload = action.payload && !Array.isArray(action.payload);
      return {
        ...state,
        gameStatus: 'setup',
        gameMode: isObjectPayload ? action.payload.gameMode : 'friends',
        robotDifficulty: isObjectPayload ? action.payload.robotDifficulty : 'medium',
        players: isObjectPayload ? action.payload.players : action.payload,
        deck: [],
        currentPlayerIndex: 0,
        winner: null,
        selectedCardId: null,
        pendingCard: null,
        reactions: [],
        reactionStartTime: null,
        lastPlayerId: null,
      };
    }
    case 'START_GAME_DATA':
      return {
        ...state,
        players: action.payload.players,
        deck: action.payload.deck,
        currentPlayerIndex: 0,
        selectedCardId: null,
        pendingCard: null,
        winner: null,
        reactions: [],
        reactionStartTime: null,
        lastPlayerId: null,
      };
    case 'SELECT_CARD':
      return {
        ...state,
        selectedCardId: action.payload,
      };
    case 'PASS_CARD':
      return {
        ...state,
        players: action.payload.players,
        currentPlayerIndex: action.payload.nextPlayerIndex,
        pendingCard: action.payload.pendingCard,
        selectedCardId: null,
        winner: action.payload.winner,
        gameStatus: action.payload.winner ? 'winnerReady' : 'playing',
      };
    case 'START_REACTION_PHASE':
      return {
        ...state,
        gameStatus: 'reaction',
        reactionStartTime: action.payload.reactionStartTime,
        reactions: action.payload.reactions,
      };
    case 'RECORD_REACTION':
      return {
        ...state,
        reactions: action.payload,
      };
    case 'FINISH_ROUND':
      return {
        ...state,
        players: action.payload.players,
        reactions: action.payload.reactions,
        lastPlayerId: action.payload.lastPlayerId,
        gameStatus: 'gameOver',
      };
    case 'RESET_ROUND_DATA':
      return {
        ...state,
        players: action.payload.players,
        deck: action.payload.deck,
        currentPlayerIndex: 0,
        selectedCardId: null,
        pendingCard: null,
        winner: null,
        reactions: [],
        reactionStartTime: null,
        lastPlayerId: null,
      };
    case 'SET_STATUS':
      return {
        ...state,
        gameStatus: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/context/ToastContext';
import { playSound } from '@/utils/sounds';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedPlayerName, getLocalizedCardName } from '@/utils/localizedDisplay';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { settings } = useSettings();
  const toast = useToast();
  const { t, language } = useTranslation();

  const soundEnabled = settings?.soundEnabled;

  const setupGame = useCallback((players) => {
    dispatch({ type: 'SETUP_GAME', payload: players });
  }, []);

  const startGame = useCallback(() => {
    playSound('shuffle', soundEnabled);
    const deck = generateCards(state.players);
    const shuffledDeck = shuffleCards(deck);
    const updatedPlayers = distributeCards(state.players, shuffledDeck);

    dispatch({ type: 'SET_STATUS', payload: 'shuffling' });
    dispatch({ 
      type: 'START_GAME_DATA', 
      payload: { players: updatedPlayers, deck: shuffledDeck } 
    });

    setTimeout(() => {
      let startingWinner = null;
      for (const player of updatedPlayers) {
        if (player.cards.length === 4 && checkWinner(player)) {
          startingWinner = player;
          break;
        }
      }

      if (startingWinner) {
        playSound('winner', soundEnabled);
        toast.success(t("toastWinnerDetected", { name: getLocalizedPlayerName(startingWinner, language) }));
        const winnerIndex = updatedPlayers.findIndex((p) => p.id === startingWinner.id);
        dispatch({
          type: 'PASS_CARD',
          payload: {
            players: updatedPlayers,
            nextPlayerIndex: winnerIndex > -1 ? winnerIndex : 0,
            pendingCard: null,
            winner: startingWinner,
          }
        });
      } else {
        dispatch({ type: 'SET_STATUS', payload: 'playing' });
      }
    }, 1500);
  }, [state.players, soundEnabled, toast, t, language]);

  const selectCard = useCallback((cardId) => {
    if (state.gameStatus !== 'playing') return;

    const activePlayer = state.players[state.currentPlayerIndex];
    if (!activePlayer) return;

    const card = activePlayer.cards.find((c) => c.id === cardId);
    if (!card) return;

    dispatch({ type: 'SELECT_CARD', payload: cardId });
    toast.info(t("toastCardSelected", { name: getLocalizedCardName(card, language) }));
  }, [state.gameStatus, state.players, state.currentPlayerIndex, toast, t, language]);

  const passCard = useCallback((cardId) => {
    if (state.gameStatus !== 'playing') return;
    if (!cardId) return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) return;

    const cardToPass = currentPlayer.cards.find((c) => c.id === cardId);
    if (!cardToPass) return;

    const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    const nextPlayer = state.players[nextPlayerIndex];

    const updatedPlayers = state.players.map((player, idx) => {
      if (idx === state.currentPlayerIndex) {
        return {
          ...player,
          cards: player.cards.filter((c) => c.id !== cardId),
        };
      }
      if (idx === nextPlayerIndex) {
        return {
          ...player,
          cards: [...player.cards, cardToPass],
        };
      }
      return player;
    });

    playSound('pass', soundEnabled);
    toast.success(t("toastPassedCard", { name: nextPlayer ? getLocalizedPlayerName(nextPlayer, language) : 'next player' }));

    let foundWinner = null;
    for (const player of updatedPlayers) {
      if (player.cards.length === 4 && checkWinner(player)) {
        foundWinner = player;
        break;
      }
    }

    if (foundWinner) {
      playSound('winner', soundEnabled);
      toast.success(t("toastWinnerDetected", { name: getLocalizedPlayerName(foundWinner, language) }));
    }

    const winnerIndex = foundWinner
      ? updatedPlayers.findIndex((p) => p.id === foundWinner.id)
      : -1;

    dispatch({
      type: 'PASS_CARD',
      payload: {
        players: updatedPlayers,
        nextPlayerIndex: winnerIndex > -1 ? winnerIndex : nextPlayerIndex,
        pendingCard: cardToPass,
        winner: foundWinner,
      },
    });
  }, [state.players, state.currentPlayerIndex, state.gameStatus, soundEnabled, toast, t, language]);

  const startReactionPhase = useCallback(() => {
    if (state.gameStatus !== 'winnerReady' || !state.winner) return;

    playSound('stack', soundEnabled);
    const startTime = Date.now();
    const winnerReaction = {
      playerId: state.winner.id,
      playerName: state.winner.name,
      time: 0,
      order: 1,
    };

    dispatch({
      type: 'START_REACTION_PHASE',
      payload: {
        reactionStartTime: startTime,
        reactions: [winnerReaction],
      },
    });
  }, [state.gameStatus, state.winner, soundEnabled]);

  const recordReaction = useCallback((playerId) => {
    if (state.gameStatus !== 'reaction') return;
    if (playerId === state.winner?.id) return;

    const alreadyReacted = state.reactions.some((r) => r.playerId === playerId);
    if (alreadyReacted) return;

    const player = state.players.find((p) => p.id === playerId);
    if (!player) return;

    playSound('stack', soundEnabled);

    const time = Date.now() - state.reactionStartTime;
    const order = state.reactions.length + 1;

    const newReaction = {
      playerId,
      playerName: player.name,
      time,
      order,
    };

    const updatedReactions = [...state.reactions, newReaction];
    dispatch({ type: 'RECORD_REACTION', payload: updatedReactions });

    if (updatedReactions.length === state.players.length) {
      const nonWinnerReactions = updatedReactions.filter(
        (r) => r.playerId !== state.winner.id
      );
      const lastReaction = nonWinnerReactions[nonWinnerReactions.length - 1];
      const lastPlayerId = lastReaction.playerId;
      const lastPlayer = state.players.find((p) => p.id === lastPlayerId);

      const updatedPlayers = state.players.map((p) => {
        const reactionObj = updatedReactions.find((r) => r.playerId === p.id);
        const reactionTime = reactionObj ? reactionObj.time : null;

        let score = p.score || 0;
        let penalties = p.penalties || 0;

        if (p.id === state.winner.id) {
          score += 1;
        }
        if (p.id === lastPlayerId) {
          penalties += 1;
        }

        return {
          ...p,
          score,
          penalties,
          reactionTime,
        };
      });

      saveLeaderboard(
        state.winner.name,
        lastPlayer?.name,
        lastReaction.time
      );
      toast.error(t("toastRoundOver", { name: lastPlayer ? getLocalizedPlayerName(lastPlayer, language) : 'Slowest player' }));

      dispatch({
        type: 'FINISH_ROUND',
        payload: {
          players: updatedPlayers,
          reactions: updatedReactions,
          lastPlayerId,
        },
      });
    }
  }, [state.gameStatus, state.reactions, state.players, state.winner, state.reactionStartTime, soundEnabled, toast, t, language]);

  const resetRound = useCallback(() => {
    playSound('shuffle', soundEnabled);
    toast.info(t("toastPreparingNextRound"));
    
    const clearedPlayers = state.players.map((p) => ({
      ...p,
      cards: [],
      reactionTime: null,
    }));
    const deck = generateCards(clearedPlayers);
    const shuffledDeck = shuffleCards(deck);
    const updatedPlayers = distributeCards(clearedPlayers, shuffledDeck);

    dispatch({ type: 'SET_STATUS', payload: 'shuffling' });
    dispatch({
      type: 'RESET_ROUND_DATA',
      payload: { players: updatedPlayers, deck: shuffledDeck },
    });

    setTimeout(() => {
      let startingWinner = null;
      for (const player of updatedPlayers) {
        if (player.cards.length === 4 && checkWinner(player)) {
          startingWinner = player;
          break;
        }
      }

      if (startingWinner) {
        playSound('winner', soundEnabled);
        toast.success(t("toastWinnerDetected", { name: startingWinner.name }));
        dispatch({
          type: 'PASS_CARD',
          payload: {
            players: updatedPlayers,
            nextPlayerIndex: 0,
            pendingCard: null,
            winner: startingWinner,
          },
        });
      } else {
        dispatch({ type: 'SET_STATUS', payload: 'playing' });
      }
    }, 1500);
  }, [state.players, soundEnabled, toast, t]);

  const setGameStatus = useCallback((status) => {
    dispatch({ type: 'SET_STATUS', payload: status });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
    toast.info(t("toastGameFullyReset"));
  }, [toast, t]);

  const isRobotTurn = useMemo(() => {
    return state.players[state.currentPlayerIndex]?.isRobot || false;
  }, [state.players, state.currentPlayerIndex]);

  const value = useMemo(
    () => ({
      ...state,
      isRobotTurn,
      dispatch,
      setupGame,
      startGame,
      selectCard,
      passCard,
      startReactionPhase,
      recordReaction,
      resetRound,
      setGameStatus,
      resetGame,
    }),
    [
      state,
      isRobotTurn,
      setupGame,
      startGame,
      selectCard,
      passCard,
      startReactionPhase,
      recordReaction,
      resetRound,
      setGameStatus,
      resetGame,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
