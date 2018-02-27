const HandlesMatrixMixin = {
    methods: {
        resetPlane: function () {
            this.plane = [];
            for (let i = 0; i <= this.dim; i++)
                this.plane.push(new Array(this.dim + 1).fill(0));
        }
    },
    created() {
        this.resetPlane();
    }
};

const HandlesQuadrantMixin = {
    methods: {
        negY: function (i) {
            return -(i - this.dim);
        },
        posY: function (i) {
            return (this.dim - i);
        },
        negX: function (j) {
            return -(this.dim - j);
        },
        posX: function (j) {
            return (j - this.dim);
        },
        resetPlane: function () {
            this.plane = [];
            for (let i = 0; i < this.lim; i++)
                this.plane.push(new Array(this.lim).fill(0));
        }
    },
    created() {
        this.lim = this.dim * 2 + 1;
        this.resetPlane();
    }
};