const title = document.createElement('h1');
title.innerHTML = 'virtual keyboard for Windows';
title.classList.add('title');
document.body.appendChild(title);

const switchLang = document.createElement('h3');
switchLang.innerHTML = 'для смены раскладки языка используйте...';
switchLang.classList.add('switchLang');
document.body.appendChild(switchLang);

const textArea = document.createElement('textArea');
textArea.classList.add('use-keyboard-input', 'textArea');
textArea.getAttribute('autofocus');
document.body.appendChild(textArea);

const Keyboard = {
  elements: {
      main: null,
      keysContainer: null,
      keys: []
  },

  eventHandlers: {
      oninput: null,
      onclose: null
  },

  properties: {
      value: "",
      capsLock: false
  },

  init() {
      // Create main elements
      this.elements.main = document.createElement("div");
      this.elements.keysContainer = document.createElement("div");

      // Setup main elements
      this.elements.main.classList.add("keyboard");
      this.elements.keysContainer.classList.add("keyboard__keys");
      this.elements.keysContainer.appendChild(this._createKeys());

      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

      // Add to DOM
      this.elements.main.appendChild(this.elements.keysContainer);
      document.body.appendChild(this.elements.main);

      // Automatically use keyboard for elements with .use-keyboard-input
      document.querySelectorAll(".use-keyboard-input").forEach(element => {
          element.addEventListener("focus", () => {
              this.open(element.value, currentValue => {
                  element.value = currentValue;
              });
          });
      });
  },

  _createKeys() {
      const fragment = document.createDocumentFragment();
      const keyLayout = [
          "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
          "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
          "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
          "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
          "ctrl", "alt", "space", "alt", "ctrl"
      ];

      // Creates HTML for an icon
      keyLayout.forEach(key => {
          const keyElement = document.createElement("button");
          const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

          // Add attributes/classes
          keyElement.setAttribute("type", "button");
          keyElement.classList.add("keyboard__key");

          switch (key) {
              case "backspace":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = ("Backspace");

                  keyElement.addEventListener("click", () => {
                      this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                      this._triggerEvent("oninput");
                  });

                  break;

              case "caps":
                  keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                  keyElement.innerHTML = ("CapsLock");

                  keyElement.addEventListener("click", () => {
                      this._toggleCapsLock();
                      keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                  });

                  break;

              case "enter":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = ("Enter");

                  keyElement.addEventListener("click", () => {
                      this.properties.value += "\n";
                      this._triggerEvent("oninput");
                  });

                  break;

              case "space":
                  keyElement.classList.add("keyboard__key--extra-wide");
                  keyElement.innerHTML = ("Space");

                  keyElement.addEventListener("click", () => {
                      this.properties.value += " ";
                      this._triggerEvent("oninput");
                  });

                  break;

              case "tab":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = ("Tab");

                  keyElement.addEventListener("click", () => {
                      this.properties.value += "    ";
                      this._triggerEvent("oninput");
                  });

                  break;

              case "ctrl":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = ("Ctrl");

                  break;

              case "shift":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = ("Shift");


                  break;

              case "alt":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = ("Alt");


                  break;

              default:
                  keyElement.textContent = key.toLowerCase();

                  keyElement.addEventListener("click", () => {
                      this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                      this._triggerEvent("oninput");
                  });

                  break;
          }

          fragment.appendChild(keyElement);

          if (insertLineBreak) {
              fragment.appendChild(document.createElement("br"));
          }
      });

      return fragment;
  },

  _triggerEvent(handlerName) {
      if (typeof this.eventHandlers[handlerName] == "function") {
          this.eventHandlers[handlerName](this.properties.value);
      }
  },

  _toggleCapsLock() {
      this.properties.capsLock = !this.properties.capsLock;

      for (const key of this.elements.keys) {
          if (key.childElementCount === 0) {
              key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
          }
      }
  },

  open(initialValue, oninput, onclose) {
      this.properties.value = initialValue || "";
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
  },

  close() {
      this.properties.value = "";
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
