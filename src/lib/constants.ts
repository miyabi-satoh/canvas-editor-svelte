import { LayerTypeEnum, type LayerType } from './layer';

export const types: Array<{ value: LayerType; name: string }> = [
	{ value: LayerTypeEnum.Line, name: '直線' },
	{ value: LayerTypeEnum.Ellipse, name: '円・楕円' },
	{ value: LayerTypeEnum.Rectangle, name: '矩形' },
	{ value: LayerTypeEnum.Polygon, name: '多角形' },
	{ value: LayerTypeEnum.Text, name: 'テキスト' },
	{ value: LayerTypeEnum.Image, name: '画像' }
];

interface FontFamilyOption {
	value: string;
	name: string;
	href?: string;
}

export const families: Array<FontFamilyOption> = [
	{ name: 'OS依存のゴシック体', value: `sans-serif` },
	{ name: 'OS依存の明朝体', value: `serif` },
	{ name: 'OS依存のUIフォント', value: `system-ui` },
	{ name: 'OS依存の等幅フォント', value: `monospace` },
	{ name: 'OS依存の筆記体', value: `cursive` },
	{ name: 'OS依存の装飾系フォント', value: `fantasy` },
	{ name: 'メイリオ', value: `'メイリオ',Meiryo` },
	{ name: '游ゴシック', value: `'游ゴシック',YuGothic,'Yu Gothic'` },
	{ name: '游明朝', value: `'游明朝','Yu Mincho Light','YuMincho','Yu Mincho'` },
	{ name: 'ＭＳ ゴシック', value: `'ＭＳ ゴシック','MS Gothic'` },
	{ name: 'ＭＳ Ｐゴシック', value: `'ＭＳ Ｐゴシック','MS PGothic'` },
	{ name: 'ＭＳ 明朝', value: `'ＭＳ 明朝','MS Mincho'` },
	{ name: 'ＭＳ Ｐ明朝', value: `'ＭＳ Ｐ明朝','MS PMincho'` },
	{ name: 'ヒラギノ角ゴ Pro', value: `'ヒラギノ角ゴ Pro','Hiragino Kaku Gothic Pro'` },
	{ name: 'ヒラギノ角ゴ ProN', value: `'ヒラギノ角ゴ ProN','Hiragino Kaku Gothic ProN'` },
	{ name: 'ヒラギノ角ゴシック', value: `'ヒラギノ角ゴシック','Hiragino Sans'` },
	{ name: 'ヒラギノ明朝 Pro', value: `'ヒラギノ明朝 Pro','Hiragino Mincho Pro'` },
	{ name: 'ヒラギノ明朝 ProN', value: `'ヒラギノ明朝 ProN','Hiragino Mincho ProN'` },
	{ name: 'Meiryo UI', value: `'Meiryo UI'` },
	{ name: 'MS UI Gothic', value: `'MS UI Gothic'` },
	{ name: 'Segoe UI', value: `'Segoe UI'` },
	{ name: 'Yu Gothic UI', value: `'Yu Gothic UI'` },
	{ name: 'Arial', value: `'Arial',sans-serif` },
	{ name: 'Arial Black', value: `'Arial Black'` },
	{ name: 'Baskerville', value: `'Baskerville'` },
	{ name: 'Bodoni MT', value: `'Bodoni MT'` },
	{ name: 'Bodoni 72', value: `'Bodoni 72'` },
	{ name: 'Bookman Old Style', value: 'Bookman Old Style' },
	{ name: 'Calisto MT', value: `'Calisto MT'` },
	{ name: 'Calibri', value: `'Calibri'` },
	{ name: 'Cambria', value: `'Cambria'` },
	{ name: 'Candara', value: `'Candara'` },
	{ name: 'Century', value: `'Century'` },
	{ name: 'Century Gothic', value: `'Century Gothic'` },
	{ name: 'Comic Sans', value: `'Comic Sans','Comic Sans MS'` },
	{ name: 'Consolas', value: `'Consolas'` },
	{ name: 'Copperplate Gothic', value: `'Copperplate','Copperplate Gothic Light'` },
	{ name: 'Courier', value: `'Courier'` },
	{ name: 'Courier New', value: `'Courier New'` },
	{ name: 'Dejavu Sans', value: `'Dejavu Sans'` },
	{ name: 'Didot', value: `'Didot','Didot LT STD'` },
	{ name: 'Franklin Gothic', value: `'Franklin Gothic'` },
	{ name: 'Garamond', value: `'Garamond'` },
	{ name: 'Geneva', value: `'Geneva'` },
	{ name: 'Georgia', value: `'Georgia'` },
	{ name: 'Gill Sans', value: `'Gill Sans','Gill Sans MT'` },
	{ name: 'Goudy Old Style', value: `'Goudy Old Style'` },
	{ name: 'Helvetica', value: `'Helvetica'` },
	{ name: 'Helvetica Neue', value: `'Helvetica Neue'` },
	{ name: 'Impact', value: `'Impact'` },
	{ name: 'Lucida Bright', value: `'Lucida Bright'` },
	{ name: 'Lucida Handwriting', value: `'Lucida Handwriting'` },
	{ name: 'Lucida Sans', value: `'Lucida Sans'` },
	{ name: 'Menlo', value: `'Menlo'` },
	{ name: 'Monaco', value: `'Monaco'` },
	{ name: 'MS Sans Serif', value: `'MS Sans Serif'` },
	{ name: 'Optima', value: `'Optima'` },
	{ name: 'Palatino', value: `'Palatino','Palatino Linotype','Palatino LT STD'` },
	{ name: 'Perpetua', value: `'Perpetua'` },
	{ name: 'Rage', value: `'Rage'` },
	{ name: 'Rockwell', value: `'Rockwell'` },
	{ name: 'Script MT', value: `'Script MT'` },
	{ name: 'Segoe script', value: `'Segoe script'` },
	{ name: 'Snell Roundhand', value: `'Snell Roundhand'` },
	{ name: 'Tahoma', value: `'Tahoma'` },
	{ name: 'Times', value: `'Times'` },
	{ name: 'Times New Roman', value: `'Times New Roman'` },
	{ name: 'Trebuchet MS', value: `'Trebuchet MS'` },
	{ name: 'Verdana', value: `'Verdana'` },
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
