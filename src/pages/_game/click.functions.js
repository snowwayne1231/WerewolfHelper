export function onClickPlayerInNight(process, player_id, killing) {
    switch(process) {
        case 0: //狼人設定
            const playerLeft = this.playerLeft.map(e => {
                if (e.id == player_id) e.isWolf = !e.isWolf; return e;
            });
            const playerRight = this.playerRight.map(e => {
                if (e.id == player_id) e.isWolf = !e.isWolf; return e;
            });
            this.$setState({playerLeft, playerRight});

            if (this._wolfTimer) {
                window.clearTimeout(this._wolfTimer);
            }

            if (playerLeft.filter(e => e.isWolf).length + playerRight.filter(e => e.isWolf).length === this.setting.wolfNum) {
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
                let playerLeft = mapKilling(this.playerLeft, player_id);
                let playerRight = mapKilling(this.playerRight, player_id);
                this.$setState({playerLeft, playerRight});
            }

        break;
        case 2: //女巫

            if (this.hero[2].player == -1) {
                return this.pickRole(player_id, 2);
            } else {
                const player = this.getPlayer(this.hero[2].player);
                if (player.killed || (!this.witchesHealth && !this.witchesPoison)) {
                    return this.smallTip(`女巫請閉眼`, '4').then(() => {
                        this.startNightRound(3);
                    });
                }
            }
            
            if (this.witchesHealth) {
                if (killing) {
                    // const health = window.confirm('要救他嗎?');
                    const health = this.yesorno(()=>{
                        let playerLeft = mapKilling(this.playerLeft, -1);
                        let playerRight = mapKilling(this.playerRight, -1);


                        this.smallTip(`女巫請閉眼`, '4').then(() => {
                            this.startNightRound(3);
                        });

                        this.$setState({
                            witchesHealth: false,
                            playerLeft,
                            playerRight,
                        });
                    });

                    return;
                }
            }

            if (this.witchesPoison) {

                const poison = this.yesorno(()=>{
                    let playerLeft = mapKilling(this.playerLeft, player_id, true);
                    let playerRight = mapKilling(this.playerRight, player_id, true);

                    this.smallTip(`女巫請閉眼`, '4').then(() => {
                        this.startNightRound(3);
                    });

                    this.$setState({
                        witchesPoison: false,
                        playerLeft,
                        playerRight,
                    });
                },() => {
                    this.smallTip(`女巫請閉眼`, '4').then(() => {
                        this.startNightRound(3);
                    });
                });

                return;
            }

        break;
        case 3: //預言家

            if (this.hero[1].player == -1) {
                return this.pickRole(player_id, 1);
            } else {
                const player = this.getPlayer(this.hero[1].player);
                if (player.killed) {
                    return this.smallTip('預言家請閉眼', '6').then(() => {
                        this.startNightRound(4);
                    });
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

            this.playerLeft.map(showToSeer);
            this.playerRight.map(showToSeer);

            
        break;
        case 4: //守衛

            if (this.hero[4].player == -1) {
                return this.pickRole(player_id, 4);
            } else {
                const player = this.getPlayer(this.hero[4].player);
                if (player.killed) {
                    return this.smallTip('守衛請閉眼', '8').then(() => {
                        this.startNightRound(6);
                    });
                }
            }

            if (player_id != this.lastTimeGuard) {
                const guard = function(ele) {
                    ele.guarded = ele.id == player_id && !ele.killed;
                    return ele;
                }
                let playerLeft = this.playerLeft.map(guard);
                let playerRight = this.playerRight.map(guard);

                this.$setState({
                    playerLeft,
                    playerRight,
                });

                this._guardTimer && window.clearTimeout(this._guardTimer);
                this._guardTimer = window.setTimeout(() => {
                    this.$setState({
                        lastTimeGuard: player_id,
                    });
                    this.smallTip('守衛請閉眼', '8').then(() => {
                        this.startNightRound(6);
                    });
                }, this.smallGap);
            } else {
                this.smallTip('不能兩夜同守一人');
            }

            
        break;
        case 5: //禁言長老

        break;
        case 6: //騎士
            if (this.hero[6].player == -1) {
                if (!this.pickRole(player_id, 6)) {
                    return;
                }
            }

            this.smallTip('騎士請閉眼', '12').then(() => {
                this.startNightRound(7);
            });
        break;
        case 7: //獵人
            if (this.hero[3].player == -1) {
                if (!this.pickRole(player_id, 3)) {
                    return;
                }
            }

            this.smallTip('獵人請閉眼', '14').then(() => {
                this.startNightRound(99);
            });
        break;
        default:
        };
    return this;
}


export function onClickPlayerInDay(process, player_id, killing) {

    if (killing) {
        this.killPeople(1).then((isOver) => {
        
            // const activateFunction = window.confirm('是否啟動技能繼續殺人?');
            // if (activateFunction) {
            //     //
            // } else {
            //     // if (isOver) return isOver;
            //     const result = this.checkResult();
            //     if (!result) {
            //     return this.smallTip('天黑請閉眼', 'close').then(() => {
            //         this.startNightRound(1);
            //     });
            //     }

            // }
        });

    } else {
        let playerLeft = mapKilling(this.playerLeft, player_id);
        let playerRight = mapKilling(this.playerRight, player_id);
        this.$setState({playerLeft, playerRight});
    }
}


export function onClickGoToNight() {
    if (this.checkResult()) return;
    return this.smallTip('天黑請閉眼', 'close').then(() => {
        this.startNightRound(1);
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