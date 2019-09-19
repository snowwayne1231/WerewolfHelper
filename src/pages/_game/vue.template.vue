<template>
    <div
        class="page-content page-game"
        :class="pageClass"
    >
        <div class="left-player players">
            <div
                v-for="player in game.playerLeft"
                :key="player.id"
                :class="player.classword"
                :data-id="player.id"
                :data-killing="player.killing"
                :data-killed="player.killed"
                :data-iswolf="player.isWolf"
                :data-guarded="player.guarded"
                :data-picking="player.picking"
                @click="onClickPlayer(player)"
            >{{player.id}}</div>
        </div>
        <div class="right-player players">
            <div
                v-for="player in game.playerRight"
                :key="player.id"
                :class="player.classword"
                :data-id="player.id"
                :data-killing="player.killing"
                :data-killed="player.killed"
                :data-iswolf="player.isWolf"
                :data-guarded="player.guarded"
                :data-picking="player.picking"
                @click="onClickPlayer(player)"
            >{{player.id}}</div>
        </div>

        <div id="abs-go-night" @click="onClickGoToNight">夜</div>
    </div>

</template>

<script>
import { mapState } from 'vuex';
import { onClickPlayerInNight, onClickPlayerInDay, onClickGoToNight, clearKilling } from './click.functions';
import { playMp3, yesorno } from './helper.functions';

export default {
    computed: {
        ...mapState(['game']),
        pageClass(self) {
            const classes = [`process-${self.game.process}`, `round-${self.game.round}`];
            self.game.isNight && classes.push('is-night');
            !self.game.witchesHealth && classes.push('has-witches-health-false');
            self.game.captainMode == 1 && classes.push('captain-mode');
            return classes.join(' ');
        },
        delayRound(self) {
            return self.game.round;
        },
    },
    watch: {
        delayRound(newval, oldval) {
            console.log('delayRound', newval, oldval);
            if (newval != oldval) {
                this.wakeup(false);
            }
        },
    },
    mounted() {
        console.log('vue game mounted', this);
        
    },
    methods: {
        start() {
            this.smallTip('天黑請閉眼', 'close').then(() => {

                this.startNightRound(0);
            });
        },
        startNightRound(process) {
            let next = process;
            const gameData = this.game;
            const hero = gameData.hero;

            //巫
            if (next==2 && !hero[2]) {
                next = 3;
            }

            //預
            if (next==3 && !hero[1]) {
                next = 4;
            }

            //守
            if (next==4 && !hero[4]) {
                next = 6;
            }

            if (next==5 && !hero[5]) {
                next = 6;
            }

            //騎士
            if (next==6 && (!hero[6] || hero[6].player > 0)) {
                next = 7;
            }

            //獵人
            if (next==7 && (!hero[3] || hero[3].player > 0)) {
                next = 8;
            }

            //白癡
            if (next==8 && (!hero[7] || hero[7].player > 0)) {
                next = 99;
            }

            switch (next) {
                case 0: this.smallTip('狼人請確認身分', '1').then(() => {}); break;
                case 1:
                    this.smallTip('狼人請殺人', '2').then(() => {});
                    this.clearKilling();
                break;
                case 2: this.smallTip('女巫請睜眼', '3').then(() => {hero[2].player == -1 && playMp3('checkself')}); break;
                case 3: this.smallTip('預言家請睜眼', '5').then(() => {hero[1].player == -1 && playMp3('checkself')}); break;
                case 4: this.smallTip('守衛請睜眼', '7').then(() => {hero[4].player == -1 && playMp3('checkself')}); break;
                case 5: this.smallTip('禁言長老請睜眼', '9').then(() => {hero[5].player == -1 && playMp3('checkself')}); break;
                case 6: this.smallTip('騎士請睜眼', '11').then(() => {hero[6].player == -1 && playMp3('checkself')}); break;
                case 7: this.smallTip('獵人請睜眼', '13').then(() => {hero[3].player == -1 && playMp3('checkself')}); break;
                case 8: this.smallTip('白癡請睜眼', '15').then(() => {hero[7].player == -1 && playMp3('checkself')}); break;
                case 99:
                default:
                this.wakeup();
            }

            this.update({
                process: next,
                isNight: next < 99,
            });
        },
        smallTip(text, audioKey = false, time = 0) {
            const $this = this;
            const promise = new Promise((resolve, reject) => {
                const progress = $this.f7.dialog.progress(text);

                window.setTimeout(function(){
                    progress.close();
                    resolve();
                }, time || $this.smallGap);
            });
            audioKey && playMp3(audioKey);
            return promise;
        },
        update(obj) {
            this.$store.dispatch('GAME_SETTING', obj);
        },
        clearKilling,
        onClickPlayerInNight,
        onClickPlayerInDay,
        onClickGoToNight,
        onClickPlayer(player) {
            // console.log('onClickPlayer', player);
            const id = parseInt(player.id, 10);
            const killing = !!player.killing;
            const killed = !!player.killed;

            if (this.game.isNight) {
                this.onClickPlayerInNight(this.game.process, id, killing);
            } else {
                this.onClickPlayerInDay(this.game.process, id, killing);
            }
        },
        pickRole(player_id, hero_id) {
            const isDoubleClick = this._picking_player === player_id;
            if (isDoubleClick) {

                // check this player id whether exist in wolf or hero
                if (
                    Object.values(this.game.hero).map(e => e.player).includes(player_id) ||
                    this.game.playerRight.map(p => p.isWolf ? p.id : -1).includes(player_id) ||
                    this.game.playerLeft.map(p => p.isWolf ? p.id : -1).includes(player_id)
                ) {
                    playMp3('doublerole');
                    return false;
                }

                this.game.hero[hero_id].player = player_id;
                this._picking_player = -1;
                this._picking_hero = -1;
                if (hero_id < 5 && hero_id != 3) {
                    playMp3('roleok');
                }
            } else {

                this._picking_player = player_id;
                this._picking_hero = hero_id;
            }

            const playerLeft = this.game.playerLeft.map(e => {
                e.picking = e.id == player_id && !isDoubleClick; return e;
            });
            const playerRight = this.game.playerRight.map(e => {
                e.picking = e.id == player_id && !isDoubleClick; return e;
            });

            this.update({
                playerLeft,
                playerRight,
            });

            return isDoubleClick;
        },
        getPlayer(id) {
            let q = this.game.playerLeft.find(e => e.id == id);
            if (!q) q = this.game.playerRight.find(e => e.id == id);
            return q;
        },
        killPeople: function(mode) {
            // mode 0 = 晚上, 1 = 白天
            const death = [];
            const playerLeft = this.game.playerLeft.map(kill);
            const playerRight = this.game.playerRight.map(kill);

            this.update({
                playerLeft,
                playerRight,
            });


            return death.length == 0
            ? this.smallTip(`<div style="padding:${this.wpadding()};">昨天晚上是平安夜</div>`, 'peace', this.normalGap).then(() => false)
            : this.smallTip(`<div style="padding:${this.wpadding()};">玩家 [ ${death.join(',')} ] 死亡</div>`, null, this.normalGap).then(() => {
                const result = mode == 0 ? this.checkResult(true) : null;
                if (result == null) {
                    // 獵人
                    if (this.game.hero[3] && this.game.hero[3].player && death.includes(this.game.hero[3].player)) {
                        if (this.game.witchesPoisonTarget != this.game.hero[3].player) {
                            window.alert(`玩家 [ ${this.game.hero[3].player} ] 可以發動技能`);
                        }
                    }
                }
                return result;
            });

            function kill(e) {
                e.killed = (e.killing || e.killed) && (!e.guarded || mode == 1);
                if (e.killed && e.killing) { death.push(e.id); }
                e.killing = false;
                e.guarded = false;
                if (e.killed) { e.classword = 'killed'; }
                else { e.classword = 'none'; }
                return e;
            }
        },
        checkResult: function(isWakeUp = false) {
            const allPlayer = this.game.playerLeft.concat(this.game.playerRight);
            const allAlivePlayer = allPlayer.filter(e => !e.killed);
            console.log('allPlayer []', allPlayer, allAlivePlayer);
            const wolfs = allAlivePlayer.filter(e => e.isWolf);
            const goods = allAlivePlayer.filter(e => !e.isWolf);
            let result = null;

            if (isWakeUp && wolfs.length === 0) {

                playMp3('win');
                result = '好人勝利';
            } else {

                if (this.game.gameEndingMode == 1) {
                    //屠邊
                    const hero_ids = Object.values(this.game.hero).map(e => e.player);
                    const heros = goods.filter(e => hero_ids.includes(e.id));
                    // console.log('heros', heros);
                    const normalGoods = goods.length - heros.length;
                    if (normalGoods == 0 || heros.length == 0) {
                        playMp3('lose');
                        result = '狼人勝利';
                    }
                } else {
                    //城
                    const goodsNum = this.game.witchesHealth || this.game.witchesPoison ? goods.length + 1 : goods.length;
                    if (goodsNum <= wolfs.length) {
                        playMp3('lose');
                        result = '狼人勝利';
                    }
                }

                if (wolfs.length === 0) {
                    playMp3('win');
                    result = '好人勝利';
                } else if (goods.length <= 2 && !isWakeUp){
                    playMp3('lose');
                    result = '狼人勝利';
                }
            }

            if (result) {
                // this.mp3.pause();
                const $this = this;
                // this.result = result;
                const heroPlayerMap = {};
                Object.values(this.game.hero).map(e => {
                    if (e.player > 0) {
                        heroPlayerMap[e.player] = e.name;
                    }
                });

                const templateshow = `${result}</br> ${allPlayer.map(e => {
                    let godName = heroPlayerMap[e.id];
                    let role = e.isWolf
                    ? '狼人'
                    : godName || '民';
                    return e.name + ' ' + role;
                }).join('</br>')}`;
                return this.f7.dialog.alert(templateshow, null, function(){
                    $this.router.navigate('/');
                });
            } else {

            }
            return result;
        },
        wpadding: function() {
            const law = this.game.playerLeft.filter(e => e.isWolf && !e.killed);
            const raw = this.game.playerRight.filter(e => e.isWolf && !e.killed);
            let t = 0;
            let r = 0;
            let l = 0;
            // console.log('playerLeft', law, raw);
            if (law.length == 0 || raw.length == 0) {t = 10;}
            if (law.length > raw.length) {r = 15;} else if (law.length < raw.length) {l = 15;}
            return `${t}px ${r}px 0px ${l}px`;
        },
        wakeup: function(notFromRemote = true) {
            if (window.isJoin) {
                // this.$store.dispatch('GAME_PLAY_MP3', 'FN|wakeup');
            } else {
                this.smallTip('天亮了', 'open').then(() => {
                    if (this.game.captainMode==1 && this.game.round == 1) {
                        this.smallTip('現在開始警長競選', 'captainvote').then(() => {
                            window.alert('警長競選');
                            notFromRemote && this.killPeople(0).then((isOver) => {
                                this.update({
                                    round: this.game.round +1,
                                });
                            });
                        });
                    } else {
                        notFromRemote && this.killPeople(0).then((isOver) => {
                            this.update({
                                round: this.game.round +1,
                            });
                        });
                    }
                });
            }
        },
    },
}
</script>
