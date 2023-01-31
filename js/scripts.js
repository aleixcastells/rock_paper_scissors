const PLAYERS = []
const PLAYER_COLOURS = ['rgb(255, 230, 0)', 'rgb(255, 77, 0)', 'rgb(245, 103, 181)', 'rgb(0, 236, 63)', 'rgb(11, 209, 173)', 'rgb(11, 100, 209)', 'rgb(236, 0, 110)', 'rgb(232, 44, 44)', 'rgb(126, 227, 48)']
const SCOREBOARD = []
var rounds_amount = 0
var current_round = 1

var current_round_weapons = []

class Player {
    constructor(player_number) {
        this.number = player_number;
        this.weapon = ''
        this.colour = selectColor(player_number);
        this.points = 0;
    }
}

document.body.style.backgroundColor = "black";

function btnClick(button_info, number_info = '!') {

    scoreboardUpdate()

    switch (button_info) {

        case 'players':
            if (PLAYERS.length != 0) { return }
            for (let i = 0; i < number_info; i++) { createPlayers(i + 1) }
            flipScreenVisibility('rounds_screen', 'players_screen')
            break;

        case 'rounds':
            if (rounds_amount != 0) { return }
            rounds_amount = number_info
            document.getElementById('player_name').innerText = 'Player ' + PLAYERS[current_round_weapons.length].number
            document.body.style.backgroundColor = PLAYERS[current_round_weapons.length].colour

            flipScreenVisibility('selection_screen', 'rounds_screen')
            break;

        case 'rock':
        case 'paper':
        case 'scissors':

            document.getElementById('player_name').innerText = 'Player ' + (PLAYERS[current_round_weapons.length].number + 1)

            if (current_round_weapons.length >= PLAYERS.length) { return }
            if (current_round_weapons.length >= PLAYERS.length - 1) {
                flipScreenVisibility('go_screen', 'selection_screen')
                document.body.style.backgroundColor = "black";
            }

            PLAYERS[current_round_weapons.length].weapon = button_info
            current_round_weapons.push(button_info)

            if (current_round == rounds_amount) { screenShowHide('next_round', 'hide') }
            if (current_round_weapons.length != PLAYERS.length) { document.body.style.backgroundColor = PLAYERS[current_round_weapons.length].colour }
            break;
    }
}

function createPlayers(player_number) {

    let player = new Player(player_number)
    PLAYERS.push(player)
}

function findWinner(player1, player2) {

    switch (player1) {
        case 'rock':
            if (player1 == player2) { return 0 }
            if (player2 == 'paper') { return -1 }
            if (player2 == 'scissors') { return 1 }
            break;
        case 'paper':
            if (player1 == player2) { return 0 }
            if (player2 == 'scissors') { return -1 }
            if (player2 == 'rock') { return 1 }
            break;
        case 'scissors':
            if (player1 == player2) { return 0 }
            if (player2 == 'rock') { return -1 }
            if (player2 == 'paper') { return 1 }
            break;
    }
}

function showWinners() {

    let highest = Math.max(...SCOREBOARD)
    let scoreboard = ''
    let winner_list = ''

    for (let i = 0; i < PLAYERS.length; i++) {
        if (PLAYERS[i].points == highest) {
            winner_list += '<span class=\"player' + PLAYERS[i].number + '\"> Player ' + PLAYERS[i].number + '</span><br>'
        }
    }
    for (let i = 0; i < PLAYERS.length; i++) {
        scoreboard += 'Player ' + PLAYERS[i].number + ' (' + PLAYERS[i].weapon + ') ' + PLAYERS[i].points + '\n'
    }

    document.getElementById('scoreboard').innerText = scoreboard
    document.getElementById('winner_list').innerHTML = winner_list
}

function scoreboardUpdate() {

    for (let i = 0; i < PLAYERS.length; i++) {
        SCOREBOARD[i] = PLAYERS[i].points
    }
}

function screenShowHide(screen, action) {
    if (action == 'hide') { document.getElementById(screen).classList.replace('show', 'hide') }
    if (action == 'show') { document.getElementById(screen).classList.replace('hide', 'show') }
}

function flipScreenVisibility(show, hide) {
    screenShowHide(show, 'show')
    screenShowHide(hide, 'hide')
}

function selectColor(player_number) {
    return PLAYER_COLOURS[player_number - 1]
}

function randomPick() {
    console.log('still have to code this')
    btnClick('paper')
}

function replay() {

    while (PLAYERS.length > 0) { PLAYERS.shift() }
    while (current_round_weapons.length > 0) { current_round_weapons.shift() }
    rounds_amount = 0
    current_round = 1
    document.getElementById('player_name').innerText = 'Player 1'
    flipScreenVisibility('players_screen', 'results_screen')
    screenShowHide('next_round', 'show')
}

function nextRound() {

    if (rounds_amount <= current_round) { return }
    current_round++
    for (let i = 0; i < PLAYERS.length; i++) {
        PLAYERS[i].weapon = ''
    }
    while (current_round_weapons.length > 0) { current_round_weapons.shift() }

    flipScreenVisibility('selection_screen', 'results_screen')
    document.getElementById('player_name').innerText = 'Player 1'
    document.body.style.backgroundColor = PLAYERS[current_round_weapons.length].colour
}

function goBtn() {

    for (let i = 0; i < PLAYERS.length; i++) {
        for (let j = 0; j < PLAYERS.length; j++) {
            if (i != j) {
                PLAYERS[i].points += findWinner(PLAYERS[i].weapon, PLAYERS[j].weapon)
            }
        }
    }
    flipScreenVisibility('results_screen', 'go_screen')
    scoreboardUpdate()
    showWinners()
}