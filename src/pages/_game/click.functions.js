import { yesorno } from './helper.functions';


export function onClickPlayerInNight(_process, player_id, killing) {
    switch(_process) {
        case 0: //狼人設定
            const playerLeft = this.game.playerLeft.map(e => {
                if (e.id == player_id) e.isWolf = !e.isWolf; return e;
            });
            const playerRight = this.game.playerRight.map(e => {
                if (e.id == player_id) e.isWolf = !e.isWolf; return e;
            });
            this.update({playerLeft, playerRight});

            if (this._wolfTimer) {
                window.clearTimeout(this._wolfTimer);
            }

            if (playerLeft.filter(e => e.isWolf).length + playerRight.filter(e => e.isWolf).length === this.game.wolfNum) {
                this._wolfTimer = window.setTimeout(() => {
                    this.startNightRound(1);
                }, this.smallGap);
            }

            break;
        case 1: //狼人殺人
            if (killing) {

                this.smallTip(`狼人擊殺玩家[ ${player_id} ], 狼人請閉眼`, '2-2').then(() => {
                    this.startNightRound(2);
                });

            } else {
                let playerLeft = mapKilling(this.game.playerLeft, player_id);
                let playerRight = mapKilling(this.game.playerRight, player_id);
                this.update({playerLeft, playerRight, bannedSaying: -1});
            }

        break;
        case 2: //女巫

            let isClickSelf = false;

            if (this.game.hero[2].player == -1) {
                return this.pickRole(player_id, 2);
            } else {
                const player = this.getPlayer(this.game.hero[2].player);

                if (player.killed || (!this.game.witchesHealth && !this.game.witchesPoison)) {
                    return this.smallTip(`女巫請閉眼`, '4').then(() => {
                        this.startNightRound(3);
                    });
                }

                isClickSelf = player_id === player.id;
            }

            if (this.game.witchesHealth) {
                if (killing) {
                    // const health = window.confirm('要救他嗎?');
                    if (this.game.round > 1 && isClickSelf) {
                        this.update({
                            witchesHealth: false,
                        });
                        return this.smallTip(`第二晚之後不能自救`);
                    }
                    const health = yesorno(()=>{
                        let playerLeft = mapKilling(this.game.playerLeft, -1);
                        let playerRight = mapKilling(this.game.playerRight, -1);


                        this.smallTip(`女巫請閉眼`, '4').then(() => {
                            this.startNightRound(3);
                        });

                        this.update({
                            witchesHealth: false,
                            playerLeft,
                            playerRight,
                        });
                    });

                    return;
                }
            }

            if (this.game.witchesPoison && !isClickSelf) {

                const poison = yesorno(()=>{
                    let playerLeft = mapKilling(this.game.playerLeft, player_id, true);
                    let playerRight = mapKilling(this.game.playerRight, player_id, true);

                    this.smallTip(`女巫請閉眼`, '4').then(() => {
                        this.startNightRound(3);
                    });

                    this.update({
                        witchesPoison: false,
                        witchesPoisonTarget: player_id,
                        playerLeft,
                        playerRight,
                    });
                },() => {
                    // this.smallTip(`女巫請閉眼`, '4').then(() => {
                    //     this.startNightRound(3);
                    // });
                });

                return;
            }

            if (isClickSelf) {
                this.smallTip(`女巫請閉眼`, '4').then(() => {
                    this.startNightRound(3);
                });
            }

        break;
        case 3: //預言家

            if (this.game.hero[1].player == -1) {
                return this.pickRole(player_id, 1);
            } else {
                const player = this.getPlayer(this.game.hero[1].player);
                if (player.killed) {
                    return this.smallTip('預言家請閉眼', '6').then(() => {
                        this.startNightRound(4);
                    });
                } else if (player_id == player.id) {
                    return this.smallTip('預言家不能驗自己');
                }
            }
            const $this = this;
            const showToSeer = function(ele) {
                if (ele.id == player_id) {
                    const tip = ele.isWolf
                        ? $this.smallTip('<div class="alert-wolf"></div>')
                        : $this.smallTip('<div class="alert-good"></div>')

                    tip.then(() => {
                        return $this.smallTip('預言家請閉眼', '6').then(() => {
                            $this.startNightRound(4);
                        });
                    });
                }
            }

            this.game.playerLeft.map(showToSeer);
            this.game.playerRight.map(showToSeer);


        break;
        case 4: //守衛

            if (this.game.hero[4].player == -1) {
                return this.pickRole(player_id, 4);
            } else {
                const player = this.getPlayer(this.game.hero[4].player);
                if (player.killed) {
                    return this.smallTip('守衛請閉眼', '8').then(() => {
                        this.startNightRound(5);
                    });
                }
            }

            if (player_id != this.game.lastTimeGuard) {
                const guard = function(ele) {
                    ele.guarded = ele.id == player_id && !ele.killed;
                    return ele;
                }
                let playerLeft = this.game.playerLeft.map(guard);
                let playerRight = this.game.playerRight.map(guard);

                this.update({
                    playerLeft,
                    playerRight,
                });

                this._guardTimer && window.clearTimeout(this._guardTimer);
                this._guardTimer = window.setTimeout(() => {
                    this.update({
                        lastTimeGuard: player_id,
                    });
                    this.smallTip('守衛請閉眼', '8').then(() => {
                        this.startNightRound(5);
                    });
                }, this.smallGap);
            } else {
                this.smallTip('不能兩夜同守一人');
            }

        break;
        case 5: //禁言長老
            if (this.game.hero[5].player == -1) {
                return this.pickRole(player_id, 5);
            } else {
                const player = this.getPlayer(this.game.hero[5].player);
                if (player.killed) {
                    return this.smallTip('禁言長老請閉眼', '8').then(() => {
                        this.startNightRound(6);
                    });
                }
            }

            const banned = yesorno(()=>{
                this.smallTip(`禁言長老請閉眼`, '10').then(() => {
                    this.startNightRound(6);
                });
                this.update({
                    bannedSaying: player_id,
                });
            },() => {
                this.smallTip(`禁言長老請閉眼`, '10').then(() => {
                    this.startNightRound(6);
                });
            });

        break;
        case 6: //騎士
            if (this.game.hero[6].player == -1) {
                if (!this.pickRole(player_id, 6)) {
                    return;
                }
            }

            this.smallTip('騎士請閉眼', '12').then(() => {
                this.startNightRound(7);
            });
        break;
        case 7: //獵人
            if (this.game.hero[3].player == -1) {
                if (!this.pickRole(player_id, 3)) {
                    return;
                }
            }

            this.smallTip('獵人請閉眼', '14').then(() => {
                this.startNightRound(8);
            });
        break;
        case 8: //白癡
            if (this.game.hero[7].player == -1) {
                if (!this.pickRole(player_id, 7)) {
                    return;
                }
            }

            this.smallTip('白癡請閉眼', '16').then(() => {
                this.startNightRound(99);
            });
        break;
        default:
            window.alert('Error process on remote.');
    };
    return this;
}


export function onClickPlayerInDay(process, player_id, killing) {

    if (killing) {
        const yes = window.confirm(`確定讓 [ ${player_id} ] 號玩家死亡嗎?`);
        if (yes) {
            // 白癡
            if (this.game.hero[7] && this.game.hero[7].player == player_id) {
                const dyes = window.confirm('該玩家是白癡 確定讓他死亡嗎?');
                if (!dyes) return;
            }

            this.killPeople(1).then((isOver) => {

            });
        }
    } else {
        let playerLeft = mapKilling(this.game.playerLeft, player_id);
        let playerRight = mapKilling(this.game.playerRight, player_id);
        this.update({playerLeft, playerRight});
    }
}


export function onClickGoToNight() {
    if (this.checkResult()) return;
    return this.smallTip('天黑請閉眼', 'close').then(() => {
        this.startNightRound(1);
    });

}

export function clearKilling() {
    let playerLeft = mapKilling(this.game.playerLeft, -1);
    let playerRight = mapKilling(this.game.playerRight, -1);

    this.update({
        playerLeft,
        playerRight,
    });
}



function mapKilling(ary, id, keepKilling = false) {
    return ary.map(e => {
        if (e.killed) return e;
        const killing = (e.killing && keepKilling) ? true : e.id == id;
        e.killing = killing;
        e.classword = killing ? 'killing' : 'none';
        return e;
    });
}
