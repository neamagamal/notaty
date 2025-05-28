// const baseUrl = 'http://localhost:3000';
const baseUrl ='https://note-4-guid.onrender.com';

async function addNote(noteData) {
  const response = await fetch(`${baseUrl}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(noteData)
  });
  if (!response.ok) {
      const errorData = await response.text(); 
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
  }
  return response.json();
}

async function updateNote(noteId, noteData) {

  const payload = {
      ...noteData, 
      _id: noteId   
  };
  
  const response = await fetch(`${baseUrl}/notes`, { 
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload) 
  });
  if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
  }

  try {
      return await response.json(); 
  } catch (e) {
      return { ok: response.ok, status: response.status };
  }
}



async function deleteNote(noteId) {
  const response = await fetch(`${baseUrl}/notes/${noteId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
  }
  return { ok: response.ok, status: response.status }; 
}

async function getNoteById(noteId){
    const response = await fetch (`${baseUrl}/notes/${noteId}`);
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }
    return response.json();
}

async function getNotes(noteTitle){
    let url = `${baseUrl}/notes`;
    if(noteTitle){
        url += `?title=${encodeURIComponent(noteTitle)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }
    return response.json();
}

