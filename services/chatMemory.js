let chatHistory = [];

export const addMessage = (role, message) => {
  chatHistory.push({
    role,
    message
  });
};

export const getHistory = () => {
  return chatHistory;
};

export const clearHistory = () => {
  chatHistory = [];
};