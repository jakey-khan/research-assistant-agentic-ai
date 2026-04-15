document.addEventListener("DOMContentLoaded", () => {
    // Load saved notes
    chrome.storage.local.get(['researchNotes'], (result) => {
        if (result.researchNotes) {
            const notesElement = document.getElementById('notes');
            if (notesElement) notesElement.value = result.researchNotes;
        }
    });

    document.getElementById('summarizeBtn').addEventListener('click', summarizeText);
    document.getElementById('saveNoteBtn').addEventListener('click', saveNotes);
});

async function summarizeText() {
    debugger;
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const scriptResult = await chrome.scripting.executeScript({
        target: { 
            tabId: tab.id,
            allFrames: false // Ensure this is false so you only target the main page
        },
        func: () => window.getSelection().toString()
    });

        const result = scriptResult[0].result;
        if (!result || result.trim() === "") {
            showResult('Please select some text first.');
            return;
        }

        const response = await fetch('http://localhost:8080/api/research/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: result, operation: 'summarize' })
        });

        // 1. Get the response as text first to avoid the JSON parse error
        const responseText = await response.text();

        if (!response.ok) {
            // This will now show the actual error message from Spring
            throw new Error(`Server Error (${response.status}): ${responseText}`);
        }

        // 2. Attempt to parse as JSON, but fallback to raw text if it's not JSON
        try {
            const data = JSON.parse(responseText);
            const summary = data.summary || data.content || responseText;
            showResult(summary.replace(/\n/g, '<br>'));
        } catch (e) {
            // If it's not JSON, just show the raw text
            showResult(responseText.replace(/\n/g, '<br>'));
        }

    } catch (error) {
        showResult('Error: ' + error.message);
    }
}

async function saveNotes() { 
    debugger;
    const notes = document.getElementById('notes').value;
    chrome.storage.local.set({ 'researchNotes': notes }, () => {
        // Using a non-blocking UI update is usually better than alert()
        console.log('Notes saved.');
        const saveBtn = document.getElementById('saveNoteBtn');
        const originalText = saveBtn.innerText;
        saveBtn.innerText = 'Saved!';
        setTimeout(() => saveBtn.innerText = originalText, 2000);
    });
}

function showResult(content) {
    debugger;
    const resultContainer = document.getElementById('result');
    if (resultContainer) {
        resultContainer.innerHTML = `
            <div class="result-item">
                <div class="result-content">${content}</div>
            </div>`;
    }
}