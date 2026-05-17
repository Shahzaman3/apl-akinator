import React, { createContext, useContext, useState, useEffect } from 'react';
import { startGame, submitAnswer } from '../services/gameApi';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameId, setGameId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [remainingPlayers, setRemainingPlayers] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [topPredictions, setTopPredictions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const [loadingState, setLoadingState] = useState(false);
  const [transitionState, setTransitionState] = useState(false);
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore session on mount
  useEffect(() => {
    restoreGameSession();
    setIsInitialized(true);
  }, []);

  // Save session when relevant state changes
  useEffect(() => {
    if (isInitialized && gameId) {
      const sessionData = {
        gameId,
        currentQuestion,
        questionNumber,
        remainingPlayers,
        confidence,
        topPredictions,
        logs,
        isComplete,
      };
      localStorage.setItem('akinator_session', JSON.stringify(sessionData));
    }
  }, [gameId, currentQuestion, questionNumber, remainingPlayers, confidence, topPredictions, logs, isComplete, isInitialized]);

  const restoreGameSession = () => {
    try {
      const stored = localStorage.getItem('akinator_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        setGameId(parsed.gameId);
        setCurrentQuestion(parsed.currentQuestion);
        setQuestionNumber(parsed.questionNumber || 0);
        setRemainingPlayers(parsed.remainingPlayers || 0);
        setConfidence(parsed.confidence || 0);
        setTopPredictions(parsed.topPredictions || []);
        setLogs(parsed.logs || []);
        setIsComplete(parsed.isComplete || false);
      }
    } catch (e) {
      console.error("Failed to restore session", e);
    }
  };

  const clearGameSession = () => {
    localStorage.removeItem('akinator_session');
    setGameId(null);
    setCurrentQuestion(null);
    setQuestionNumber(0);
    setRemainingPlayers(0);
    setConfidence(0);
    setTopPredictions([]);
    setLogs([]);
    setIsComplete(false);
  };

  const handleStartGame = async () => {
    setLoadingState(true);
    clearGameSession();
    try {
      const data = await startGame();
      setGameId(data.gameId);
      setCurrentQuestion(data.question);
      setRemainingPlayers(data.remainingPlayers);
      setQuestionNumber(1);
      setConfidence(12); // Initial visual floor
      setLogs([{ text: "> System engaged...", type: 'system' }]);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoadingState(false);
    }
  };

  const handleAnswer = async (answer) => {
    if (!gameId || !currentQuestion) return;
    
    setLoadingState(true);
    try {
      const data = await submitAnswer(gameId, currentQuestion.id, answer);
      
      // Update state
      if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
        setQuestionNumber((prev) => prev + 1);
      }
      
      setRemainingPlayers(data.remainingPlayers);
      setConfidence(data.confidence);
      setTopPredictions(data.topPredictions || []);
      
      // Add logs
      if (data.logs && data.logs.length > 0) {
        const newLogEntry = data.logs[0];
        const logLines = [];
        if (newLogEntry.filter && newLogEntry.filter.length > 0) {
          logLines.push({ text: `> ${newLogEntry.filter[0]}`, type: 'filter' });
        }
        if (newLogEntry.reduction && newLogEntry.reduction.length > 0) {
          logLines.push({ text: `> ${newLogEntry.reduction[0]}`, type: 'reduction' });
        }
        setLogs((prev) => [...prev, ...logLines]);
      }
      
      if (data.isComplete) {
        setIsComplete(true);
      }
      
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameId,
        currentQuestion,
        questionNumber,
        remainingPlayers,
        confidence,
        topPredictions,
        logs,
        isComplete,
        loadingState,
        transitionState,
        setTransitionState,
        startGame: handleStartGame,
        submitAnswer: handleAnswer,
        clearGameSession,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
