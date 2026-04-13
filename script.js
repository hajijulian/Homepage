(function () {
  var DEFAULT_FILL_COLOR = '#0a0a0a';
  var STORAGE_KEY = 'interactive_buttons_data';
  var defaultButtons = [
    {
      id: 'btn_1',
      name: 'Comment',
      link: 'http://192.168.1.212/quizform/form-view.html?id=form_1761978121_6905a7096c473',
      icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path></svg>',
      enabled: true,
      fillColor: DEFAULT_FILL_COLOR
    },
    {
      id: 'btn_2',
      name: 'Like',
      link: 'https://www.google.com/',
      icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 21s-7.5-4.438-9.75-8.25C.75 9.938 2.625 6 6.75 6 9 6 10.5 7.5 12 9c1.5-1.5 3-3 5.25-3 4.125 0 6 3.938 3.75 6.75C19.5 16.563 12 21 12 21z"></path></svg>',
      enabled: false,
      fillColor: DEFAULT_FILL_COLOR
    },
    {
      id: 'btn_3',
      name: 'Share',
      link: '#',
      icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>',
      enabled: true,
      fillColor: DEFAULT_FILL_COLOR
    },
    {
      id: 'btn_4',
      name: 'Subscribe',
      link: '#',
      icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
      enabled: true,
      fillColor: DEFAULT_FILL_COLOR
    }
  ];

  var actionsContainer = document.getElementById('actionsContainer');
  var loginBtn = document.getElementById('loginBtn');
  var addNewBtn = document.getElementById('addNewBtn');
  var loginModal = document.getElementById('loginModal');
  var addButtonModal = document.getElementById('addButtonModal');
  var loginClose = document.getElementById('loginClose');
  var addButtonClose = document.getElementById('addButtonClose');
  var loginForm = document.getElementById('loginForm');
  var addButtonForm = document.getElementById('addButtonForm');
  var loginError = document.getElementById('loginError');
  var addButtonError = document.getElementById('addButtonError');
  var editButtonError = document.getElementById('editButtonError');
  var usernameInput = document.getElementById('username');
  var passwordInput = document.getElementById('password');
  var buttonNameInput = document.getElementById('buttonName');
  var buttonLinkInput = document.getElementById('buttonLink');
  var buttonIconInput = document.getElementById('buttonIcon');
  var editButtonModal = document.getElementById('editButtonModal');
  var editButtonClose = document.getElementById('editButtonClose');
  var editButtonForm = document.getElementById('editButtonForm');
  var editButtonIdInput = document.getElementById('editButtonId');
  var editButtonNameInput = document.getElementById('editButtonName');
  var editButtonLinkInput = document.getElementById('editButtonLink');
  var editButtonIconInput = document.getElementById('editButtonIcon');
  var editButtonColorInput = document.getElementById('editButtonColor');

  function loadButtons() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading buttons:', e);
    }
    return defaultButtons;
  }

  function saveButtons(buttons) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(buttons));
      return true;
    } catch (e) {
      console.error('Error saving buttons:', e);
      return false;
    }
  }

  function getButtons(callback) {
    if (callback) callback(loadButtons());
  }

  function isLoggedIn() {
    return sessionStorage.getItem('isAdminLoggedIn') === 'true';
  }

  function updateLoginUI() {
    if (isLoggedIn()) {
      loginBtn.textContent = 'LOGOUT';
      if (addNewBtn) addNewBtn.style.display = 'block';
    } else {
      loginBtn.textContent = 'LOGIN';
      if (addNewBtn) addNewBtn.style.display = 'none';
    }
  }

  function getButtonFillColor(button) {
    var color = button && button.fillColor ? sanitizeColorInput(button.fillColor) : null;
    return color || DEFAULT_FILL_COLOR;
  }

  function sanitizeColorInput(value) {
    if (!value && value !== 0) return null;
    var color = String(value).trim();
    if (!color) return null;
    if (color[0] !== '#') {
      color = '#' + color;
    }
    var hex = color.slice(1);
    if (!(hex.length === 3 || hex.length === 6)) return null;
    if (!/^[0-9a-fA-F]+$/.test(hex)) return null;
    if (hex.length === 3) {
      hex = hex.split('').map(function(ch) { return ch + ch; }).join('');
    }
    return '#' + hex.toLowerCase();
  }

  function adjustTextSize(labelElement, cardElement) {
    if (!labelElement || !cardElement) return;
    var text = labelElement.textContent;
    if (!text) return;
    setTimeout(function() {
      var cardRect = cardElement.getBoundingClientRect();
      var cardWidth = cardRect.width - 24;
      var computedStyle = window.getComputedStyle(labelElement);
      var fontSize = parseFloat(computedStyle.fontSize);
      var measureEl = document.createElement('span');
      measureEl.style.position = 'absolute';
      measureEl.style.visibility = 'hidden';
      measureEl.style.whiteSpace = 'nowrap';
      measureEl.style.fontSize = fontSize + 'px';
      measureEl.style.fontWeight = '600';
      measureEl.style.fontFamily = computedStyle.fontFamily;
      measureEl.textContent = text;
      document.body.appendChild(measureEl);
      var textWidth = measureEl.offsetWidth;
      document.body.removeChild(measureEl);
      if (textWidth > cardWidth && textWidth > 0) {
        var scale = (cardWidth / textWidth) * 0.95;
        var newSize = Math.max(12, fontSize * scale);
        labelElement.style.fontSize = newSize + 'px';
      }
      labelElement.style.maxWidth = '100%';
      labelElement.style.width = '100%';
    }, 50);
  }

  function renderButtonsWithData(buttons) {
    if (!actionsContainer) return;
    var isAdmin = isLoggedIn();
    actionsContainer.innerHTML = '';
    buttons.forEach(function(button) {
      var wrapper = document.createElement('div');
      wrapper.className = 'button-wrapper';
      wrapper.setAttribute('data-button-id', button.id);
      var toggleWrapper = document.createElement('div');
      toggleWrapper.className = 'toggle-switch ' + (button.enabled ? 'active' : 'inactive');
      toggleWrapper.setAttribute('data-toggle-id', button.id);
      var toggleLabel = document.createElement('span');
      toggleLabel.className = 'toggle-switch-label';
      toggleLabel.textContent = button.enabled ? 'ON' : 'OFF';
      var toggleSlider = document.createElement('span');
      toggleSlider.className = 'toggle-switch-slider';
      toggleWrapper.appendChild(toggleLabel);
      toggleWrapper.appendChild(toggleSlider);
      if (isAdmin) {
        toggleWrapper.addEventListener('click', function() {
          toggleButton(button.id);
        });
      }
      var card = document.createElement('button');
      card.className = 'card' + (button.enabled ? '' : ' disabled');
      card.type = 'button';
      card.style.setProperty('--card-fill', getButtonFillColor(button));
      var iconSpan = document.createElement('span');
      iconSpan.className = 'icon';
      iconSpan.setAttribute('aria-hidden', 'true');
      if (button.iconData) {
        var img = document.createElement('img');
        img.src = button.iconData;
        img.style.width = '28px';
        img.style.height = '28px';
        iconSpan.appendChild(img);
      } else {
        iconSpan.innerHTML = button.icon;
      }
      var labelSpan = document.createElement('span');
      labelSpan.className = 'label';
      labelSpan.textContent = button.name;
      adjustTextSize(labelSpan, card);
      card.appendChild(iconSpan);
      card.appendChild(labelSpan);
      if (button.enabled) {
        card.addEventListener('click', function() {
          window.location.href = button.link;
        });
      }
      var editIcon = document.createElement('div');
      editIcon.className = 'edit-icon';
      editIcon.setAttribute('data-edit-id', button.id);
      if (isAdmin) {
        editIcon.innerHTML = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
        editIcon.addEventListener('click', function(e) {
          e.stopPropagation();
          openEditModal(button);
        });
      } else {
        editIcon.style.display = 'none';
      }
      var trashIcon = document.createElement('div');
      trashIcon.className = 'trash-icon';
      trashIcon.setAttribute('data-delete-id', button.id);
      if (isAdmin) {
        trashIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
        trashIcon.addEventListener('click', function(e) {
          e.stopPropagation();
          if (confirm('Are you sure you want to delete "' + button.name + '"?')) {
            deleteButton(button.id);
          }
        });
      } else {
        trashIcon.style.display = 'none';
      }
      if (isAdmin) {
        wrapper.appendChild(toggleWrapper);
      }
      wrapper.appendChild(card);
      if (isAdmin) {
        wrapper.appendChild(editIcon);
        wrapper.appendChild(trashIcon);
      }
      actionsContainer.appendChild(wrapper);
    });
  }

  function renderButtons() {
    getButtons(function(buttons) {
      renderButtonsWithData(buttons);
    });
  }

  function toggleButton(buttonId) {
    getButtons(function(buttons) {
      var button = buttons.find(function(b) { return b.id === buttonId; });
      if (button) {
        button.enabled = !button.enabled;
        if (saveButtons(buttons)) {
          renderButtons();
        }
      }
    });
  }

  function deleteButton(buttonId) {
    getButtons(function(buttons) {
      buttons = buttons.filter(function(b) { return b.id !== buttonId; });
      if (saveButtons(buttons)) {
        renderButtons();
      }
    });
  }

  function fileToBase64(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.onerror = function() {
      callback(null);
    };
    reader.readAsDataURL(file);
  }

  function generateId() {
    return 'btn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function initLogin() {
    updateLoginUI();
    if (loginBtn) {
      loginBtn.addEventListener('click', function() {
        if (isLoggedIn()) {
          sessionStorage.removeItem('isAdminLoggedIn');
          updateLoginUI();
          renderButtons();
        } else {
          if (loginModal) {
            loginModal.classList.add('active');
            if (usernameInput) usernameInput.focus();
          }
        }
      });
    }
    if (loginClose) {
      loginClose.addEventListener('click', function() {
        if (loginModal) {
          loginModal.classList.remove('active');
          if (loginError) {
            loginError.classList.remove('show');
            loginError.textContent = '';
          }
          if (loginForm) loginForm.reset();
        }
      });
    }
    if (loginModal) {
      loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
          loginModal.classList.remove('active');
          if (loginError) {
            loginError.classList.remove('show');
            loginError.textContent = '';
          }
          if (loginForm) loginForm.reset();
        }
      });
    }
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var username = usernameInput.value.trim();
        var password = passwordInput.value;
        if (username === 'admin' && password === 'admin123') {
          sessionStorage.setItem('isAdminLoggedIn', 'true');
          updateLoginUI();
          renderButtons();
          if (loginModal) {
            loginModal.classList.remove('active');
            if (loginError) {
              loginError.classList.remove('show');
              loginError.textContent = '';
            }
            loginForm.reset();
          }
        } else {
          if (loginError) {
            loginError.textContent = 'Invalid username or password. Please try again.';
            loginError.classList.add('show');
          }
          if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
          }
        }
      });
    }
  }

  function initAddButton() {
    if (addNewBtn) {
      addNewBtn.addEventListener('click', function() {
        if (addButtonModal) {
          addButtonModal.classList.add('active');
          if (buttonNameInput) buttonNameInput.focus();
        }
      });
    }
    if (addButtonClose) {
      addButtonClose.addEventListener('click', function() {
        if (addButtonModal) {
          addButtonModal.classList.remove('active');
          if (addButtonError) {
            addButtonError.classList.remove('show');
            addButtonError.textContent = '';
          }
          if (addButtonForm) addButtonForm.reset();
        }
      });
    }
    if (addButtonModal) {
      addButtonModal.addEventListener('click', function(e) {
        if (e.target === addButtonModal) {
          addButtonModal.classList.remove('active');
          if (addButtonError) {
            addButtonError.classList.remove('show');
            addButtonError.textContent = '';
          }
          if (addButtonForm) addButtonForm.reset();
        }
      });
    }
    if (addButtonForm) {
      addButtonForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var name = buttonNameInput.value.trim();
        var link = buttonLinkInput.value.trim();
        var iconFile = buttonIconInput.files[0];
        if (!name) {
          if (addButtonError) {
            addButtonError.textContent = 'Please enter a button name.';
            addButtonError.classList.add('show');
          }
          return;
        }
        if (!link) {
          if (addButtonError) {
            addButtonError.textContent = 'Please enter a link URL.';
            addButtonError.classList.add('show');
          }
          return;
        }
        var newButton = {
          id: generateId(),
          name: name,
          link: link,
          icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>',
          iconData: null,
          enabled: true,
          fillColor: DEFAULT_FILL_COLOR
        };
        if (iconFile) {
          fileToBase64(iconFile, function(base64) {
            if (base64) {
              newButton.iconData = base64;
            }
            addButtonToList(newButton);
          });
        } else {
          addButtonToList(newButton);
        }
      });
    }
  }

  function addButtonToList(button) {
    getButtons(function(buttons) {
      buttons.push(button);
      if (saveButtons(buttons)) {
        renderButtons();
        if (addButtonModal) {
          addButtonModal.classList.remove('active');
          if (addButtonError) {
            addButtonError.classList.remove('show');
            addButtonError.textContent = '';
          }
          if (addButtonForm) addButtonForm.reset();
        }
      } else {
        if (addButtonError) {
          addButtonError.textContent = 'Failed to add button. Please try again.';
          addButtonError.classList.add('show');
        }
      }
    });
  }

  function openEditModal(button) {
    if (!editButtonModal || !editButtonIdInput || !editButtonNameInput || !editButtonLinkInput) return;
    editButtonIdInput.value = button.id;
    editButtonNameInput.value = button.name;
    editButtonLinkInput.value = button.link;
    if (editButtonColorInput) {
      editButtonColorInput.value = getButtonFillColor(button);
    }
    if (editButtonIconInput) {
      editButtonIconInput.value = '';
    }
    if (editButtonError) {
      editButtonError.classList.remove('show');
      editButtonError.textContent = '';
    }
    editButtonModal.classList.add('active');
    if (editButtonNameInput) editButtonNameInput.focus();
  }

  function initEditButton() {
    if (editButtonClose) {
      editButtonClose.addEventListener('click', function() {
        if (editButtonModal) {
          editButtonModal.classList.remove('active');
          if (editButtonError) {
            editButtonError.classList.remove('show');
            editButtonError.textContent = '';
          }
          if (editButtonForm) editButtonForm.reset();
        }
      });
    }
    if (editButtonModal) {
      editButtonModal.addEventListener('click', function(e) {
        if (e.target === editButtonModal) {
          editButtonModal.classList.remove('active');
          if (editButtonError) {
            editButtonError.classList.remove('show');
            editButtonError.textContent = '';
          }
          if (editButtonForm) editButtonForm.reset();
        }
      });
    }
    if (editButtonForm) {
      editButtonForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var buttonId = editButtonIdInput.value;
        var name = editButtonNameInput.value.trim();
        var link = editButtonLinkInput.value.trim();
        var iconFile = editButtonIconInput ? editButtonIconInput.files[0] : null;
        var fillColor = editButtonColorInput ? sanitizeColorInput(editButtonColorInput.value) : null;
        if (!name) {
          if (editButtonError) {
            editButtonError.textContent = 'Please enter a button name.';
            editButtonError.classList.add('show');
          }
          return;
        }
        if (!link) {
          if (editButtonError) {
            editButtonError.textContent = 'Please enter a link URL.';
            editButtonError.classList.add('show');
          }
          return;
        }
        getButtons(function(buttons) {
          var buttonIndex = buttons.findIndex(function(b) { return b.id === buttonId; });
          if (buttonIndex === -1) {
            if (editButtonError) {
              editButtonError.textContent = 'Button not found.';
              editButtonError.classList.add('show');
            }
            return;
          }
          var updatedButton = buttons[buttonIndex];
          updatedButton.name = name;
          updatedButton.link = link;
          updatedButton.fillColor = fillColor || getButtonFillColor(updatedButton);
          if (iconFile) {
            fileToBase64(iconFile, function(base64) {
              if (base64) {
                updatedButton.iconData = base64;
                updatedButton.icon = null;
              }
              updateButton(updatedButton, buttons);
            });
          } else {
            updateButton(updatedButton, buttons);
          }
        });
      });
    }
  }

  function updateButton(updatedButton, buttons) {
    var buttonIndex = buttons.findIndex(function(b) { return b.id === updatedButton.id; });
    if (buttonIndex !== -1) {
      buttons[buttonIndex] = updatedButton;
      if (saveButtons(buttons)) {
        renderButtons();
        if (editButtonModal) {
          editButtonModal.classList.remove('active');
          if (editButtonError) {
            editButtonError.classList.remove('show');
            editButtonError.textContent = '';
          }
          if (editButtonForm) editButtonForm.reset();
        }
      } else {
        if (editButtonError) {
          editButtonError.textContent = 'Failed to update button. Please try again.';
          editButtonError.classList.add('show');
        }
      }
    }
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (loginModal && loginModal.classList.contains('active')) {
        loginModal.classList.remove('active');
        if (loginError) {
          loginError.classList.remove('show');
          loginError.textContent = '';
        }
        if (loginForm) loginForm.reset();
      }
      if (addButtonModal && addButtonModal.classList.contains('active')) {
        addButtonModal.classList.remove('active');
        if (addButtonError) {
          addButtonError.classList.remove('show');
          addButtonError.textContent = '';
        }
        if (addButtonForm) addButtonForm.reset();
      }
      if (editButtonModal && editButtonModal.classList.contains('active')) {
        editButtonModal.classList.remove('active');
        if (editButtonError) {
          editButtonError.classList.remove('show');
          editButtonError.textContent = '';
        }
        if (editButtonForm) editButtonForm.reset();
      }
    }
  });

  initLogin();
  initAddButton();
  initEditButton();
  renderButtons();
})();