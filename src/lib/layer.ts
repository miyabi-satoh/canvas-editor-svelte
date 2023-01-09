import hexRgb from 'hex-rgb';

export const LayerType = {
	Line: 1,
	Rectangle: 2,
	Ellipse: 3,
	Polygon: 4,
	Text: 5,
	Image: 6
} as const;

type LayerType = typeof LayerType[keyof typeof LayerType];

export class Layer {
	id: number;
	name: string;
	type: LayerType;
	x: number;
	y: number;
	width: number;
	height: number;
	bgColor: string;
	bgAlpha: number;
	lineColor: string;
	lineAlpha: number;
	lineWidth: number;
	shadowColor: string;
	shadowAlpha: number;
	shadowBlur: number;
	shadowOffsetX: number;
	shadowOffsetY: number;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
		this.type = LayerType.Rectangle;
		this.bgColor = '#ffffff';
		this.bgAlpha = 100;
		this.lineColor = '#000000';
		this.lineAlpha = 100;
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.lineWidth = 0;
		this.shadowColor = '#000000';
		this.shadowAlpha = 100;
		this.shadowBlur = 0;
		this.shadowOffsetX = 0;
		this.shadowOffsetY = 0;
	}

	get strokeStyle(): string {
		return hexRgb(this.lineColor, {
			format: 'css',
			alpha: this.lineAlpha / 100
		});
	}

	get fillStyle(): string {
		return hexRgb(this.bgColor, {
			format: 'css',
			alpha: this.bgAlpha / 100
		});
	}

	get shadowColorCSS(): string {
		return hexRgb(this.shadowColor, {
			format: 'css',
			alpha: this.shadowAlpha / 100
		});
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = this.strokeStyle;
		ctx.fillStyle = this.fillStyle;
		if (this.shadowBlur || this.shadowOffsetX || this.shadowOffsetY) {
			ctx.shadowColor = this.shadowColorCSS;
			ctx.shadowBlur = this.shadowBlur;
			ctx.shadowOffsetX = this.shadowOffsetX;
			ctx.shadowOffsetY = this.shadowOffsetY;
		}

		ctx.fillRect(this.x, this.y, this.width, this.height);
		if (this.lineWidth > 0) {
			ctx.strokeRect(this.x, this.y, this.width, this.height);
		}
	}
}
