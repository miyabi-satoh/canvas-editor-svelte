import hexRgb from 'hex-rgb';

/**
 * Layerの種別を表す定数
 * @date 2023/1/10 - 23:16:59
 *
 * @type {{ None: 0; Line: 1; Rectangle: 2; Ellipse: 3; Polygon: 4; Text: 5; Image: 6; }}
 */
export const LayerTypeEnum = {
	None: 0,
	Line: 1,
	Rectangle: 2,
	Ellipse: 3,
	Polygon: 4,
	Text: 5,
	Image: 6
} as const;

/**
 * Layerの種別を表す型
 * @date 2023/1/10 - 23:18:16
 *
 * @export
 * @typedef {LayerType}
 */
export type LayerType = typeof LayerTypeEnum[keyof typeof LayerTypeEnum];

/**
 * Layerの基底クラス
 * @date 2023/1/10 - 23:18:55
 *
 * @export
 * @class Layer
 * @typedef {Layer}
 */
export abstract class Layer {
	id: number;
	name: string;
	type: LayerType = LayerTypeEnum.None;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	abstract render(ctx: CanvasRenderingContext2D): void;
}

/**
 * LineとShadowを持つLayerクラス
 * @date 2023/1/11 - 23:48:38
 *
 * @export
 * @class Shape
 * @typedef {Shape}
 * @extends {Layer}
 */
export abstract class Shape extends Layer {
	lineColor = '#000000';
	lineAlpha = 100;
	lineWidth = 0;
	shadowColor = '#000000';
	shadowAlpha = 100;
	shadowBlur = 0;
	shadowOffsetX = 0;
	shadowOffsetY = 0;

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

	applyShape(ctx: CanvasRenderingContext2D): void {
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

/**
 * 閉じたパスを持つLayerクラス
 * @date 2023/1/11 - 23:51:07
 *
 * @export
 * @class ClosePath
 * @typedef {ClosePath}
 * @extends {Shape}
 */
abstract class ClosePath extends Shape {
	pt: Array<{ x: number; y: number }> = [];

	applyPath(ctx: CanvasRenderingContext2D): void {
		if (this.pt.length >= 2) {
			ctx.beginPath();
			const p = this.pt[0];
			ctx.moveTo(p.x, p.y);
			this.pt.slice(1).forEach((p) => {
				ctx.lineTo(p.x, p.y);
			});
			ctx.closePath();
		}
	}
}

/**
 * 直線を表現するLayerクラス
 * @date 2023/1/12 - 11:13:07
 *
 * @export
 * @class Line
 * @typedef {Line}
 * @extends {ClosePath}
 */
export class Line extends ClosePath {
	constructor(id: number, name: string) {
		super(id, name);
		this.type = LayerTypeEnum.Line;
		this.lineWidth = 1;
		this.pt = [
			{ x: 0, y: 0 },
			{ x: 0, y: 0 }
		];
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.pt.length != 2) {
			throw new Error(`pt length ${this.pt.length}`);
		} else {
			this.applyShape(ctx);
			this.applyPath(ctx);
			ctx.stroke();
		}
	}
}

/**
 * 塗りつぶし可能なLayerクラス
 * @date 2023/1/10 - 23:22:44
 *
 * @export
 * @class Shape2D
 * @typedef {Shape2D}
 * @extends {ClosePath}
 */
export abstract class Shape2D extends ClosePath {
	bgColor = '#ffffff';
	bgAlpha = 100;

	get fillStyle(): string {
		return hexRgb(this.bgColor, {
			format: 'css',
			alpha: this.bgAlpha / 100
		});
	}

	applyFill(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.fillStyle;
	}
}

/**
 * 円・楕円を表現するLayerクラス
 * @date 2023/1/12 - 11:11:43
 *
 * @export
 * @class Ellipse
 * @typedef {Ellipse}
 * @extends {Shape2D}
 */
export class Ellipse extends Shape2D {
	rotation = 0;
	startAngle = 0;
	endAngle = 360;
	moveToCenter = 1;

	constructor(id: number, name: string) {
		super(id, name);
		this.type = LayerTypeEnum.Ellipse;
		this.pt = [
			{ x: 0, y: 0 },
			{ x: 0, y: 0 }
		];
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

	get radiusX(): number {
		return this.pt[1].x;
	}
	set radiusX(value: number) {
		this.pt[1].x = value;
	}

	get radiusY(): number {
		return this.pt[1].y;
	}
	set radiusY(value: number) {
		this.pt[1].y = value;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.radiusX <= 0 || this.radiusY <= 0) {
			console.log('x', this.x);
			console.log('y', this.y);
			console.log('rx', this.radiusX);
			console.log('ry', this.radiusY);
		} else {
			this.applyShape(ctx);
			this.applyFill(ctx);

			ctx.beginPath();
			if (this.moveToCenter) {
				ctx.moveTo(this.x, this.y);
			}
			ctx.ellipse(
				this.x,
				this.y,
				this.radiusX,
				this.radiusY,
				(-1 * this.rotation * Math.PI) / 180,
				(-1 * this.startAngle * Math.PI) / 180,
				(-1 * this.endAngle * Math.PI) / 180,
				true
			);
			ctx.closePath();
			if (this.bgAlpha > 0) {
				ctx.fill();
			}
			if (this.lineWidth > 0) {
				ctx.stroke();
			}
		}
	}
}

/**
 * 四角形を描画するクラス
 * @date 2023/1/10 - 23:25:36
 *
 * @export
 * @class Rectangle
 * @typedef {Rectangle}
 * @extends {Shape2D}
 */
export class Rectangle extends Shape2D {
	constructor(id: number, name: string) {
		super(id, name);
		this.type = LayerTypeEnum.Rectangle;
		this.pt = [
			{ x: 0, y: 0 },
			{ x: 0, y: 0 }
		];
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
			this.applyShape(ctx);
			this.applyFill(ctx);
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.strokeRect(this.x, this.y, this.width, this.height);
		}
	}
}
