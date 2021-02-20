module.exports = {
    content: ['./views/**/*.hbs', './public/images/**/*.svg', './public/js/**/*.js'],
    extractors: [
      {
        extractor: class TailwindExtractor {
          static extract (content) {
            return content.match(/[A-Za-z0-9-_:/]+/g) || []
          }
        },
      },
    ],
  }