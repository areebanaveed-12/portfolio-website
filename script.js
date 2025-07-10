
// JavaScript with resume popup logic + 'Resume hacked' display
const input = document.getElementById("terminal-input");
const inputContainer = document.getElementById("input-container");
const introDisplay = document.getElementById("intro-line");
const output = document.getElementById("command-output");
const typingSound = new Audio("sounds/key2.mp3"); // path to your sound file
typingSound.volume = 0.1; // optional: softer volume



const introLines = [
  "Initializing terminal...",
  "Bypassing firewall...",
  "Accessing profile: AREEBA NAVEED...",
  "Access granted..."
];

let lineIndex = 0;
input.disabled = true;

function typeLine(line, onComplete) {
  let charIndex = 0;
  introDisplay.innerHTML = "";

  function typeChar() {
    if (charIndex < line.length) {
      introDisplay.innerHTML += line.charAt(charIndex);

      //to play typing sound
      const sound = typingSound.cloneNode();
      sound.play();

      charIndex++;
      setTimeout(typeChar, 100);
    } else {
      setTimeout(() => {
        introDisplay.innerHTML = "";
        onComplete();
      }, 1000);
    }
  }

  typeChar();
}


function playIntro() {
  if (lineIndex < introLines.length) {
    typeLine(introLines[lineIndex], () => {
      lineIndex++;
      playIntro();
    });
  } else {
    introDisplay.remove();
    inputContainer.classList.add("show");
    inputContainer.style.display = "flex";
    input.disabled = false;
    input.focus();
  }
}

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const command = input.value.trim();
    handleCommand(command);
    input.value = "";
  }
});

function handleCommand(command) {
  output.innerHTML = "";
  if (command === "help") {
    output.innerHTML += "Available commands:\n- help\n- ls\n- resume\n- cd projects\n- about me\n- clear\n";
  } else if (command === "ls") {
    output.innerHTML += "Sections:\n- resume\n- cd projects\n- about me\n- clear\n- close\n";
  } else if (command === "clear") {
    output.innerHTML = "";
  } else if (command === "cd projects") {
    output.innerHTML += `Projects:\nType the following to open a project:\n- 2048 Game\n- Hacker Terminal Portfolio\n`;
  }
  else if (command === "about me") {
    showProcessingBox(() => {
      const aboutText = `
    Name: Areeba Naveed
    Education: Rising sophomore at LUMS
    Interests: Aritificial Intelligence, Machine Learning, and  Web Development\n`;

      typeTextToOutput(aboutText);
    });
  }

  else if (command === "resume") {
    output.innerHTML += "Opening resume...\n";
    showProcessingBox(() => {
      createPopup("Resume", `
        <embed src='resume.pdf' type='application/pdf' style='width:100%; height:100%; border:none;' />
      `, "resume.pdf");
      output.innerHTML += "Resume hacked.\n";
    });
  } else if (command.toLowerCase() === "hacker terminal portfolio") {
    showProcessingBox(() => {
      createPopup("Hacker Terminal Portfolio", `
        Type: Web Project<br>
        Description: A web-based terminal simulation portfolio site.<br>
        Technologies: HTML, CSS, JavaScript<br>
        <a href='https://your-terminal-project-link.com' target='_blank' style='color:#00ff00;'>[Launch Project]</a>
      `);
    });
  } else if (command.toLowerCase() === "2048 game") {
    showProcessingBox(() => {
      createPopup("2048 Game (Web)", `
        <iframe src='https://2048-online.netlify.app' style='width:100%; height:100%; border:none;'></iframe>
      `, "https://2048-online.netlify.app");
    });
  } else {
    output.innerHTML += `Command not found: ${command}\nType 'help' to see available commands.\n`;
  }
  output.scrollTop = output.scrollHeight;
}



function  showProcessingBox(callback) {
  const box = document.getElementById("processing-box");
  const text = document.getElementById("processing-text");

  box.style.display = "block";
  text.innerHTML = "";

  const message = "Processing...";
  let i = 0;

  function typeNext() {
    if (i < message.length) {
      text.innerHTML += message[i++];

      const sound = typingSound.cloneNode();
      sound.play();

      setTimeout(typeNext, 100);
    } else {
      // ✅ Let browser render "Processing..." before popup load
      setTimeout(() => {
        requestAnimationFrame(() => {
          box.style.display = "none";
          if (callback) callback();
        });
      }, 300); // small delay
    }
  }

  //Trigger layout before starting animation
  box.offsetHeight; // force reflow
  typeNext();
}






function createPopup(title, content, newTabURL = null) {
  const popup = document.createElement("div");
  popup.className = "popup-window";
  popup.style.zIndex = 1000;
  popup.style.display = "flex";
  popup.style.left = "100px";
  popup.style.top = "100px";
  popup.style.position = "absolute";

  const popupId = "popup-" + Date.now();
  popup.id = popupId;

  popup.innerHTML = `
    <div class='resize-handle top'></div>
    <div class='resize-handle right'></div>
    <div class='resize-handle bottom'></div>
    <div class='resize-handle left'></div>
    <div class='popup-header'>
      <span class='popup-title'>${title}</span>
      <div class='popup-buttons'>
        ${newTabURL ? `<button class='popup-action' data-url='${newTabURL}'>↗</button>` : ""}
        <button class='popup-close'>X</button>
      </div>
    </div>
    <div class='popup-content'>
      <div class='zoom-wrapper'>${content}</div>
    </div>
  `;

  document.body.appendChild(popup);

  popup.addEventListener("mousedown", () => {
    popup.style.zIndex = 1000 + Date.now();
  });

  const newTabButton = popup.querySelector(".popup-action");
  if (newTabButton) {
    newTabButton.addEventListener("click", (e) => {
      const url = e.target.getAttribute("data-url");
      if (url) window.open(url, '_blank');
    });
  }

  popup.querySelector(".popup-close").addEventListener("click", () => {
    popup.remove();
  });

  const header = popup.querySelector(".popup-header");
  let isDragging = false, offsetX, offsetY;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  });

  function drag(e) {
    if (isDragging) {
      popup.style.left = e.clientX - offsetX + "px";
      popup.style.top = e.clientY - offsetY + "px";
    }
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  }

  let isResizing = false, currentHandle = null;
  let startX, startY, startWidth, startHeight, startTop, startLeft;

  popup.querySelectorAll(".resize-handle").forEach(handle => {
    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isResizing = true;
      currentHandle = handle.classList.contains("top") ? "top"
                    : handle.classList.contains("right") ? "right"
                    : handle.classList.contains("bottom") ? "bottom"
                    : "left";

      startX = e.clientX;
      startY = e.clientY;
      startWidth = popup.offsetWidth;
      startHeight = popup.offsetHeight;
      startTop = popup.offsetTop;
      startLeft = popup.offsetLeft;

      document.addEventListener("mousemove", resize, false);
      document.addEventListener("mouseup", stopResize, false);
    });
  });

  function resize(e) {
    if (!isResizing) return;

    if (currentHandle === "right") {
      popup.style.width = startWidth + (e.clientX - startX) + "px";
    } else if (currentHandle === "left") {
      const newWidth = startWidth - (e.clientX - startX);
      if (newWidth > 300) {
        popup.style.width = newWidth + "px";
        popup.style.left = startLeft + (e.clientX - startX) + "px";
      }
    } else if (currentHandle === "bottom") {
      popup.style.height = startHeight + (e.clientY - startY) + "px";
    } else if (currentHandle === "top") {
      const newHeight = startHeight - (e.clientY - startY);
      if (newHeight > 300) {
        popup.style.height = newHeight + "px";
        popup.style.top = startTop + (e.clientY - startY) + "px";
      }
    }
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener("mousemove", resize, false);
    document.removeEventListener("mouseup", stopResize, false);
  }

  const zoomWrapper = popup.querySelector(".zoom-wrapper");
  let zoomLevel = 1;

  zoomWrapper.addEventListener("wheel", function (e) {
    if (e.ctrlKey || e.metaKey || e.deltaY === 0) {
      e.preventDefault();
      const iframe = zoomWrapper.querySelector("iframe, embed");
      if (!iframe) return;

      if (e.deltaY < 0) {
        zoomLevel += 0.1;
      } else {
        zoomLevel = Math.max(0.3, zoomLevel - 0.1);
      }

      iframe.style.transform = `scale(${zoomLevel})`;
      iframe.style.transformOrigin = "top left";
    }
  }, { passive: false });
}


// ------ for the sound display with the letters in the intro line------//
function typeLine(line, onComplete) {
  let charIndex = 0;
  introDisplay.innerHTML = "";

  function typeChar() {
    if (charIndex < line.length) {
      introDisplay.innerHTML += line.charAt(charIndex);

      // to play sound per letter
      const sound = typingSound.cloneNode();
      sound.play();

      charIndex++;
      setTimeout(typeChar, 100);
    } else {
      setTimeout(() => {
        introDisplay.innerHTML = "";
        onComplete();
      }, 1000);
    }
  }

  typeChar();
}


//------ for the about me info to be displayed in live typing as well-------//
function typeTextToOutput(text, callback) {
  let i = 0;
  output.innerHTML = ""; // Clear previous output

  function typeNextChar() {
    if (i < text.length) {
      output.innerHTML += text[i];

      // for playing slower sound
      const sound = typingSound.cloneNode();
      sound.playbackRate = 0.9;  // slower playback
      sound.play();

      i++;
      setTimeout(typeNextChar, 80); // slower typing delay (was 40)
    } else {
      if (callback) callback();
    }
  }

  typeNextChar();
}




playIntro();
