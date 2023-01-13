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

	constructor(id: number, name: string, width: number, height: number) {
		super(id, name);
		this.numOfVertices = 2;
		this.pt[1] = { x: width, y: height };
	}

	get numOfVertices(): number {
		return this.pt.length;
	}
	set numOfVertices(value: number) {
		if (this.pt.length > value) {
			this.pt = this.pt.slice(0, value);
		} else {
			for (let i = this.pt.length; i < value; i++) {
				this.pt.push({ x: 0, y: 0 });
			}
		}
	}

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
	constructor(id: number, name: string, width: number, height: number) {
		super(id, name, width, height);
		this.type = LayerTypeEnum.Line;
		this.lineWidth = 1;
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

export abstract class Rect extends ClosePath {
	get x(): number {
		return this.pt[0].x;
	}
	set x(value: number) {
		const width = this.width;
		this.pt[0].x = value;
		this.pt[1].x = value + width;
	}

	get y(): number {
		return this.pt[0].y;
	}
	set y(value: number) {
		const height = this.height;
		this.pt[0].y = value;
		this.pt[1].y = value + height;
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
}

export class Image extends Rect {
	image: HTMLImageElement;

	constructor(id: number, name: string, width: number, height: number) {
		super(id, name, width, height);
		this.type = LayerTypeEnum.Image;
		this.image = document.createElement('img');
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.pt.length != 2) {
			throw new Error(`pt length ${this.pt.length}`);
		} else {
			this.applyShape(ctx);
			this.applyPath(ctx);
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
			ctx.stroke();
		}
	}
}

/**
 * 塗りつぶし可能なLayerクラス
 * @date 2023/1/10 - 23:22:44
 *
 * @export
 * @class Fillable
 * @typedef {Fillable}
 * @extends {Rect}
 */
export abstract class Fillable extends Rect {
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
 * @extends {Fillable}
 */
export class Ellipse extends Fillable {
	rotation = 0;
	startAngle = 0;
	endAngle = 360;
	moveToCenter = 1;

	constructor(id: number, name: string, width: number, height: number) {
		super(id, name, width, height);
		this.type = LayerTypeEnum.Ellipse;
		this.x = Math.floor(width / 2);
		this.y = Math.floor(height / 2);
		this.radiusX = width - this.x;
		this.radiusY = height - this.y;
	}

	get radiusX(): number {
		return this.width;
	}
	set radiusX(value: number) {
		this.width = value;
	}

	get radiusY(): number {
		return this.height;
	}
	set radiusY(value: number) {
		this.height = value;
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
 * 多角形を表現するLayerクラス
 * @date 2023/1/12 - 23:12:22
 *
 * @export
 * @class Polygon
 * @typedef {Polygon}
 * @extends {Fillable}
 */
export class Polygon extends Fillable {
	constructor(id: number, name: string, width: number, height: number) {
		super(id, name, width, height);
		this.type = LayerTypeEnum.Polygon;
		this.numOfVertices = 3;
		this.pt[0].x = Math.floor(width / 2);
		this.pt[1].y = height;
		this.pt[2].x = width;
		this.pt[2].y = height;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.pt.length < 3) {
			throw new Error(`pt.length == ${this.pt.length}`);
		}
		this.applyShape(ctx);
		this.applyFill(ctx);
		this.applyPath(ctx);
		if (this.bgAlpha > 0) {
			ctx.fill();
		}
		if (this.lineWidth > 0) {
			ctx.stroke();
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
 * @extends {Polygon}
 */
export class Rectangle extends Polygon {
	constructor(id: number, name: string, width: number, height: number) {
		super(id, name, width, height);
		this.type = LayerTypeEnum.Rectangle;
		this.numOfVertices = 4;
		this.left = 0;
		this.top = 0;
		this.right = width;
		this.bottom = height;
	}

	get left(): number {
		return this.pt[0].x;
	}
	set left(value: number) {
		this.pt[0].x = this.pt[1].x = value;
	}

	get top(): number {
		return this.pt[0].y;
	}
	set top(value: number) {
		this.pt[0].y = this.pt[3].y = value;
	}

	get right(): number {
		return this.pt[2].x;
	}
	set right(value: number) {
		this.pt[2].x = this.pt[3].x = value;
	}

	get bottom(): number {
		return this.pt[2].y;
	}
	set bottom(value: number) {
		this.pt[1].y = this.pt[2].y = value;
	}
}
