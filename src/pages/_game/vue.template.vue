<template>
    <div
        class="page-content page-game"
        :class="{
            'is-night': game.isNight,
            'has-witches-health': game.witchesHealth,
            'captain-mode': game.captainMode == 1,
        }"
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
import { onClickPlayerInNight, onClickPlayerInDay, onClickGoToNight } from './click.functions';
import { newPlayers, playMp3, yesorno } from './helper.functions';

export default {
    computed: {
        ...mapState(['game']),
    },
    mounted() {
        console.log('vue game mounted', this);
        const gameData = this.game;
        const leftNum = Math.ceil(gameData.peopleNum / 2);
        const rightNum = gameData.peopleNum - leftNum;
        const hero = {};

        gameData.roles.map(role => {
          hero[role.id] = {
            name: role.name,
            player: -1,
          };
        });

        const playerLeft = newPlayers(leftNum, 1);

        const playerRight = newPlayers(rightNum, 1+leftNum);

        this.$store.dispatch('GAME_SETTING', {
          playerLeft,
          playerRight,
          hero,
        });

        this.$store.dispatch('GAME_CREATE_ROOM');
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
                next = 99;
            }

            switch (next) {
                case 0: this.smallTip('狼人請確認身分', '1').then(() => {}); break;
                case 1: this.smallTip('狼人請殺人', '2').then(() => {}); break;
                case 2: this.smallTip('女巫請睜眼', '3').then(() => {hero[2].player == -1 && playMp3('checkself')}); break;
                case 3: this.smallTip('預言家請睜眼', '5').then(() => {hero[1].player == -1 && playMp3('checkself')}); break;
                case 4: this.smallTip('守衛請睜眼', '7').then(() => {hero[4].player == -1 && playMp3('checkself')}); break;
                case 5: this.smallTip('禁言長老請睜眼', '9').then(() => {hero[5].player == -1 && playMp3('checkself')}); break;
                case 6: this.smallTip('騎士請睜眼', '11').then(() => {hero[6].player == -1 && playMp3('checkself')}); break;
                case 7: this.smallTip('獵人請睜眼', '13').then(() => {hero[3].player == -1 && playMp3('checkself')}); break;
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
        onClickPlayerInNight,
        onClickPlayerInDay,
        onClickGoToNight,
        onClickPlayer(player) {
            console.log('onClickPlayer', player);
        },
    },
}
</script>
