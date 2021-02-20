module.exports = {
  purge: {
    enabled: (process.env.NODE_ENV == 'production' ? true : false),
    content: ['./views/**/*.hbs']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
