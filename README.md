# Advanced QR Code Generator

A clean, responsive, and feature-rich web application to generate and manage QR codes. This tool allows for real-time customization and keeps a local history of your generated codes without needing a database.

## ✨ Features

* **Instant Generation:** Create QR codes for URLs, plain text, or contact info.
* **Custom Styling:** * Change the **foreground color** of the QR code to match your branding.
    * Adjust the **size** (resolution) dynamically for different use cases.
* **Local History:** * Automatically saves your last 20 generations to your browser's local storage.
    * Search through your history by content or URL using the built-in search bar.
    * Clear history at any time with a single click.
* **Downloadable:** Export your QR codes as high-quality PNG files with unique, timestamped names.
* **Privacy Focused:** All data is stored locally in your browser; no data is sent to a server.

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3 (using modern Flexbox and Custom CSS Variables).
* **JavaScript:** Vanilla JS (ES6+).
* **Library:** [QRCode.js](https://davidshimjs.github.io/qrcodejs/) for high-performance rendering.
* **Icons:** FontAwesome 6 for a modern interface.

## 🚀 Getting Started

Since this is a client-side web application, you don't need to install any servers or complex dependencies.

1.  **Download or Clone** this repository to your computer.
2.  Navigate to the project folder.
3.  Open `index.html` in any modern web browser (Chrome, Firefox, Safari, or Edge).

## 📖 How to Use

1.  **Input:** Type your URL or text into the "Write your URL or Text" box.
2.  **Style:** Pick a custom color and set your preferred size (default is 250px).
3.  **Generate:** Click the **Generate** button to create the code.
4.  **Save:** Use the **Download (PNG)** button to save the image to your device.
5.  **History:** Click the **QR History** link in the top right to view, search, or re-download your previous codes.

```text
├── index.html           # Main application interface
├── history.html         # History management page
├── assets/
│   ├── css/
│   │   └── style.css    # Modern UI styling
│   ├── js/
│   │   └── script.js    # Core logic (History, Download, Search)
│   ├── cdnjs/
│   │   └── qrcode.min.js # Local QR generation dependency
│   └── img/
│       └── icon.png     # Application branding
├── LICENSE
└── README.md
