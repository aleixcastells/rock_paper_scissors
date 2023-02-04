const GAME = {
    players: [],
    cpu_player: false,
    total_rounds: 0,
    current_round: 1,
    selected_weapons: 0,
    scoreboard: [],
    player_colours: ['rgb(255, 77, 0)', 'rgb(221 194 0)', 'rgb(245, 103, 181)', 'rgb(0, 236, 63)', 'rgb(11, 209, 173)', 'rgb(11, 100, 209)', 'rgb(236, 0, 110)', 'rgb(232, 44, 44)', 'rgb(126, 227, 48)'],
}

class Player {
    constructor(player_number) {
        this.number = player_number
        this.player_name = 'Player ' + String(player_number)
        this.weapon = ''
        this.colour = GAME.player_colours[player_number - 1]
        this.points = [0, 0]
    }
}

function screenManager(button, number) {
    switch (button) {

        case 'players_amount':

            if (number == 1) { createPlayers(2); GAME.cpu_player = true }
            if (number > 1) { createPlayers(number) }
            showScreen('select_rounds_screen')
            break

        case 'rounds_amount':

            GAME.total_rounds = number
            showScreen('select_weapon_screen')
            break;

        case 'select_weapon':

            if (GAME.players.length == 2 && GAME.cpu_player) {
                selectWeapon(number)
                randomWeapon()
                GAME.players[1].player_name = 'CPU'
            }
            if (GAME.cpu_player == false) { selectWeapon(number) }
            if (GAME.selected_weapons == GAME.players.length) { showScreen('go_screen') }
            break;
    }

    setPlayerName(button)
}

function showScreen(screen_name = 'select_players_screen') {

    const VISIBLE_SCREEN = document.getElementsByClassName('screen-visible')
    VISIBLE_SCREEN[0].classList.replace('screen-visible', 'screen-hidden')
    document.getElementById(screen_name).classList.replace('screen-hidden', 'screen-visible')
}

function createPlayers(player_amount) {

    for (let i = 0; i < player_amount; i++) {
        let player = new Player(i + 1)
        GAME.players.push(player)
    }
}

function selectWeapon(clicked_weapon) {

    if (GAME.selected_weapons == GAME.players.length) { return }
    GAME.players[GAME.selected_weapons].weapon = clicked_weapon
    GAME.selected_weapons++
}

function randomWeapon() {

    let random_number = Math.ceil(Math.random() * 3)
    let random_number_CPU = Math.ceil(Math.random() * 3)
    let button = random_number == 1 ? 'rock' : random_number == 2 ? 'paper' : 'scissors'
    let button_CPU = random_number_CPU == 1 ? 'rock' : random_number_CPU == 2 ? 'paper' : 'scissors'

    if (GAME.players.length == 2 && GAME.cpu_player) {
        selectWeapon(button)
        selectWeapon(button_CPU)
        GAME.players[1].player_name = 'CPU'
    }
    if (!GAME.cpu_player) {
        selectWeapon(button)
    }

    setPlayerName('select_weapon')
    if (GAME.selected_weapons == GAME.players.length) { showScreen('go_screen') }
}

function setPlayerName(button) {

    if (GAME.selected_weapons == GAME.players.length) {
        document.body.style.setProperty('background-color', 'black', 'important')
        return
    }
    if (button == 'rounds_amount' || button == 'next_round') {
        let player_colour = `${GAME.players[GAME.selected_weapons].colour}`
        document.body.style.setProperty('background-color', player_colour, 'important')
        document.getElementById('player_name').innerHTML = GAME.players[GAME.selected_weapons].player_name
    }
    if (button == 'select_weapon') {
        let player_colour = `${GAME.players[GAME.selected_weapons].colour}`
        document.body.style.setProperty('background-color', player_colour, 'important')
        document.getElementById('player_name').innerHTML = GAME.players[GAME.selected_weapons].player_name
    }
}

function goBtn() {

    GAME.selected_weapons = 0
    calculateWinner()
    showScreen('results_screen')

    if (hideNextRound()) {
        document.getElementById('next_round_id').classList.replace('screen-visible', 'screen-hidden')
    }
    if (!hideNextRound()) {
        document.getElementById('next_round_id').classList.replace('screen-hidden', 'screen-visible')
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

        if (GAME.players[i].weapon == loosing_weapon) {
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
        scoreboard_string += `${player.player_name}: (${player.points[1]}) ${player.weapon} <br>`

        if (player.points[1] == highest) {
            winners_string += `<span id=\"winner${player.number}" class="winner" style="color: ${player.colour}">${player.player_name}</span><br>`
        }
    })
    document.getElementById('winner-names').innerHTML = winners_string
    document.getElementById('scoreboard').innerHTML = scoreboard_string
}

function hideNextRound() {

    if (GAME.current_round == GAME.total_rounds) { return true }
    else { return false }
}

function nextRound() {

    screenManager('next_round', 0)
    GAME.current_round += 1
    GAME.selected_weapons = 0
    GAME.players.forEach(function (player) { player.weapon = '' })
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

/*

TO DO:
- Maybe custom names?