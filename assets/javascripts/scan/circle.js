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
        r: undefined,
        dim: 20,
        $form: undefined
    },
    methods: {
        draw: function () {
            if (this.r < 0) return;

            let x = 0;
            let y = this.r;
            let d = 3 - 2 * y;

            this.resetPlane();

            while (x <= y) {
                this.plane[this.dim - y][x] = 1;
                console.log(d, x, y);
                if (d < 0) {
                    d = d + 4 * x + 6;
                } else {
                    d = d + 4 * (x - y) + 10;
                    y--;
                }
                x++;
            }

            $htmlBody.animate({
                scrollTop: $("#" + (this.r + 1)).offset().top
            }, 500);
        },
        cellClicked: function (row) {
            this.r = row;
            this.draw();
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