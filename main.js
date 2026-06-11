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
