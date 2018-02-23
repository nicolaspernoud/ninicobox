const fs = require('fs');
const path = require('path');

const translationsFile = fs.readFileSync('./translations.csv', 'utf-8').split('\n');
const translationsArray = [];
for (let line of translationsFile) {
    const lineArray = line.split(';');
    translationsArray.push(
        {
            originalText: lineArray[0],
            translatedText: lineArray[1]
        }
    );
}

function translateFiles(dir, done) {
    let results = [];

    fs.readdir(dir, function (err, list) {
        if (err) return done(err);

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function (file) {
            file = path.resolve(dir, file);

            fs.stat(file, function (err, stat) {
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    translateFiles(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    // Translate the file
                    if (/.*main.*bundle.js/.test(file)) {
                        let fileContent = fs.readFileSync(file, 'utf-8');
                        for (let line of translationsArray) {
                            fileContent = fileContent.replace(`"${line.originalText}"`, `"${line.translatedText}"`);
                            fileContent = fileContent.replace(`'${line.originalText}'`, `'${line.translatedText}'`);
                        }
                        fs.writeFile(file, fileContent, 'utf-8', (err) => {
                            if (err) throw err;
                            console.log(file + ' has been saved !');
                        });
                    }
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

translateFiles("./client/dist", function (err, data) {
    if (err) {
        throw err;
    }
});