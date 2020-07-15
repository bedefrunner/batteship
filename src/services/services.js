const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvYnJ1bm5lckB1Yy5jbCIsInN0dWRlbnROdW1iZXIiOiIxNTYzMzU0MyIsImlhdCI6MTU5NDgyNzY5Mn0.eIOe8mcN0t93Ff5JSnm__j5QyOKjAPsLrKulX89kcso'

export async function startNewGame() {
  const response = await fetch(`https://battleship.iic2513.phobos.cl/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`, 
    },
  })
  return response.json();
};

export async function newAction(gameId, body) {
  console.log('gameId, body: ', gameId, body)
  const response = await fetch(`https://battleship.iic2513.phobos.cl/games/${gameId}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`, 
    },
    body: JSON.stringify(body),
  });
  console.log('holaaaaaaa', response);
  return response.json();
};