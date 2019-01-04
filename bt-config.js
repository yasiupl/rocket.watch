module.exports = {
    production: {
        build: {
            files: {
                'static/css/style.min.css': ['source/css/style.scss']
            },
            watch: false
        }
    }
};