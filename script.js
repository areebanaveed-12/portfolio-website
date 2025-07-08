
// JavaScript with resume popup logic + 'Resume hacked' display
const input = document.getElementById("terminal-input");
const inputContainer = document.getElementById("input-container");
const introDisplay = document.getElementById("intro-line");
const output = document.getElementById("command-output");
const typingSound = new Audio("sounds/key2.mp3"); // ✅ path to your sound file
typingSound.volume = 0.1;