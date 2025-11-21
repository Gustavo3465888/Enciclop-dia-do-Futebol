document.addEventListener('DOMContentLoaded', () => {
    const teamsContainer = document.getElementById('teams-container');
    const searchInput = document.getElementById('campo-busca');
    let allTeamsData = [];

    // Carrega os dados dos times do arquivo JSON
    fetch('futzin dados.json')
        .then(response => response.json())
        .then(data => {
            allTeamsData = data;
            displayTeams(allTeamsData);
        })
        .catch(error => {
            console.error('Erro ao carregar os dados dos times:', error);
            teamsContainer.innerHTML = '<p>Não foi possível carregar os dados dos times. Tente novamente mais tarde.</p>';
        });

    // Adiciona o listener para a busca em tempo real
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTeams = allTeamsData.filter(team => 
            team.nome.toLowerCase().includes(searchTerm)
        );
        displayTeams(filteredTeams);
    });

    /**
     * Agrupa os times por país e liga, e os exibe na tela.
     * @param {Array} teams - A lista de times a ser exibida.
     */
    function displayTeams(teams) {
        teamsContainer.innerHTML = '';

        if (teams.length === 0) {
            teamsContainer.innerHTML = '<p>Nenhum time encontrado com esse nome.</p>';
            return;
        }

        // Agrupa os times por país e depois por liga
        const groupedByLeague = teams.reduce((acc, team) => {
            const leagueKey = `${team.pais} - ${team.liga}`;
            if (!acc[leagueKey]) {
                acc[leagueKey] = [];
            }
            acc[leagueKey].push(team);
            return acc;
        }, {});

        // Ordena as ligas para uma exibição consistente
        const sortedLeagues = Object.keys(groupedByLeague).sort();

        for (const leagueKey of sortedLeagues) {
            const teamsInLeague = groupedByLeague[leagueKey];
            const [pais, liga] = leagueKey.split(' - ');

            // Cria a seção para a liga
            const leagueSection = document.createElement('section');
            leagueSection.className = 'league-section';

            leagueSection.innerHTML = `
                <div class="league-header">
                    <h2>${liga}</h2>
                    <p>${pais}</p>
                </div>
            `;

            // Cria o grid para os times
            const teamsGrid = document.createElement('div');
            teamsGrid.className = 'teams-grid';

            teamsInLeague.forEach(team => {
                const teamCard = document.createElement('div');
                
                // Verifica se é uma lenda para aplicar a classe especial
                const isLegend = team.liga === 'Lendas do Futebol';
                teamCard.className = isLegend ? 'team-card legend-card' : 'team-card';

                teamCard.innerHTML = `
                    <div class="team-card-image">
                        <img src="${team.imagem}" alt="Logo do ${team.nome}">
                    </div>
                    <div class="team-card-content">
                        <h3>${team.nome}</h3>
                        <p>${team.descriçao}</p> 
                        <a href="${team.link}" target="_blank" rel="noopener noreferrer">${isLegend ? 'Ver Perfil' : 'Site Oficial'}</a>
                    </div>
                `;
                teamsGrid.appendChild(teamCard);
            });

            leagueSection.appendChild(teamsGrid);
            teamsContainer.appendChild(leagueSection);
        }
    }
});