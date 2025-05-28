document.addEventListener("DOMContentLoaded", () => {
    const notesContainer = document.getElementById("notes-container");
    const searchInput = document.getElementById("search-input");
    const addNoteTitleInput = document.getElementById("add-note-title");
    const addNoteContentInput = document.getElementById("add-note-content");
    const addNoteSaveBtn = document.getElementById("add-note-save-btn");
    const editNoteIdInput = document.getElementById("edit-note-id");
    const editNoteTitleInput = document.getElementById("edit-note-title");
    const editNoteContentInput = document.getElementById("edit-note-content");
    const editNoteSaveBtn = document.getElementById("edit-note-save-btn");
    const addModalElement = document.getElementById("addModal");
    const editModalElement = document.getElementById("editModal");
    const addModal = new bootstrap.Modal(addModalElement);
    const editModal = new bootstrap.Modal(editModalElement);

    // Function to display notes
    const displayNotes = async (searchTerm = "") => {
        try {
            console.log(`Fetching notes with search term: "${searchTerm}"`);
            const notes = await getNotes(searchTerm);
            notesContainer.innerHTML = ""; 
            if (notes.length === 0) {
                notesContainer.innerHTML = 
                    '<p class="text-center text-muted">No notes found.</p>';
                return;
            }
            notes.forEach((note) => {
                const noteElement = document.createElement("div");
                noteElement.className = "col-md-4";
                
                const noteId = note.id || note._id; 
                if (!noteId) {
                    console.error("Note object missing ID:", note);
                    return; 
                }
                noteElement.innerHTML = `
                    <div class="card note-card animate-pop" data-id="${noteId}">
                        <div class="card-body">
                            <h5 class="card-title">${escapeHTML(
                                note.title || ""
                            )}</h5>
                            <p class="card-text">${escapeHTML(
                                note.content || ""
                            )}</p>
                            <div class="d-flex justify-content-end">
                                <button class="btn btn-sm btn-outline-success me-2 edit-btn" data-bs-toggle="modal" data-bs-target="#editModal">✎</button>
                                <button class="btn btn-sm btn-outline-danger delete-btn">🗑</button>
                            </div>
                        </div>
                    </div>
                `;
                notesContainer.appendChild(noteElement);
            });
        } catch (error) {
            console.error("Error fetching notes:", error);
            
            notesContainer.innerHTML = `<p class="text-center text-danger">Failed to load notes: ${error.message}. Please check the console and ensure the backend server is running correctly.</p>`;
        }
    };

   
    const escapeHTML = (str) => {
        if (typeof str !== "string") return "";
        const div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };


    addNoteSaveBtn.addEventListener("click", async () => {
        const title = addNoteTitleInput.value; 
        const content = addNoteContentInput.value;
        try {
            await addNote({ title, content });
            addNoteTitleInput.value = ""; 
            addNoteContentInput.value = "";
            addModal.hide(); 
            await displayNotes(); 
        } catch {
            
            alert(`Failed to add note`);
        }
    });

   
    notesContainer.addEventListener("click", async (event) => {
        const target = event.target;
        const noteCard = target.closest(".note-card");
        if (!noteCard) return;

        const noteId = noteCard.dataset.id;
        if (!noteId) {
            console.error("Could not find note ID for card:", noteCard);
            return;
        }

        //  Edit Button Click
        if (target.classList.contains("edit-btn")) {
            try {
                console.log(`Fetching note ${noteId} for edit`);
                const note = await getNoteById(noteId);
                editNoteIdInput.value = note.id || note._id; 
                editNoteTitleInput.value = note.title || "";
                editNoteContentInput.value = note.content || "";
            } catch (error) {
                console.error(`Error fetching note ${noteId} for edit:`, error);
                alert(`Failed to load note details for editing: ${error.message}`);
            }
        }
        if (target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this note?")) {
                try {
                    console.log(`Attempting to delete note ${noteId}`);
                    const result = await deleteNote(noteId);
                    if (result.ok) {
                        console.log(`Note ${noteId} deleted successfully`);
                        await displayNotes(); 
                    } else {
                        console.error(`Failed to delete note ${noteId}. Status: ${result.status}`);
                        alert(`Failed to delete note. Status: ${result.status}`);
                    }
                } catch (error) {
                    console.error(`Error deleting note ${noteId}:`, error);
                    alert(`Failed to delete note: ${error.message}`);
                }
            }
        }
    });


editNoteSaveBtn.addEventListener("click", async () => {
    const id = editNoteIdInput.value;
    const title = editNoteTitleInput.value;
    const content = editNoteContentInput.value;

    if (!id) {
        alert("Error: Note ID is missing. Cannot update.");
        return;
    }

    try {
        console.log(`Attempting to update note ${id}`);
   
        await updateNote(id, { title, content }); 
        editModal.hide(); 
        await displayNotes(); 
        console.log(`Note ${id} updated successfully`);
    } catch (error) {
        console.error(`Error updating note ${id}:`, error);
     
        alert(`Failed to update note: ${error.message}`); 
    }
});



    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    const debouncedSearch = debounce((searchTerm) => {
        displayNotes(searchTerm);
    }, 300); 

    searchInput.addEventListener("input", () => {
        debouncedSearch(searchInput.value.trim());
    });
    displayNotes();
});





