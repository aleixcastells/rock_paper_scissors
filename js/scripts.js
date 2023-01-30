const PLAYERS = []
const SCOREBOARD = []
var rounds_amount = 0
var current_round = 1

var current_round_weapons = []

class Player {
    constructor(number) {
        this.number = number;
        this.weapon = ''
        this.colour = selectColor(number);
        this.points = 0;
    }
}

document.body.style.backgroundColor = "black";

function btnClick(button_info, number_info = '!') {

    scoreboardUpdate()

    switch (button_info) {

        case 'players':

            if (PLAYERS.length != 0) { return }
            for (let i = 0; i < number_info; i++) {
                createPlayers(i + 1)
            }
            screenManager('players_screen', 'hide')
            screenManager('rounds_screen', 'show')
            break;

        case 'rounds':

            if (rounds_amount != 0) { return }
            rounds_amount = number_info
            screenManager('rounds_screen', 'hide')
            screenManager('selection_screen', 'show')
            document.getElementById('player_name').innerText = 'Player ' + PLAYERS[current_round_weapons.length].number
            document.body.style.backgroundColor = PLAYERS[current_round_weapons.length].colour
            break;

        case 'rock':
        case 'paper':
        case 'scissors':
        case 'random':

            document.getElementById('player_name').innerText = 'Player ' + (PLAYERS[current_round_weapons.length].number + 1)

            if (current_round_weapons.length >= PLAYERS.length) { return }

            if (current_round_weapons.length >= PLAYERS.length - 1) {
                screenManager('selection_screen', 'hide')
                document.body.style.backgroundColor = "black";
                screenManager('go_screen', 'show')

            }
            if (button_info == 'random') {
                PLAYERS[current_round_weapons.length].weapon = 'paper'
                current_round_weapons.push(button_info)
            }
            else {
                PLAYERS[current_round_weapons.length].weapon = button_info
                current_round_weapons.push(button_info)
            }
            if (current_round == rounds_amount) {
                screenManager('next_round', 'hide')
            }
            if (current_round_weapons.length != PLAYERS.length) {
                document.body.style.backgroundColor = PLAYERS[current_round_weapons.length].colour
            }

            break;

        case 'go':

            for (let i = 0; i < PLAYERS.length; i++) {
                for (let j = 0; j < PLAYERS.length; j++) {
                    if (i != j) {
                        PLAYERS[i].points += findWinner(PLAYERS[i].weapon, PLAYERS[j].weapon)
                    }
                }
            }
            screenManager('results_screen', 'show')
            screenManager('go_screen', 'hide')
            scoreboardUpdate()
            showWinners()
            break;

        case 'replay':

            while (PLAYERS.length > 0) { PLAYERS.shift() }
            while (current_round_weapons.length > 0) { current_round_weapons.shift() }
            rounds_amount = 0
            current_round = 1
            document.getElementById('player_name').innerText = 'Player 1'
            screenManager('players_screen', 'show')
            screenManager('results_screen', 'hide')
            break;

        case 'next_round':

            if (rounds_amount <= current_round) { return }
            current_round++
            for (let i = 0; i < PLAYERS.length; i++) {
                PLAYERS[i].weapon = ''
            }
            while (current_round_weapons.length > 0) { current_round_weapons.shift() }
            screenManager('selection_screen', 'show')
            screenManager('results_screen', 'hide')
            document.getElementById('player_name').innerText = 'Player 1'
            document.body.style.backgroundColor = PLAYERS[current_round_weapons.length].colour
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

function scoreboardUpdate() {

    for (let i = 0; i < PLAYERS.length; i++) {
        SCOREBOARD[i] = PLAYERS[i].points
    }
}

function screenManager(screen, action) {

    if (action == 'hide') {
        document.getElementById(screen).classList.replace('show', 'hide')
    }
    if (action == 'show') {
        document.getElementById(screen).classList.replace('hide', 'show')
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

function selectColor(n) {
    switch (n) {
        case 0: return
        case 1: return 'rgb(255, 230, 0)'
        case 2: return 'rgb(255, 77, 0)'
        case 3: return 'rgb(245, 103, 181)'
        case 4: return 'rgb(0, 236, 63)'
        case 5: return 'rgb(11, 209, 173)'
        case 6: return 'rgb(11, 100, 209)'
        case 7: return 'rgb(236, 0, 110)'
        case 8: return 'rgb(232, 44, 44)'
        case 9: return 'rgb(126, 227, 48)'
    }
}