export default class Trail
{
    private trail;
    private points = [];
    private head = {x: 0, y:0};
    private color: number;
    private alpha: number;

    public constructor(scene: Phaser.Scene, color: number, alpha: number) {
        this.trail = scene.add.graphics();
        this.color = color;
        this.alpha = alpha;
    }

    public createPoints(x: number, y: number) {
        this.head.x = x;
        this.head.y = y;
        this.points.push(this.createPoint(this.head.x, this.head.y, 9.0));
    }

    public keepTrail() {
        this.trail.clear();
        if (this.points.length > 4) {
            this.trail.lineStyle(1, this.color, this.alpha);
            this.trail.beginPath();
            this.trail.lineStyle(0, this.color, this.alpha);
            this.trail.moveTo(this.points[0].x, this.points[0].y);
            for (var index = 1; index < this.points.length - 4; ++index) {
                var point = this.points[index];
                this.trail.lineStyle(this.linearInterpolation(index / (this.points.length - 4), 0, 20), this.color, Math.min(this.alpha, 0.5));
                this.trail.lineTo(point.x, point.y);
            }
            var count = 0;
            for (var index = this.points.length - 4; index < this.points.length; ++index) {
                var point = this.points[index];
                this.trail.lineStyle(this.linearInterpolation(count++ / 4, 20, 0), this.color, this.alpha);
                this.trail.lineTo(point.x, point.y);
            }
            this.trail.strokePath();
            this.trail.closePath();
        }
        for (var index = 0; index < this.points.length; ++index) {
            var point = this.points[index];
    
            point.time -= 0.5;
            if (point.time <= 0) {
                this.points.splice(index, 1);
                index -= 1;
            }
        }
    }

    stopTrail() {
        this.points = [];
    }

    linearInterpolation = function (norm: number, min: number, max: number) {
        return (max - min) * norm + min;
    };

    createPoint(x: number, y: number, time: number) {
        return {x, y, time};
    }
}