export interface Theme {
	color: any
	text: any
}

const themelight: Theme = {
	color: {
		white: '#ffffff',
		black: '#000000',
		transparent: 'transparent',
		btn_primary: '#246bfd',
		btn_primary_hover: '#1f5ad3',
		btn_orange: '#FF7043',
		btn_orange_hover: '#DD6139',
		btn_gray: '#616161',
		btn_gray_hover: '#313131',
		btn_gray02: '#38434D',
		btn_gray02_hover: '#293139',
		white_smoke: '#F5F5F5',
		gray01: '#F6F6F6',
		//for disable
		gray02: '#cccccc',
	},
	text: {
		base01: '#000000',
		base02: '#161616',
		base03: '#0A0A0A',
		gray01: '#00000099',
		gray02: '#16161666',
		white01: '#ffffff',
		white02: '#FFFFFF99',
		primary01: '#246BFD',
		orange01: '#FF7043',
	},
}

export default themelight
