const GAME = {
    players: [],
    total_rounds: 0,
    current_round: 1,
    selected_weapons: 0,
    round_score: [],
    scoreboard: []
}

class Player {
    constructor(player_number) {
        this.number = player_number,
            this.weapon = '',
            this.colour = '',
            this.points = 0
    }
}

function showScreen(screen_name = 'select_players_screen') {
    const VISIBLE_SCREEN = document.getElementsByClassName('screen-visible')
    VISIBLE_SCREEN[0].classList.replace('screen-visible', 'screen-hidden')
    document.getElementById(screen_name).classList.replace('screen-hidden', 'screen-visible')
}

function screenManager(button, number) {
    console.log(button, number)
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
            if (GAME.selected_weapons == GAME.players.length) {
                showScreen('go_screen')
            }
            break;
    }
}

function nextRound() {
    GAME.scoreboard = []
    GAME.round_score = []
    GAME.current_round += 1
    GAME.selected_weapons = 0
    showScreen('select_weapon_screen')
}
function replay() {
    GAME.players = []
    GAME.scoreboard = []
    GAME.round_score = []
    GAME.total_rounds = 0
    GAME.current_round = 1
    GAME.selected_weapons = 0
    GAME.players.forEach(function (player) { player.weapon = '' })
    showScreen('select_weapon_screen')
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
                case 'rock': addPoints(i, player, 'scissors')
                    break;
                case 'paper': addPoints(i, player, 'rock')
                    break;
                case 'scissors': addPoints(i, player, 'paper')
                    break;
            }
        }
        GAME.scoreboard[player.number - 1] = player.points
    })

    for (let i = 0; i < GAME.players.length; i++) {
        GAME.players[i].points += GAME.round_score[i]
    }
}

function addPoints(i, player, vs_weapon) {

    if (GAME.players[i].weapon == vs_weapon) { GAME.round_score[player.number - 1] = 1 }
    else { GAME.round_score[player.number - 1] = 0 }
}

function showWinner() {
    let scoreboard_string = ''
    let winners_string = ''
    let highest = Math.max(...GAME.scoreboard)

    GAME.players.forEach(function (player) {
        scoreboard_string += `Player ${player.number}: (${player.points}) ${player.weapon} <br>`
        if (player.points == highest) {
            winners_string += `<span id=\"winner${player.number}">Player ${player.number}</span><br>`
        }
    })

    document.getElementById('winner-names').innerHTML = winners_string
    document.getElementById('scoreboard').innerHTML = scoreboard_string
}

function hideNextRound() {
    if (GAME.current_round == GAME.total_rounds) { return true }
    else { return false }
}

function randomWeapon() {
    screenManager('select_weapon', 'rock')
}