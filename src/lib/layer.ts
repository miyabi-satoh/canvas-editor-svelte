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

export function newLayer(
	type: LayerType,
	id: number,
	name: string,
	width: number,
	height: number
): Layer {
	if (type == LayerTypeEnum.Text) {
		return new TextData(id, name, width, height);
	} else if (type == LayerTypeEnum.Line) {
		return new Line(id, name, width, height);
	} else if (type == LayerTypeEnum.Ellipse) {
		return new Ellipse(id, name, width, height);
	} else if (type == LayerTypeEnum.Polygon) {
		return new Polygon(id, name, width, height);
	} else if (type == LayerTypeEnum.Image) {
		return new ImageData(id, name, width, height);
	} else if (type == LayerTypeEnum.Rectangle) {
		return new Rectangle(id, name, width, height);
	}
	throw new Error(`newLayer: ${type} is unknown type`);
}

/**
 * レイヤーオプションのインターフェース
 * @date 2023/1/15 - 17:32:00
 *
 * @interface ILayerOption
 * @typedef {ILayerOption}
 */
interface ILayerOption {
	apply: (ctx: CanvasRenderingContext2D) => void;
}

/**
 * stroke系関数に影響するオプション
 * @date 2023/1/15 - 17:29:35
 *
 * @class StrokeOption
 * @typedef {StrokeOption}
 */
class StrokeOption implements ILayerOption {
	color = '#000000';
	alpha = 100;
	width = 0;

	apply(ctx: CanvasRenderingContext2D): void {
		ctx.lineWidth = this.width;
		ctx.strokeStyle = hexRgb(this.color, {
			format: 'css',
			alpha: this.alpha / 100
		});
	}
}

/**
 * Description placeholder
 * @date 2023/1/15 - 17:32:00
 *
 * @interface IStrokeOption
 * @typedef {IStrokeOption}
 */
interface IStrokeOption {
	strokeOption: StrokeOption;
}

/**
 * shadowを適用するオプション
 * @date 2023/1/15 - 17:30:06
 *
 * @class ShadowOption
 * @typedef {ShadowOption}
 */
class ShadowOption implements ILayerOption {
	color = '#000000';
	alpha = 100;
	blur = 0;
	offsetX = 0;
	offsetY = 0;

	apply(ctx: CanvasRenderingContext2D): void {
		if (this.blur || this.offsetX || this.offsetY) {
			ctx.shadowColor = hexRgb(this.color, {
				format: 'css',
				alpha: this.alpha / 100
			});
			ctx.shadowBlur = this.blur;
			ctx.shadowOffsetX = this.offsetX;
			ctx.shadowOffsetY = this.offsetY;
		}
	}
}
interface IShadowOption {
	shadowOption: ShadowOption;
}

class FillOption implements ILayerOption {
	color = '#ffffff';
	alpha = 100;

	apply(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = hexRgb(this.color, {
			format: 'css',
			alpha: this.alpha / 100
		});
	}
}
interface IFillOption {
	fillOption: FillOption;
}

class Paths implements ILayerOption {
	pt: Array<{ x: number; y: number }> = [];

	constructor() {
		this.count = 2;
	}

	get count(): number {
		return this.pt.length;
	}
	set count(value: number) {
		if (this.count > value) {
			this.pt = this.pt.slice(0, value);
		} else {
			for (let i = this.count; i < value; i++) {
				this.pt.push({ x: 0, y: 0 });
			}
		}
	}

	apply(ctx: CanvasRenderingContext2D): void {
		if (this.count >= 2) {
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

interface IPaths {
	paths: Paths;
}

class Rect implements ILayerOption {
	x = 0;
	y = 0;
	width = 0;
	height = 0;
	apply(ctx: CanvasRenderingContext2D): void {
		ctx.rect(this.x, this.y, this.width, this.height);
	}
}
interface IRect {
	rect: Rect;
}

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
	strokeOption?: StrokeOption | undefined;
	shadowOption?: ShadowOption | undefined;
	fillOption?: FillOption | undefined;
	paths?: Paths | undefined;
	rect?: Rect | undefined;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}

	abstract render(ctx: CanvasRenderingContext2D): void;
}

export class TextData extends Layer implements IShadowOption, IStrokeOption, IFillOption {
	shadowOption = new ShadowOption();
	strokeOption = new StrokeOption();
	fillOption = new FillOption();
	isItalic = false;
	weight = 400;
	size = 10;
	family = 'sans-serif';
	align: CanvasTextAlign = 'start';
	baseline: CanvasTextBaseline = 'alphabetic';
	text = '';
	x = 0;
	y = 0;
	maxWidth = 0;

	constructor(id: number, name: string, width: number, height: number) {
		super(id, name);
		this.fillOption.color = '#000000';
		this.size = Math.floor(Math.max(width / 10, height / 10, 16));
		this.x = Math.floor(width / 2);
		this.y = Math.floor(height / 2);
		this.maxWidth = width;
		this.align = 'center';
		this.baseline = 'middle';
	}

	get font(): string {
		return `${this.isItalic ? 'italic ' : ''}${this.weight} ${this.size}px ${this.family}`;
	}

	render(ctx: CanvasRenderingContext2D) {
		if (this.text.length > 0) {
			this.shadowOption.apply(ctx);

			ctx.font = this.font;
			ctx.textAlign = this.align;
			ctx.textBaseline = this.baseline;

			if (this.fillOption.alpha > 0) {
				this.fillOption.apply(ctx);
				if (this.maxWidth > 0) {
					ctx.fillText(this.text, this.x, this.y, this.maxWidth);
				} else {
					ctx.fillText(this.text, this.x, this.y);
				}
			}

			if (this.strokeOption.width > 0) {
				this.strokeOption.apply(ctx);
				if (this.maxWidth > 0) {
					ctx.strokeText(this.text, this.x, this.y, this.maxWidth);
				} else {
					ctx.strokeText(this.text, this.x, this.y);
				}
			}
		}
	}
}

/**
 * 画像を描画するレイヤー
 * @date 2023/1/15 - 17:34:17
 *
 * @export
 * @class ImageData
 * @typedef {ImageData}
 * @extends {Layer}
 * @implements {IStrokeOption}
 * @implements {IShadowOption}
 * @implements {IRect}
 */
export class ImageData extends Layer implements IStrokeOption, IShadowOption, IRect {
	strokeOption = new StrokeOption();
	shadowOption = new ShadowOption();
	rect = new Rect();
	fileName = '';
	elImage = new Image();
	fixedRatio = true;

	constructor(id: number, name: string, width: number, height: number) {
		super(id, name);
		this.type = LayerTypeEnum.Image;
		this.rect.width = width;
		this.rect.height = height;
	}

	render(ctx: CanvasRenderingContext2D): void {
		this.shadowOption.apply(ctx);

		ctx.drawImage(this.elImage, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
		if (this.strokeOption.width > 0) {
			this.strokeOption.apply(ctx);
			ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
		}
	}
}

/**
 * 直線を描画するレイヤー
 * @date 2023/1/15 - 17:34:47
 *
 * @export
 * @class Line
 * @typedef {Line}
 * @extends {Layer}
 * @implements {IStrokeOption}
 * @implements {IShadowOption}
 * @implements {IPaths}
 */
export class Line extends Layer implements IStrokeOption, IShadowOption, IPaths {
	strokeOption = new StrokeOption();
	shadowOption = new ShadowOption();
	paths = new Paths();
	constructor(id: number, name: string, width: number, height: number) {
		super(id, name);
		this.paths.pt[1] = { x: width, y: height };
		this.type = LayerTypeEnum.Line;
		this.strokeOption.width = 1;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.paths.count != 2) {
			throw new Error(`paths.count = ${this.paths.count}`);
		} else {
			this.strokeOption.apply(ctx);
			this.shadowOption.apply(ctx);
			this.paths.apply(ctx);
			ctx.stroke();
		}
	}
}

/**
 * 円や楕円を描画するレイヤー
 * @date 2023/1/15 - 17:35:13
 *
 * @export
 * @class Ellipse
 * @typedef {Ellipse}
 * @extends {Layer}
 * @implements {IStrokeOption}
 * @implements {IShadowOption}
 * @implements {IFillOption}
 */
export class Ellipse extends Layer implements IStrokeOption, IShadowOption, IFillOption {
	strokeOption = new StrokeOption();
	shadowOption = new ShadowOption();
	fillOption = new FillOption();
	rotation = 0;
	startAngle = 0;
	endAngle = 360;
	moveToCenter = 1;
	x: number;
	y: number;
	radiusX: number;
	radiusY: number;

	constructor(id: number, name: string, width: number, height: number) {
		super(id, name);
		this.type = LayerTypeEnum.Ellipse;
		this.x = Math.floor(width / 2);
		this.y = Math.floor(height / 2);
		this.radiusX = width - this.x;
		this.radiusY = height - this.y;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.radiusX <= 0 || this.radiusY <= 0) {
			// console.log('x', this.x);
			// console.log('y', this.y);
			// console.log('rx', this.radiusX);
			// console.log('ry', this.radiusY);
		} else {
			this.shadowOption.apply(ctx);

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

			if (this.fillOption.alpha > 0) {
				this.fillOption.apply(ctx);
				ctx.fill();
			}
			if (this.strokeOption.width > 0) {
				this.strokeOption.apply(ctx);
				ctx.stroke();
			}
		}
	}
}

/**
 * 多角形を描画するレイヤー
 * @date 2023/1/15 - 17:35:36
 *
 * @export
 * @class Polygon
 * @typedef {Polygon}
 * @extends {Layer}
 * @implements {IStrokeOption}
 * @implements {IShadowOption}
 * @implements {IFillOption}
 * @implements {IPaths}
 */
export class Polygon extends Layer implements IStrokeOption, IShadowOption, IFillOption, IPaths {
	strokeOption = new StrokeOption();
	shadowOption = new ShadowOption();
	fillOption = new FillOption();
	paths = new Paths();

	constructor(id: number, name: string, width: number, height: number) {
		super(id, name);
		this.type = LayerTypeEnum.Polygon;
		this.paths.count = 3;
		this.paths.pt[0].x = Math.floor(width / 2);
		this.paths.pt[1].y = height;
		this.paths.pt[2] = { x: width, y: height };
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.paths.count < 3) {
			throw new Error(`paths.count = ${this.paths.count}`);
		}

		this.shadowOption.apply(ctx);
		this.paths.apply(ctx);
		if (this.fillOption.alpha > 0) {
			this.fillOption.apply(ctx);
			ctx.fill();
		}
		if (this.strokeOption.width > 0) {
			this.strokeOption.apply(ctx);
			ctx.stroke();
		}
	}
}

/**
 * 四角形を描画するレイヤー
 * @date 2023/1/15 - 17:35:54
 *
 * @export
 * @class Rectangle
 * @typedef {Rectangle}
 * @extends {Layer}
 * @implements {IStrokeOption}
 * @implements {IShadowOption}
 * @implements {IFillOption}
 * @implements {IRect}
 */
export class Rectangle extends Layer implements IStrokeOption, IShadowOption, IFillOption, IRect {
	strokeOption = new StrokeOption();
	shadowOption = new ShadowOption();
	fillOption = new FillOption();
	rect = new Rect();
	constructor(id: number, name: string, width: number, height: number) {
		super(id, name);
		this.type = LayerTypeEnum.Rectangle;
		this.rect.width = width;
		this.rect.height = height;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.rect.width * this.rect.height > 0) {
			this.shadowOption.apply(ctx);

			if (this.fillOption.alpha > 0) {
				this.fillOption.apply(ctx);
				ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
			}
			if (this.strokeOption.width > 0) {
				this.strokeOption.apply(ctx);
				ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
			}
		}
	}
}
