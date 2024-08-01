import messages from '../message-data.json';

const messagesList = document.querySelector('.messages');
const scrollToBottomBtn = document.querySelector('.scroll-to-bottom-btn');

let currentState = 0;
const messagesLength = messages.length;

function renderMessage(message) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;

  if (message.type === 'message') {
    messagesList.insertAdjacentHTML(
      'beforeend',
      `<div class="message"><svg class="message-tail" width="17" height="21"><use href="../img/icons.svg#tail"></use></svg><p class="message-text">${message.message}</p><p class="message-time">${timeString}</p></div>`
    );
  }

  if (message.type === 'question') {
    const answerBtns = message.options
      .map(btn => {
        return `<button class="answer-button" type="button" data-id="${btn.id}">${btn.label}</button>`;
      })
      .join('');
    messagesList.insertAdjacentHTML(
      'beforeend',
      `<div class="message"><svg class="message-tail" width="17" height="21"><use href="../img/icons.svg#tail"></use></svg><p class="message-text question">${message.message}</p><p class="message-time">${timeString}</p></div><div class="answer-buttons-wrap">${answerBtns}</div>`
    );

    setTimeout(() => {
      messagesList.scrollTop = messagesList.scrollHeight;
    }, 200);

    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(button => {
      button.addEventListener('click', handleAnswerClick);
    });
  }
}

function handleAnswerClick(event) {
  const answerId = event.target.dataset.id;
  const currentMessage = messages[currentState];
  const nextMessageId = currentMessage.next[answerId];
  const nextMessage = messages.find(message => message.id === nextMessageId);

  messagesList.insertAdjacentHTML(
    'beforeend',
    `<div class="response"><p class="message-text">${event.target.textContent}</p><svg class="response-tail" width="17" height="21"><use href="../img/icons.svg#tail"></use></svg></div>`
  );

  const currentQuestion = event.target.closest('.answer-buttons-wrap');
  const answerButtons = currentQuestion.querySelectorAll('.answer-button');

  answerButtons.forEach(button => {
    button.disabled = true;
  });

  if (nextMessage) {
    currentState = messages.indexOf(nextMessage);
    renderMessage(nextMessage);
  }

  if (nextMessageId === 7) {
    setTimeout(() => {
      renderTable();
    }, 1000);
  }
}

function init() {
  setTimeout(() => {
    messagesList.insertAdjacentHTML(
      'afterbegin',
      '<p class="date animate__backInUp">Сьогодні</p>'
    );
  }, 700);

  let delay = 1000;

  for (let i = 0; i < messagesLength; i++) {
    const message = messages[i];

    if (message.type === 'question') {
      setTimeout(() => {
        currentState = i;
        renderMessage(message);
      }, delay);
      break;
    } else {
      setTimeout(() => {
        renderMessage(message);
      }, delay);
      delay += 1000;
    }
  }

  messagesList.addEventListener('scroll', () => {
    if (
      messagesList.scrollTop + messagesList.clientHeight <
      messagesList.scrollHeight
    ) {
      scrollToBottomBtn.classList.add('show');
    } else {
      scrollToBottomBtn.classList.remove('show');
    }
  });

  scrollToBottomBtn.addEventListener('click', () => {
    messagesList.scrollTop = messagesList.scrollHeight;
  });
}

function renderTable() {
  messagesList.insertAdjacentHTML(
    'beforeend',
    '<div class="message"><svg class="message-tail" width="17" height="21"><use href="./img/icons.svg#tail"></use></svg><form class="form"><input type="text" name="name" id="name" class="form-input" placeholder="Імʼя" required/><input type="text" name="surname" id="surname" class="form-input" placeholder="Прізвище" required/><input type="email" name="email" id="email" class="form-input" placeholder="Email" required/><input type="number" name="phone" id="phone" class="form-input" placeholder="Телефон"required/><button type="submit" class="form-submit-btn">Надіслати</button></form></div>'
  );
}

function checkForm() {
  const form = document.querySelector('.form');

  if (form) {
    let dataObj = {};
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(form);
      for (const [key, value] of formData) {
        dataObj[key] = value;
      }
      sessionStorage.setItem('dataObj', JSON.stringify(dataObj));
      form.reset();
      window.location.href = 'thanks.html';
    });

    clearInterval(intervalId);
  }
}

const intervalId = setInterval(checkForm, 1000);

init();
