export const formatGroupDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const isCurrentYear = date.getFullYear() === today.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  
  if (isCurrentYear) {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatMessageTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatMessageDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
    
  if (isToday) {
    return formatMessageTime(dateString);
  }
  return formatGroupDate(dateString);
};

export const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentGroup = null;

  messages.forEach((msg) => {
    const ts = msg.timestamp || new Date().toISOString();
    const dateLabel = formatGroupDate(ts);

    if (!currentGroup || currentGroup.dateLabel !== dateLabel) {
      currentGroup = {
        dateLabel,
        messages: []
      };
      groups.push(currentGroup);
    }
    
    currentGroup.messages.push({
      ...msg,
      timestamp: ts
    });
  });

  return groups;
};