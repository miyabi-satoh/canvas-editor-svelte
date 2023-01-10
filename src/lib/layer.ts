import hexRgb from 'hex-rgb';

export const LayerTypeEnum = {
	None: 0,
	Line: 1,
	Rectangle: 2,
	Ellipse: 3,
	Polygon: 4,
	Text: 5,
	Image: 6
} as const;

export type LayerType = typeof LayerTypeEnum[keyof typeof LayerTypeEnum];

export class Layer {
	id: number;
	name: string;
	type: LayerType = LayerTypeEnum.None;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(ctx: CanvasRenderingContext2D): void {
		throw new Error('not implemented');
	}
}

export class Shape extends Layer {
	lineColor = '#000000';
	lineAlpha = 100;
	lineWidth = 0;
	shadowColor = '#000000';
	shadowAlpha = 100;
	shadowBlur = 0;
	shadowOffsetX = 0;
	shadowOffsetY = 0;
	pt: Array<{ x: number; y: number }> = [];

	constructor(id: number, name: string) {
		super(id, name);
	}

	get strokeStyle(): string {
		return hexRgb(this.lineColor, {
			format: 'css',
			alpha: this.lineAlpha / 100
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
		if (this.shadowBlur || this.shadowOffsetX || this.shadowOffsetY) {
			ctx.shadowColor = this.shadowColorCSS;
			ctx.shadowBlur = this.shadowBlur;
			ctx.shadowOffsetX = this.shadowOffsetX;
			ctx.shadowOffsetY = this.shadowOffsetY;
		}
	}
}

export class Line extends Shape {
	constructor(id: number, name: string) {
		super(id, name);
		this.type = LayerTypeEnum.Line;
		this.pt = [
			{ x: 0, y: 0 },
			{ x: 0, y: 0 }
		];
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.pt.length != 2) {
			throw new Error(`pt.length == ${this.pt.length}`);
		}
		const p1 = this.pt[0];
		const p2 = this.pt[1];
		if (p1.x - p2.x == 0 || p1.y == p2.y) {
			console.log('p1', p1);
			console.log('p2', p2);
		} else {
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.closePath();

			super.render(ctx);
			ctx.stroke();
		}
	}
}

export class Rectangle extends Shape {
	bgColor = '#ffffff';
	bgAlpha = 100;

	constructor(id: number, name: string) {
		super(id, name);
		this.type = LayerTypeEnum.Rectangle;
		this.pt = [
			{ x: 0, y: 0 },
			{ x: 0, y: 0 }
		];
	}

	get fillStyle(): string {
		return hexRgb(this.bgColor, {
			format: 'css',
			alpha: this.bgAlpha / 100
		});
	}

	get x(): number {
		return this.pt[0].x;
	}
	set x(value: number) {
		this.pt[0].x = value;
	}

	get y(): number {
		return this.pt[0].y;
	}
	set y(value: number) {
		this.pt[0].y = value;
	}

	get width(): number {
		return this.pt[1].x - this.pt[0].x;
	}
	set width(value: number) {
		this.pt[1].x = this.pt[0].x + value;
	}

	get height(): number {
		return this.pt[1].y - this.pt[0].y;
	}
	set height(value: number) {
		this.pt[1].y = this.pt[0].y + value;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.pt.length != 2) {
			throw new Error(`pt.length == ${this.pt.length}`);
		}
		if (this.width <= 0 || this.height <= 0) {
			console.log('x', this.x);
			console.log('y', this.y);
			console.log('w', this.width);
			console.log('h', this.height);
		} else {
			super.render(ctx);
			ctx.fillStyle = this.fillStyle;

			ctx.fillRect(this.x, this.y, this.width, this.height);
			if (this.lineWidth > 0) {
				ctx.strokeRect(this.x, this.y, this.width, this.height);
			}
		}
	}
}
