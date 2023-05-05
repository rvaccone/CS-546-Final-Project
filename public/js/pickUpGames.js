const unjoinButton = document.getElementById('unjoinButton');

if (unjoinButton) {
	unjoinButton.addEventListener('click', async () => {
		const currPath = window.location.pathname;
		const gameId = currPath.replace('/game/gameDetails/', '');
		console.log(gameId);
		try {
			const response = await fetch(`/game/addUser/${gameId}`, {
				method: 'DELETE',
			});
			//   const result = await response.json();
			console.log(response);
			// Reload the page to update the button
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	});
}
