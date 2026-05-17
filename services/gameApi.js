export const startGame = async () => {
  try {
    const response = await fetch('/api/game/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Failed to parse backend response');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to start game session');
    }
    
    return data;
  } catch (error) {
    console.error('Error in startGame API:', error.message);
    throw error;
  }
};

export const submitAnswer = async (gameId, questionId, answer) => {
  try {
    const response = await fetch('/api/game/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId, questionId, answer }),
    });
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Failed to parse backend response');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit answer');
    }
    
    return data;
  } catch (error) {
    console.error('Error in submitAnswer API:', error.message);
    throw error;
  }
};

export const getResult = async (gameId) => {
  try {
    const response = await fetch(`/api/game/result?gameId=${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Failed to parse backend response');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch game result');
    }
    
    return data;
  } catch (error) {
    console.error('Error in getResult API:', error.message);
    throw error;
  }
};
