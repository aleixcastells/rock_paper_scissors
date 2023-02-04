const GAME = {
    players: [],
    total_rounds: 0,
    current_round: 1,
    selected_weapons: 0,
    scoreboard: [],
    player_colours: ['rgb(255, 77, 0)', 'rgb(221 194 0)', 'rgb(245, 103, 181)', 'rgb(0, 236, 63)', 'rgb(11, 209, 173)', 'rgb(11, 100, 209)', 'rgb(236, 0, 110)', 'rgb(232, 44, 44)', 'rgb(126, 227, 48)'],
}

class Player {
    constructor(player_number) {
        this.number = player_number,
            this.weapon = '',
            this.colour = GAME.player_colours[player_number - 1],
            this.points = [0, 0]
    }
}

function showScreen(screen_name = 'select_players_screen') {

    const VISIBLE_SCREEN = document.getElementsByClassName('screen-visible')
    VISIBLE_SCREEN[0].classList.replace('screen-visible', 'screen-hidden')

    document.getElementById(screen_name).classList.replace('screen-hidden', 'screen-visible')
}

function screenManager(button, number) {

    console.log(button)

    if (button == 'rounds_amount' || button == 'select_weapon' || button == 'next_round') {
        //    updateWeaponScreen()



    }

    switch (button) {

        case 'players_amount':

            createPlayers(number)
            showScreen('select_rounds_screen')
            break

        case 'rounds_amount':

            GAME.total_rounds = number
            showScreen('select_weapon_screen')
            break;

        case 'select_weapon':


            selectWeapon(number)
            if (GAME.selected_weapons == GAME.players.length) { showScreen('go_screen') }
            break;
    }
}

function nextRound(next_round) {

    screenManager('next_round', 0)

    GAME.current_round += 1
    GAME.selected_weapons = 0
    GAME.players.forEach(function (player) {
        player.weapon = ''
    })
    showScreen('select_weapon_screen')
}
function replay() {
    GAME.players = []
    GAME.scoreboard = []
    GAME.total_rounds = 0
    GAME.current_round = 1
    GAME.selected_weapons = 0
    GAME.players.forEach(function (player) {
        player.weapon = ''
        player.points = [0, 0]
    })
    showScreen()
}

function createPlayers(player_amount) {
    for (let i = 0; i < player_amount; i++) {
        let player = new Player(i + 1)
        GAME.players.push(player)
    }
}

function selectWeapon(clicked_weapon) {
    GAME.players[GAME.selected_weapons].weapon = clicked_weapon
    GAME.selected_weapons++
}

function goBtn() {
    GAME.selected_weapons = 0

    calculateWinner()
    showScreen('results_screen')
    if (hideNextRound()) {
        document.getElementById('next_round_id').classList.replace('screen-visible', 'screen-hidden')
    }
    showWinner()
}

function calculateWinner() {

    GAME.players.forEach(function (player) {
        for (let i = 0; i < GAME.players.length; i++) {

            switch (player.weapon) {
                case 'rock':
                    player.points[1] += addPoints(i, player, 'scissors')
                    break;
                case 'paper':
                    player.points[1] += addPoints(i, player, 'rock')
                    break;
                case 'scissors':
                    player.points[1] += addPoints(i, player, 'paper')
                    break;
            }
        }

        GAME.scoreboard[player.number - 1] = player.points[1]

    })
}

function addPoints(i, player, loosing_weapon) {

    if (GAME.players.length <= 3) {
        if (GAME.players[i].weapon == loosing_weapon && player.points[0] != GAME.current_round) {
            player.points[0] = GAME.current_round
            return 1
        }
        else { return 0 }
    }
    if (GAME.players.length > 3) {
        if (GAME.players[i].weapon == loosing_weapon) { // && player.points[0] != GAME.current_round
            player.points[1] += 1
            return 1
        }
        else { return 0 }
    }


}

function showWinner() {
    let scoreboard_string = ''
    let winners_string = ''
    let highest = Math.max(...GAME.scoreboard)

    GAME.players.forEach(function (player) {
        scoreboard_string += `Player ${player.number}: (${player.points[1]}) ${player.weapon} <br>`
        if (player.points[1] == highest) {
            winners_string += `<span id=\"winner${player.number}" class="winner" style="color: ${player.colour}">Player ${player.number}</span><br>`
        }
    })

    document.getElementById('winner-names').innerHTML = winners_string
    document.getElementById('scoreboard').innerHTML = scoreboard_string
}

function hideNextRound() {
    if (GAME.current_round == GAME.total_rounds) { return true }
    else { return false }
}





function setPlayerName() {
}








function randomWeapon() {
    screenManager('select_weapon', 'rock')
}



/*
function updateWeaponScreen() {

    if (GAME.round_clicks == GAME.players.length) {
        document.body.style.setProperty('background-color', 'black', 'important');
        GAME.round_clicks = 0
    }
    else {
        let player_colour = `${GAME.players[GAME.round_clicks].colour}`
        document.body.style.setProperty('background-color', player_colour, 'important')
    }
}

*/



/*
- Single player mode
- Random selection
- Maybe custom names?
- Player colour functionality
- Result page design
*/