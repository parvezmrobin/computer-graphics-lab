import Vue from "vue";

let $form, $htmlBody;
$(document).ready(function () {
    $form = $('.needs-validation');
    $htmlBody = $('html, body');
});

new Vue({
    el: '#vm',
    data: {
        plane: [[]],
        x1: undefined,
        y1: undefined,
        x2: undefined,
        y2: undefined,
        dim: 20,
        $form: undefined
    },
    methods: {
        showErrorAlert: function () {

        },
        draw: function () {
            const dx = this.x2 - this.x1;
            const dy = this.y2 - this.y1;
            const d2 = 2 * dy;
            const d1 = d2 - 2 * dx;
            let d = d2 - dx;
            let x = this.x1, y = this.y1;

            this.resetPlane();
            if (dy / dx < 0) this.showErrorAlert();

            this.plane[this.dim - y][x] = 1;
            if (!dy) return;

            while (!(x === this.x2 && y === this.y2)) {
                if (d < 0) {
                    d += d2;
                }
                else {
                    y++;
                    d += d1;
                }

                x++;
                this.plane[this.dim - y][x] = 1;
            }

            $htmlBody.animate({
                scrollTop: $("#" + (this.y2 + 1)).offset().top
            }, 500);
        },
        cellClicked: function (row) {
            // this.r = row;
            // this.draw();
        },
        resetPlane: function () {
            this.plane = [];
            for (let i = 0; i <= this.dim; i++)
                this.plane.push(new Array(this.dim + 1).fill(0));
        },
        focused: function (e) {
            $form.addClass('was-validated');
            e.currentTarget.select();
        },
        blurred: function () {
            $form.removeClass('was-validated');
        }
    },
    created() {
        this.resetPlane();
    }
});