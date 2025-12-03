const chatWrapper = document.getElementById('chatWrapper');
const launcher = document.getElementById('chatLauncher');
const closeBtn = document.getElementById('closeChat');
const expandBtn = document.getElementById('expandChat');
const messages = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const input = document.getElementById('messageInput');
const chipsBar = document.getElementById('chipsBar');

const assistantOverlay = document.getElementById('assistantOverlay');
const assistantBack = document.getElementById('assistantBack');
const assistantMessages = document.getElementById('assistantMessages');
const assistantSend = document.getElementById('assistantSend');
const assistantInput = document.getElementById('assistantInput');
const assistantChips = document.getElementById('assistantChips');
const lessonHistoryContainer = document.getElementById('lessonHistory');

const lessonHistory = [];

function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

function timeNow() {
  const now = new Date();
  return now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function renderMessage({ text, sender = 'assistant', time }, container = messages) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${sender}`;
  bubble.innerHTML = `${text}<span class="meta">${time || timeNow()}</span>`;
  container.appendChild(bubble);
  scrollToBottom(container);
}

function renderHistory() {
  if (!lessonHistoryContainer) return;
  lessonHistoryContainer.innerHTML = '';

  lessonHistory.forEach((lesson) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.dataset.code = lesson.code;
    item.textContent = lesson.title;
    item.addEventListener('click', () => openLessonPage(lesson.code, lesson.title));
    lessonHistoryContainer.appendChild(item);
  });
}

function addLessonToHistory(lesson) {
  if (lessonHistory.some((item) => item.code === lesson.code)) return;
  lessonHistory.push(lesson);
  renderHistory();
}

function openLessonPage(code, title = `Урок ${code}`) {
  if (!code) return;

  const pageTitle = title || `Урок ${code}`;
  const lessonWindow = window.open('', '_blank');

  if (lessonWindow) {
    lessonWindow.document.write(`<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>${pageTitle}</title></head><body><h1>${pageTitle}</h1><p>Текст: ${pageTitle}</p></body></html>`);
    lessonWindow.document.close();
  }

  addLessonToHistory({ code, title: pageTitle });
}

function renderDate(dateText) {
  const badge = document.createElement('div');
  badge.className = 'date-divider';
  badge.textContent = dateText;
  messages.appendChild(badge);
}

function seedSmallConversation() {
  renderDate('11.11.2025');
  renderMessage({
    sender: 'assistant',
    time: '10:00',
    text: `Привет, я Ассистент-помощник для быстрого поиска извлечённых уроков по твоим запросам.<br>Напиши мне на какую тему ты хочешь найти, а я предложу тебе несколько вариантов.`,
  });
  renderMessage({
    sender: 'user',
    time: '10:01',
    text: 'Подбери уроки для ознакомления на тему Внедрение технологий 5С в АО АСЭ',
  });
  renderMessage({
    sender: 'assistant',
    time: '10:02',
    text: `По вашему запросу подобраны следующие извлечённые уроки, которые соответствуют теме Внедрение технологий 5С в АО АСЭ<ol>
        <li><strong>Название извлеченного урока</strong><br>Описание<br><a href="#" class="lesson-link" data-code="Q1230">Ссылка</a></li>
        <li><strong>Название извлеченного урока</strong><br>Описание<br><a href="#" class="lesson-link" data-code="W0234">Ссылка</a></li>
        <li><strong>Название извлеченного урока</strong><br>Описание<br><a href="#" class="lesson-link" data-code="E1034">Ссылка</a></li>
        <li><strong>Название извлеченного урока</strong><br>Описание<br><a href="#" class="lesson-link" data-code="R1204">Ссылка</a></li>
      </ol>`,
  });
}

function openChat() {
  chatWrapper.classList.add('open');
}

function closeChat() {
  chatWrapper.classList.remove('open');
}

function showAssistant() {
  assistantOverlay.classList.add('open');
  closeChat();
}

function hideAssistant() {
  assistantOverlay.classList.remove('open');
  openChat();
}

function handleSendSmall() {
  const value = input.value.trim();
  if (!value) return;
  renderMessage({ sender: 'user', text: value });
  renderMessage({
    sender: 'assistant',
    text: `Я получил ваш запрос: "${value}". Здесь должен быть ответ ассистента (заглушка).`,
  });
  input.value = '';
  input.focus();
}

function handleSendLarge() {
  const value = assistantInput.value.trim();
  if (!value) return;
  renderMessage({ sender: 'user', text: value }, assistantMessages);
  renderMessage({
    sender: 'assistant',
    text: `Я обработал ваш запрос: "${value}". Здесь появится развёрнутый ответ ассистента.`,
  }, assistantMessages);
  assistantInput.value = '';
  assistantInput.focus();
}

function handleChipClick(event, targetInput) {
  if (!event.target.classList.contains('chip')) return;
  targetInput.value = event.target.textContent;
  targetInput.focus();
}

launcher.addEventListener('click', openChat);
closeBtn.addEventListener('click', closeChat);
expandBtn.addEventListener('click', showAssistant);
assistantBack.addEventListener('click', hideAssistant);

sendBtn.addEventListener('click', handleSendSmall);
assistantSend.addEventListener('click', handleSendLarge);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSendSmall();
  }
});

assistantInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSendLarge();
  }
});

chipsBar.addEventListener('click', (e) => handleChipClick(e, input));
assistantChips.addEventListener('click', (e) => handleChipClick(e, assistantInput));

function handleLessonLink(event) {
  const link = event.target.closest('.lesson-link');
  if (!link) return;
  event.preventDefault();
  const code = link.dataset.code;
  if (!code) return;
  const title = link.dataset.title || `Урок ${code}`;
  openLessonPage(code, title);
}

assistantMessages?.addEventListener('click', handleLessonLink);
messages?.addEventListener('click', handleLessonLink);

seedSmallConversation();
