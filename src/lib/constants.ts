import { LayerTypeEnum, type LayerType } from './layer';

export const types: Array<{ value: LayerType; name: string }> = [
	{ value: LayerTypeEnum.Line, name: '直線' },
	{ value: LayerTypeEnum.Rectangle, name: '矩形' },
	{ value: LayerTypeEnum.Ellipse, name: '円・楕円' },
	{ value: LayerTypeEnum.Polygon, name: '多角形' },
	{ value: LayerTypeEnum.Text, name: '文字' },
	{ value: LayerTypeEnum.Image, name: '画像' }
];

interface FontFamilyOption {
	value: string;
	name: string;
	href?: string;
}
export const families: Array<FontFamilyOption> = [
	{ name: 'arial', value: 'arial' },
	{ name: 'arial black', value: '"arial black"' },
	{ name: 'arial narrow', value: '"arial narrow"' },
	{ name: 'arial unicode ms', value: '"arial unicode ms"' },
	{ name: 'Comic Sans MS', value: '"Comic Sans MS"' },
	{ name: 'Courier', value: 'Courier' },
	{ name: 'Courier New', value: '"Courier New"' },
	{ name: 'fantasy', value: 'fantasy' },
	{ name: 'Georgia', value: 'Georgia' },
	{ name: 'Impact', value: 'Impact' },
	{ name: 'Meiryo UI', value: '"Meiryo UI"' },
	{ name: 'Microsoft Sans Serif', value: '"Microsoft Sans Serif"' },
	{ name: 'MS UI Gothic', value: '"MS UI Gothic"' },
	{ name: 'monospace', value: 'monospace' },
	{ name: 'Osaka', value: 'Osaka' },
	{ name: 'Osaka－等幅', value: '"Osaka－等幅","Osaka-Mono"' },
	{ name: 'sans-serif', value: 'sans-serif' },
	{ name: 'serif', value: 'serif' },
	{ name: 'Tahoma', value: 'Tahoma' },
	{ name: 'Times New Roman', value: '"Times New Roman"' },
	{ name: 'Verdana', value: 'Verdana' },
	{ name: 'ＭＳ Ｐゴシック', value: '"ＭＳ Ｐゴシック","MS PGothic"' },
	{ name: 'ＭＳ ゴシック', value: '"ＭＳ ゴシック","MS Gothic"' },
	{ name: 'ＭＳ Ｐ明朝', value: '"ＭＳ Ｐ明朝","MS PMincho"' },
	{ name: 'ＭＳ 明朝', value: '"ＭＳ 明朝","MS Mincho"' },
	{
		name: 'ヒラギノ角ゴ Pro W3',
		value: '"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro"'
	},
	{
		name: 'ヒラギノ角ゴ ProN W3',
		value: '"ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN"'
	},
	{
		name: 'ヒラギノ角ゴ Pro W6',
		value: '"ヒラギノ角ゴ Pro W6","HiraKakuPro-W6"'
	},
	{
		name: 'ヒラギノ角ゴ ProN W6',
		value: '"ヒラギノ角ゴ ProN W6","HiraKakuProN-W6"'
	},
	{
		name: 'ヒラギノ角ゴ Std W8',
		value: '"ヒラギノ角ゴ Std W8","Hiragino Kaku Gothic Std"'
	},
	{
		name: 'ヒラギノ角ゴ StdN W8',
		value: '"ヒラギノ角ゴ StdN W8","Hiragino Kaku Gothic StdN"'
	},
	{
		name: 'ヒラギノ丸ゴ Pro W4',
		value: '"ヒラギノ丸ゴ Pro W4","Hiragino Maru Gothic Pro"'
	},
	{
		name: 'ヒラギノ丸ゴ ProN W4',
		value: '"ヒラギノ丸ゴ ProN W4","Hiragino Maru Gothic ProN"'
	},
	{
		name: 'ヒラギノ明朝 Pro W3',
		value: '"ヒラギノ明朝 Pro W3","Hiragino Mincho Pro"'
	},
	{
		name: 'ヒラギノ明朝 ProN W3',
		value: '"ヒラギノ明朝 ProN W3","Hiragino Mincho ProN"'
	},
	{
		name: 'ヒラギノ明朝 Pro W6',
		value: '"ヒラギノ明朝 Pro W6","HiraMinPro-W6"'
	},
	{
		name: 'ヒラギノ明朝 ProN W6',
		value: '"ヒラギノ明朝 ProN W6","HiraMinProN-W6"'
	},
	{ name: 'メイリオ', value: '"メイリオ",Meiryo' },
	{
		name: '游ゴシック',
		value: '"游ゴシック","Yu Gothic","游ゴシック体",YuGothic'
	},
	{ name: '游明朝', value: '"游明朝","Yu Mincho","游明朝体",YuMincho' },
	{
		name: 'M PLUS 1p(Google Fonts)',
		value: '"M PLUS 1p"',
		href: 'https://fonts.googleapis.com/css?family=M+PLUS+1p'
	},
	{
		name: 'M PLUS Rounded 1c(Google Fonts)',
		value: '"M PLUS Rounded 1c"',
		href: 'https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c'
	},
	{
		name: 'はんなり明朝(Google Fonts)',
		value: 'Hannari',
		href: 'https://fonts.googleapis.com/earlyaccess/hannari.css'
	},
	{
		name: 'こころ明朝(Google Fonts)',
		value: 'Kokoro',
		href: 'https://fonts.googleapis.com/earlyaccess/kokoro.css'
	},
	{
		name: 'さわらび明朝(Google Fonts)',
		value: '"Sawarabi Mincho"',
		href: 'https://fonts.googleapis.com/css?family=Sawarabi+Mincho'
	},
	{
		name: 'さわらびゴシック(Google Fonts)',
		value: '"Sawarabi Gothic"',
		href: 'https://fonts.googleapis.com/css?family=Sawarabi+Gothic'
	},
	{
		name: 'ニクキュウ(Google Fonts)',
		value: 'Nikukyu',
		href: 'https://fonts.googleapis.com/earlyaccess/nikukyu.css'
	},
	{
		name: 'ニコモジ(Google Fonts)',
		value: '"Nico Moji"',
		href: 'https://fonts.googleapis.com/earlyaccess/nicomoji.css'
	},
	{
		name: 'Noto Sans JP(Google Fonts)',
		value: '"Noto Sans JP"',
		href: 'https://fonts.googleapis.com/css?family=Noto+Sans+JP'
	}
];

export const textAligns: Array<{ value: CanvasTextAlign; name: string }> = [
	{ value: 'left', name: 'left' },
	{ value: 'center', name: 'center' },
	{ value: 'right', name: 'right' },
	{ value: 'start', name: 'start' },
	{ value: 'end', name: 'end' }
];

export const textBaselines: Array<{ value: CanvasTextBaseline; name: string }> = [
	{ value: 'top', name: 'top' },
	{ value: 'middle', name: 'middle' },
	{ value: 'bottom', name: 'bottom' },
	{ value: 'alphabetic', name: 'alphabetic' },
	{ value: 'hanging', name: 'hanging' },
	{ value: 'ideographic', name: 'ideographic' }
];
