# SeniorDesignProject

when going prod:

    build dist file for web html
        npx expo export 
        copy to /var/www/html
    put psql api in 
        copy API folder to /var/www/api
    put genAI api in
        TODO
    changes in /API/index.js:
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server Listening on http://0.0.0.0:${PORT}`)
        });

