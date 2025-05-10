let saveTimeout = null;

// Setup function to initialize auto-save logic
export function initAutoSave(docId) {
  // Save document to backend
  const saveDocument = async (content) => {
    try {
        console.log(typeof content)
        console.log("api call to server", content)
      await fetch(`http://localhost:3000/updatedocuments/${docId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      console.log('Auto-saved at', new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  };

  // Debounced function (call this on keystroke)
  const debouncedSave = (content) => {
    console.log("debouncedSave", content)
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(()=>saveDocument(content), 3000);
  };

  // Save on tab close
  const handleBeforeUnload = () => {
    navigator.sendBeacon(
      `http://localhost:3000/documents/${docId}`,
      JSON.stringify({ content })
    );
  };

  // Attach unload listener once
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Return the function to call on editor changes
  return {
    triggerSave: (content)=>debouncedSave(content),
    cleanup: () => {
      clearTimeout(saveTimeout);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    },
  };
}
