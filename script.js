const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Typing effect
function typeOut(element, text, speed = 30) {
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

// Add message
function addMessage(sender, text, typing = false) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (typing) {
    typeOut(msg, text);
  } else {
    msg.textContent = text;
  }
}

// Intro message
document.addEventListener("DOMContentLoaded", () => {
  addMessage("assistant", "I’m Valoran. Stop lying to yourself. What’s the real problem holding you back?", true);
});

// Send message
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  userInput.value = "";

  const typingMsg = document.createElement("div");
  typingMsg.classList.add("message", "assistant");
  typingMsg.textContent = "Valoran is typing...";
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();

    chatBox.removeChild(typingMsg);
    addMessage("assistant", data.reply, true);

  } catch (err) {
    chatBox.removeChild(typingMsg);
    addMessage("assistant", "Backend not available. Check your API key.", true);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
