const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
			let cards = [],
				flippedCards = [],
				lockBoard = false,
				moves = 0,
				matches = 0;
			function initGame() {
				let doubled = [...emojis, ...emojis];
				for (let i = doubled.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[doubled[i], doubled[j]] = [doubled[j], doubled[i]];
				}
				cards = doubled.map((emoji, index) => ({
					id: index,
					emoji: emoji,
					flipped: false,
					matched: false,
				}));
				flippedCards = [];
				lockBoard = false;
				moves = 0;
				matches = 0;
				updateStats();
				document.getElementById("message").textContent = "";
				renderBoard();
			}
			function updateStats() {
				document.getElementById("moves").textContent = moves;
				document.getElementById("matches").textContent = matches;
			}
			function renderBoard() {
				const grid = document.getElementById("gameGrid");
				grid.innerHTML = cards
					.map(
						(card) =>
							`<div class="card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}" data-id="${card.id}">${card.flipped || card.matched ? card.emoji : "?"}</div>`,
					)
					.join("");
			}
			function handleCardClick(id) {
				if (lockBoard) return;
				const card = cards.find((c) => c.id == id);
				if (card.flipped || card.matched) return;
				card.flipped = true;
				renderBoard();
				flippedCards.push(card);
				if (flippedCards.length === 2) {
					moves++;
					updateStats();
					const [card1, card2] = flippedCards;
					if (card1.emoji === card2.emoji) {
						card1.matched = true;
						card2.matched = true;
						matches++;
						updateStats();
						flippedCards = [];
						renderBoard();
						if (matches === emojis.length) {
							document.getElementById("message").textContent =
								"🎉 You won! Congratulations! 🎉";
						}
					} else {
						lockBoard = true;
						setTimeout(() => {
							card1.flipped = false;
							card2.flipped = false;
							flippedCards = [];
							lockBoard = false;
							renderBoard();
						}, 1000);
					}
				}
			}
			document.getElementById("gameGrid").addEventListener("click", (e) => {
				const cardDiv = e.target.closest(".card");
				if (cardDiv && !cardDiv.classList.contains("matched")) {
					const id = parseInt(cardDiv.dataset.id);
					handleCardClick(id);
				}
			});
			document.getElementById("resetBtn").addEventListener("click", initGame);
			initGame();