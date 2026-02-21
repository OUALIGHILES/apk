/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#263254',
        secondary: '#D1F6F3',
        accent: '#F2994A',
        button: '#04a431',
        green: '#04a431',
        red: '#F15353',
        orange: '#F2994A',
        yellow: '#f9d109',
        darkgrey: '#000000',
        lightgrey: '#d9d8d8',
        verylightgrey: '#EEEEEE',
        grey: '#595959',
        greyunselect: '#9C9C9C',
        screenback: '#EEEEEE',
        editback: '#F5F4F4',
        facebook: '#185091',
        detailback: '#D4E9F2',
        blue: '#BAE9EF',
        pink: '#F8D1DE',
        verylightgreen: '#EFFAEB',
        cartbg: '#F3F3F3',
        tabback: '#EDECEC',
        layitembg: '#EBF0F2',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
}
