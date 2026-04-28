console.log("Email Writer Extension - content script loaded successfully!");

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function getEmailContent() {
    const selectors = ['.h7', '.a3s.aiL', '.gmail_quote', '[role="presentation"]'];
    for (const selector of selectors) { 
        const content = document.querySelector(selector);
        if (content) {
            console.log(`Content found using selector: ${selector}`);
            return content.innerText.trim();
        }
        return '';
    }
}

function findComposeToolbar() {
 const selectors = ['.aDh', '.btC', '[role="toolbar"]','.gU.Up'];
    for (const selector of selectors) { 
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            console.log(`Toolbar found using selector: ${selector}`);
            return toolbar;
        }
        return null;
    }
 //   const composeWindows = document.querySelectorAll('.aDh, .btC, [role="dialog"]');
}

function injectButton() {
    // const existingButton = document.querySelectorAll('.ai-reply-button');
    // if (existingButton) {
    //     existingButton.remove();
    // }
    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Compose toolbar not found.");
        return;
    }
    console.log("Compose toolbar found. Injecting button...");
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({ 
                    emailContent : emailContent,
                    tone : "professional"
                })
            });
            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }
            const result = await response.text();
            const composeBox = document.querySelector('[role="textbox"], [g_edittable="true"], [contenteditable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, result);
            } else {
                console.error("Compose box not found.");
            }
        } catch (error) {
            console.error("Error generating AI reply:", error);
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);

}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations){
        const addedNotes = Array.from(mutation.addedNodes);
        const hasComposedElements = addedNotes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        if(hasComposedElements){
            console.log("Compose window detected. Injecting email writer...");
            setTimeout(injectButton, 500); // Delay to ensure the compose window is fully loaded
           // injectEmailWriter();
        }
    }
});

observer.observe(document.body, { 
    childList: true, 
    subtree: true 
});