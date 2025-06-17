document.addEventListener('DOMContentLoaded', () => {
    // --- DADOS ---
    const quizData = [
        { question: "Quem marcou os dois gols do Flamengo na final da Libertadores de 2019?", a: "Bruno Henrique", b: "Arrascaeta", c: "Gabigol", d: "Diego Ribas", correct: "c" },
        { question: "Qual o ano de fundação do Clube de Regatas do Flamengo?", a: "1895", b: "1912", c: "1902", d: "1888", correct: "a" },
        { question: "Contra qual time Zico marcou seu gol mais famoso de falta no Maracanã em 1981?", a: "Vasco da Gama", b: "Cobreloa", c: "Liverpool", d: "Atlético-MG", correct: "b" }
    ];
    // O primeiro prêmio ("Manto Oficial") será sempre o vencedor.
    const premios = ["Manto Oficial", "Tente Novamente", "Ingresso VIP", "R$1000 Bônus Flabet", "Manto Oficial", "Tente Novamente", "Ingresso VIP", "Tente Novamente"];

    // --- ELEMENTOS DO DOM ---
    const quizContainer = document.getElementById('quiz-container'), questionEl = document.getElementById('question'), answerEls = document.querySelectorAll('.answer'), a_text = document.getElementById('a_text'), b_text = document.getElementById('b_text'), c_text = document.getElementById('c_text'), d_text = document.getElementById('d_text'), submitBtn = document.getElementById('submit');
    const rouletteContainer = document.getElementById('roulette-container'), wheel = document.getElementById('wheel'), spinBtn = document.getElementById('spin-btn'), prizeResultEl = document.getElementById('prize-result');
    const modalContainer = document.getElementById('modal-container'), prizeNameEl = document.getElementById('prize-name'), ctaButton = document.getElementById('cta-button'), closeModalBtn = document.getElementById('close-modal'), confettiContainer = document.getElementById('confetti-container');

    let currentQuiz = 0, score = 0, spinning = false;

    function loadQuiz() { deselectAnswers(); const e = quizData[currentQuiz]; questionEl.innerText = e.question; a_text.innerText = e.a; b_text.innerText = e.b; c_text.innerText = e.c; d_text.innerText = e.d; }
    function deselectAnswers() { answerEls.forEach(e => { e.checked = false }); }
    function getSelected() { let e; return answerEls.forEach(t => { t.checked && (e = t.id) }), e; }
    function createWheel() { const e = premios.length, t = 360 / e, n = ['var(--flamengo-red)', 'var(--flamengo-black)']; let o = 'conic-gradient('; wheel.innerHTML = ''; const a = 300; premios.forEach((l, r) => { const s = r * t, i = (r + 1) * t, d = n[r % 2]; o += `${d} ${s}deg ${i}deg, `; const c = document.createElement('div'); c.classList.add('prize-label'), c.textContent = l; const u = s + t / 2 - 90, m = u * Math.PI / 180, p = a * .35, g = a / 2 + p * Math.cos(m), h = a / 2 + p * Math.sin(m); c.style.left = `${g}px`, c.style.top = `${h}px`, c.style.transform = `translate(-50%,-50%) rotate(${u + 90}deg)`, wheel.appendChild(c) }), wheel.style.background = o.slice(0, -2) + ')' }
    function showPrizeModal(e) { prizeNameEl.innerText = e; localStorage.setItem('premioGanho', e); ctaButton.href = "captura.html"; modalContainer.classList.remove('hidden'); triggerConfetti(); }
    function closeModal() { modalContainer.classList.add('hidden'); confettiContainer.innerHTML = ''; }
    function triggerConfetti() { confettiContainer.innerHTML = ''; for (let e = 0; e < 100; e++) { const t = document.createElement('div'); t.classList.add('confetti'), t.style.left = `${Math.random() * 100}%`, t.style.animationDelay = `${Math.random() * 2}s`, t.style.backgroundColor = Math.random() > .5 ? "var(--flamengo-red)" : "var(--flamengo-black)", confettiContainer.appendChild(t) } }

    submitBtn.addEventListener('click', () => { const e = getSelected(); e && (e === quizData[currentQuiz].correct && score++ , currentQuiz++ , currentQuiz < quizData.length ? loadQuiz() : (quizContainer.classList.add('hidden'), rouletteContainer.classList.remove('hidden'))) });
    
    spinBtn.addEventListener('click', () => {
        if (spinning) return;
        spinning = true;
        prizeResultEl.innerText = '';
        spinBtn.disabled = true;

        // --- LÓGICA DE RESULTADO FIXO ---
        // A roleta sempre irá parar no primeiro prêmio da lista ("Manto Oficial").
        const prizeIndex = 0; 
        
        const totalPrizes = premios.length;
        const prizeDegree = prizeIndex * (360 / totalPrizes);
        const extraRotation = 360 * 5;
        const totalRotation = extraRotation + prizeDegree;
        const segmentCorrection = (360 / totalPrizes) / 2;
        const finalRotation = totalRotation - segmentCorrection;

        wheel.style.transform = `rotate(${finalRotation}deg)`;

        wheel.addEventListener('transitionend', () => {
            const finalPrize = premios[prizeIndex];
            showPrizeModal(finalPrize); // Mostra o modal diretamente, pois o prêmio é sempre o vencedor.
            spinning = false;
        }, { once: true });
    });
    
    closeModalBtn.addEventListener('click', closeModal);

    loadQuiz();
    createWheel();
});