'use strict';

import Game from './astraloids/game';
import MainState from './astraloids/game_states/main_state';

let game = new Game();
game.run(new MainState(game));
