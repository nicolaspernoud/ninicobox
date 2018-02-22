const fs = require('fs');
const path = require('path');
const replaceStream = require('replacestream');

const translationsArray = fs.readFileSync('./translations.csv', 'utf-8').split('\n');
const translationsObject = [];
for (let line of translationsArray) {
    line = line.split[';'];
    translationsObject[line[0]] = line[1];
}

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 *
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir
 * @param {Function} done
 */
function filewalker(dir, done) {
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
                    // Add directory to array [comment if you need to remove the directories from the array]
                    // results.push(file);

                    filewalker(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    // Translate the file
                    // Replace all the instances of 'birthday' with 'earthday'
                    fs.createReadStream(file)
                        .pipe(replaceStream('const', 'foobar'))
                        .pipe(process.stdout);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

filewalker("./dist", function (err, data) {
    if (err) {
        throw err;
    }
    console.log(data);
});