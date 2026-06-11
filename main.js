class LottoTicket extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    generateNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    render() {
        const numbers = this.generateNumbers();
        this.shadowRoot.innerHTML = `
            <style>
                .ticket {
                    display: flex;
                    justify-content: center;
                    gap: 0.5em;
                    margin-bottom: 2em;
                }
                .number {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5em;
                    font-weight: bold;
                    color: white;
                    background: #333;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
                }

                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                ${numbers.map((_, i) => `
                    .number:nth-child(${i + 1}) {
                        animation-delay: ${i * 0.1}s;
                    }
                `).join('')}
            </style>
            <div class="ticket">
                ${numbers.map(num => `<div class="number">${num}</div>`).join('')}
            </div>
        `;
    }
}

customElements.define('lotto-ticket', LottoTicket);

document.getElementById('generator').addEventListener('click', () => {
    document.querySelector('lotto-ticket').render();
});

// Comment System Logic
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentList = document.getElementById('comment-list');

// EmailJS Configuration (Replace with your actual keys)
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

function loadComments() {
    const comments = JSON.parse(localStorage.getItem('lotto-comments') || '[]');
    commentList.innerHTML = '';
    comments.forEach(comment => addCommentToDOM(comment));
}

function addCommentToDOM(text) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.textContent = text;
    commentList.appendChild(div);
    commentList.scrollTop = commentList.scrollHeight;
}

function sendEmailNotification(text) {
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.log('EmailJS is not configured yet. Please provide your keys.');
        return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        message: text,
        timestamp: new Date().toLocaleString()
    })
    .then(() => console.log('Email sent successfully!'))
    .catch((error) => console.error('Failed to send email:', error));
}

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = commentInput.value.trim();
    if (text) {
        addCommentToDOM(text);
        saveComment(text);
        sendEmailNotification(text); // Trigger email notification
        commentInput.value = '';
    }
});

function saveComment(text) {
    const comments = JSON.parse(localStorage.getItem('lotto-comments') || '[]');
    comments.push(text);
    localStorage.setItem('lotto-comments', JSON.stringify(comments));
}

loadComments();
