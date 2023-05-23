const https = require('https');
const http = require('http');

const app = http.createServer((req, res) => {
  const apiKey = 'e411168a8aba145be2b63da7fb26bba3afcd7a65b74382d094877ec65ecc5aae';
  const teamName = encodeURIComponent('Atlético de Madrid');
  
  const options = {
    hostname: 'apiv3.apifootball.com',
    path: `/api/v3/?action=get_teams&league_id=302&APIkey=${apiKey}&${teamName}`,
    method: 'GET',
  };

  const reqAPI = https.request(options, (resAPI) => {
    let data = '';

    resAPI.on('data', (chunk) => {
      data += chunk;
    });

    resAPI.on('end', () => {
      const result = JSON.parse(data);

      const teamName = result[0].team_name;
      const teamBadge = result[0].team_badge;

      const players = result[0].players;

      let htmlResponse = `<h1>Equipe de Futebol :)</h1>`;
      htmlResponse += `<h2>${teamName}</h2>`;
      htmlResponse += `<img src="${teamBadge}" alt="${teamName} Badge" width="200" height="200">`;
      htmlResponse += `<h3>JOGADORES:</h3>`;
      htmlResponse += `<ol>`;
      let playerCount = 1;
      players.forEach((player) => {
        const playerName = player.player_name;
        const playerAge = player.player_age;
        htmlResponse += `<li>${playerCount}. ${playerName} (Idade: ${playerAge})</li>`;
        playerCount++;
      });
      htmlResponse += `</ol>`;
    
      const cssStyle = `<style>body { background-color: #eee; } ol { list-style-type: none; }</style>`;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(cssStyle);
      res.write(htmlResponse);
      res.end();
    });
  });

  reqAPI.on('error', (error) => {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.write('Erro ao obter informações da API');
    res.end();
  });

  reqAPI.end();
});

const port = 3000;
app.listen(port, () => {
  console.log(`Esta aplicação está escutando a porta ${port}`);
});