// A global variable to hold the QR code instance
let qrcodeInstance = null;
const HISTORY_KEY = 'qrCodeHistory'; // Key for localStorage

// Helper function to handle the actual download logic
function downloadQRCode(dataURL, urlInput) {

    const cleanedInput = urlInput.replace(/[^a-zA-Z0-9]/g, ''); 
    const prefix = cleanedInput.substring(0, 8) || 'QR'; 
    const randomNum = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000; 
    const filename = `${prefix}-qrname-${randomNum}advancedQRcode.png`;
    
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename; 
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


// Helper function to save a new QR code entry to history
function saveToHistory(dataURL, text, color, size) {
    try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        
        const newEntry = {
            id: Date.now(), 
            timestamp: new Date().toLocaleString(),
            text: text,
            color: color,
            size: size,
            dataURL: dataURL 
        };

        history.unshift(newEntry);
        if (history.length > 20) { // Limit history size
            history.pop(); 
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save to history (localStorage error):", e);
    }
}


function handleGenerateQRCode() {
    const urlInput = document.getElementById('url-input');
    const qrContainer = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('download-btn');
    
    const url = urlInput.value.trim();
    const darkColor = document.getElementById('color-dark').value;
    const size = parseInt(document.getElementById('qr-size').value);

    if (!url) {
        alert('Please provide URL or Text input!');
        return;
    }

    qrContainer.innerHTML = '';
    
    try {
        qrcodeInstance = new QRCode(qrContainer, {
            text: url,
            width: size,
            height: size,
            colorDark: darkColor, 
            colorLight: "#ffffff", 
            correctLevel : QRCode.CorrectLevel.H 
        });
        
        // Timeout to ensure the canvas is fully rendered before trying to save
        setTimeout(() => {
            const qrCanvas = qrContainer.querySelector('canvas');
            
            if (qrCanvas) {
                try {
                    const dataURL = qrCanvas.toDataURL("image/png");
                    saveToHistory(dataURL, url, darkColor, size);
                    downloadBtn.disabled = false;
                } catch (e) {
                    console.error("toDataURL Error (Security restriction likely):", e);
                    downloadBtn.disabled = false; 
                }
            } else {
                 downloadBtn.disabled = true;
                 console.warn("QR code not generated as a canvas element.");
            }
        }, 100); 

    } catch (error) {
        console.error("Problem generating QR code:", error);
        alert("An error occurred in QR code generation.");
    }
}

// Download Button Listener for the main page
document.addEventListener('DOMContentLoaded', () => {
    const mainDownloadBtn = document.getElementById('download-btn');
    
    if (mainDownloadBtn) { 
        mainDownloadBtn.addEventListener('click', function() {
            const qrContainer = document.getElementById('qrcode');
            const qrCanvas = qrContainer.querySelector('canvas'); 
            const urlInput = document.getElementById('url-input').value.trim(); 
            
            if (qrCanvas) {
                try {
                    const dataURL = qrCanvas.toDataURL("image/png"); 
                    downloadQRCode(dataURL, urlInput);
                } catch (e) {
                    alert('Download failed! Security restriction likely prevents reading the QR code data. Try running on a web server.');
                    console.error("Download Button Error:", e);
                }
            } else {
                alert('No QR code found for download!');
            }
        });
    }
});

// New function to handle copying content to clipboard
function copyContent(text) {
    // navigator.clipboard API ব্যবহার করা
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied !!"); // ⬅️ পরিবর্তিত মেসেজ
        }).catch(err => {
            console.error('Could not copy text: ', err);
            fallbackCopy(text);
        });
    } else {
        // Fallback for older browsers or non-secure contexts (http)
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Off-screen styling
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert("Copied !! (Fallback)"); // ⬅️ পরিবর্তিত মেসেজ (ফলব্যাক সহ)
        } else {
            alert("Copy failed. Please manually select and copy the content.");
        }
    } catch (err) {
        console.error('Fallback copy failed: ', err);
    }
    document.body.removeChild(textArea);
}


// Function to load and display history on history.html (Handles Filtering)
function renderHistory() { 
    const historyListContainer = document.getElementById('history-list');
    const clearBtn = document.getElementById('clear-history-btn');
    const searchInput = document.getElementById('search-history');
    
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch(e) {
        console.error("Failed to load history from localStorage:", e);
        historyListContainer.innerHTML = '<p>Could not load history due to browser security settings.</p>';
        if (clearBtn) clearBtn.disabled = true;
        return;
    }
    
    // Filtering Logic
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    let filteredHistory = history;

    if (searchTerm) {
        filteredHistory = history.filter(entry => 
            entry.text.toLowerCase().includes(searchTerm)
        );
    }
    
    // UI Update and Rendering
    historyListContainer.innerHTML = ''; 
    
    if (filteredHistory.length === 0) {
        historyListContainer.innerHTML = `<p>${searchTerm ? 'No matching QR codes found.' : 'No QR codes have been generated yet.'}</p>`;
        if (clearBtn) clearBtn.disabled = (history.length === 0); 
        return;
    }
    
    if (clearBtn) {
        clearBtn.disabled = false;
        clearBtn.onclick = clearHistory; 
    }

    const historyWrapper = document.createElement('div');
    historyWrapper.className = 'history-wrapper';
    
    filteredHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        // Image
        const qrImage = document.createElement('img');
        qrImage.src = entry.dataURL;
        qrImage.alt = 'QR Code';
        item.appendChild(qrImage);

        // Info
        const info = document.createElement('div');
        info.className = 'history-info';
        
        const displayText = entry.text.length > 50 ? entry.text.substring(0, 50) + '...' : entry.text;
        
        // Content line: Added structure for Content and Copy button
        const contentContainer = document.createElement('p');
        contentContainer.className = 'history-content';
        contentContainer.style.display = 'flex'; // Flexbox for alignment
        contentContainer.style.alignItems = 'center';
        
        const contentText = document.createElement('span');
        contentText.style.marginRight = '10px';
        contentText.style.whiteSpace = 'nowrap';
        contentText.style.overflow = 'hidden';
        contentText.style.textOverflow = 'ellipsis';
        contentText.style.flexGrow = '1';
        contentText.innerHTML = `<strong>Content:</strong> ${displayText}`;

        // ⬅️ Copy Button (Icon)
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="far fa-copy"></i>';
        copyBtn.title = 'Copy Content';
        copyBtn.style.padding = '5px 8px';
        copyBtn.style.marginLeft = '5px';
        copyBtn.style.height = '30px';
        copyBtn.style.width = '30px';
        copyBtn.style.borderRadius = '4px';
        copyBtn.style.backgroundColor = '#6c757d'; // Grey color for copy
        copyBtn.style.color = 'white';
        copyBtn.style.border = 'none';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.transition = 'background-color 0.3s';
        copyBtn.onmouseover = () => copyBtn.style.backgroundColor = '#5a6268';
        copyBtn.onmouseout = () => copyBtn.style.backgroundColor = '#6c757d';
        
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent item click event if any
            copyContent(entry.text);
        });

        contentContainer.appendChild(contentText);
        contentContainer.appendChild(copyBtn);
        
        info.appendChild(contentContainer);

        info.innerHTML += `
            <p class="history-details"><strong>Color:</strong> ${entry.color} | <strong>Size:</strong> ${entry.size}px</p>
            <p class="history-details"><strong>Generated:</strong> ${entry.timestamp}</p>
        `;
        
        item.appendChild(info);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'history-actions';

        // Download Button
        const downloadAction = document.createElement('button');
        downloadAction.innerHTML = '<i class="fas fa-download"></i> Download';
        downloadAction.title = 'Download PNG';
        downloadAction.className = 'action-btn download-action';
        downloadAction.addEventListener('click', () => {
            downloadQRCode(entry.dataURL, entry.text);
        });
        actions.appendChild(downloadAction);

        // View Content Button
        const viewAction = document.createElement('button');
        viewAction.innerHTML = '<i class="fas fa-eye"></i> View';
        viewAction.title = 'View Full Content';
        viewAction.className = 'action-btn view-action';
        viewAction.addEventListener('click', () => {
            alert(`Full QR Content:\n${entry.text}`);
        });
        actions.appendChild(viewAction);
        
        item.appendChild(actions);

        historyWrapper.appendChild(item);
    });

    historyListContainer.appendChild(historyWrapper);
}


// Function to clear all history
function clearHistory() {
    if (confirm("Are you sure you want to clear all QR Code history? This cannot be undone.")) {
        try {
            localStorage.removeItem(HISTORY_KEY);
            renderHistory(); // Reload the history list
        } catch (e) {
             console.error("Failed to clear history:", e);
        }
    }
}

// Ensure history page loads on history.html
if (window.location.pathname.endsWith('history.html')) {
    window.onload = renderHistory;
}