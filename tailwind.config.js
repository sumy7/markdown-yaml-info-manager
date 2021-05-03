module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    options: {
      safelist: [/^bg-/, /^text-/]
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled']
    }
  },
  plugins: []
}
