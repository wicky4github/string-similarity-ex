/**
 * basic algorithm to compare two strings 
 * @npmjs  https://www.npmjs.com/package/string-similarity
 * @github https://github.com/aceakash/string-similarity
 * @version  2.0.0
 */
(function(window) {
    function compareTwoStrings(str1, str2) {
        if (!str1.length && !str2.length) return 1;
        if (!str1.length || !str2.length) return 0;
        if (str1.toUpperCase() === str2.toUpperCase()) return 1;
        if (str1.length === 1 && str2.length === 1) return 0;
        var pairs1 = wordLetterPairs(str1);
        var pairs2 = wordLetterPairs(str2);
        var union = pairs1.length + pairs2.length;
        var intersection = 0;
        pairs1.forEach(function(pair1) {
            for (var i = 0, pair2; pair2 = pairs2[i]; i++) {
                if (pair1 !== pair2) continue;
                intersection++;
                pairs2.splice(i, 1);
                break;
            }
        });
        return intersection * 2 / union;
    }

    function findBestMatch(mainString, targetStrings) {
        if (!areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
        var ratings = targetStrings.map(function(target) {
            return { target: target, rating: compareTwoStrings(mainString, target) };
        });
        var bestMatch = Array.from(ratings).sort(function(a, b) {
            return b.rating - a.rating;
        })[0];
        return { ratings: ratings, bestMatch: bestMatch };
    }

    function flattenDeep(arr) {
        return Array.isArray(arr) ? arr.reduce(function(a, b) {
            return a.concat(flattenDeep(b));
        }, []) : [arr];
    }

    function areArgsValid(mainString, targetStrings) {
        if (typeof mainString !== 'string') return false;
        if (!Array.isArray(targetStrings)) return false;
        if (!targetStrings.length) return false;
        if (targetStrings.find(function(s) {
                return typeof s !== 'string';
            })) return false;
        return true;
    }

    function letterPairs(str) {
        var pairs = [];
        for (var i = 0, max = str.length - 1; i < max; i++) {
            pairs[i] = str.substring(i, i + 2);
        }
        return pairs;
    }

    function wordLetterPairs(str) {
        var pairs = str.toUpperCase().split(' ').map(letterPairs);
        return flattenDeep(pairs);
    }

    window.stringSimilarity = { compareTwoStrings: compareTwoStrings, findBestMatch: findBestMatch };
})(window);

/**
 * expand algorithm to compare two strings and get the situation of the accuracy to every single word
 * @author Wicky
 */
(function(window) {
    function htmldecode(s) {
        var div = document.createElement('div');
        div.innerHTML = s;
        return div.innerText || div.textContent;
    }

    function splitSentence2Words(sentence, noLower) {
        var content = htmldecode(sentence);
        content = content.replace(/[^\w\-\'\’\s\,\.\?\!\;\"]/g, '');
        if (!noLower) {
            content = content.toLowerCase();
        }
        return content.split(/\s+/).filter(function(word) { return word; });
    }

    function clearMark(word) {
        return word.replace(/[\,\.\?\!\;\"]/g, '');
    }

    function isWordCorrect(s1, s2) {
        s1 = clearMark(s1);
        s2 = clearMark(s2);
        // regard two words as same if the percentage given by "stringSimilarity.compareTwoStrings" is greater than or equal to 80
        // changing 80 to 100 is the most strict mode.
        return stringSimilarity.compareTwoStrings(s1, s2) * 100 >= 80;
    }

    /**
     * getBestMatch
     * @param  {string} key    [correct sentence]
     * @param  {string} answer [user's sentence]
     * @return array
     */
    function getBestMatch(key, answer) {
        var arrKey = splitSentence2Words(key);
        var arrAnswer = splitSentence2Words(answer);
        var start = 0, i = 0, j = 0;
        // key -> answer (idea from Winson)
        var firstMatch = [];
        start = 0;
        for (i = 0; i < arrKey.length; i++) {
            for (j = start; j < arrAnswer.length; j++) {
                if (isWordCorrect(arrKey[i], arrAnswer[j])) {
                    start = j + 1;
                    firstMatch.push(arrKey[i]);
                    break;
                }
            }
        }
        // answer -> key (idea from Winson)
        var secondMatch = [];
        start = 0;
        for (i = 0; i < arrAnswer.length; i++) {
            for (j = start; j < arrKey.length; j++) {
                if (isWordCorrect(arrAnswer[i], arrKey[j])) {
                    start = j + 1;
                    secondMatch.push(arrAnswer[i]);
                    break;
                }
            }
        }
        var thirdMatch = [];
        var bigArr = arrKey.length >= arrAnswer.length ? arrKey : arrAnswer;
        var smallArr = arrKey.length >= arrAnswer.length ? arrAnswer : arrKey;
        for (i = 0; i < smallArr.length; i++) {
            if (isWordCorrect(smallArr[i], bigArr[i])) {
                thirdMatch.push(smallArr[i]);
            }
        }
        var bestMatch = [];
        bestMatch = firstMatch.length >= secondMatch.length ? firstMatch : secondMatch;
        bestMatch = bestMatch.length >= thirdMatch.length ? bestMatch : thirdMatch;
        return bestMatch;
    }

    /**
     * parseFaultTolerance
     * @param  {string} str [the format of the fault tolerance string]
     * @return array
     */
    function parseFaultTolerance(str) {
        // in: show:sure,saw|hello:hey
        // out: [{word: show, replaces: [sure, saw]}, {word: hello, replaces: [hey]}]
        return (str || '')
            .split('|')
            .filter(function(v) { return v; })
            .map(function(r) {
                var m = r.split(':') || [];
                var word = m[0];
                var replaces = (m[1] || '').split(',').filter(function(v) { return v; });
                return {word: word, replaces: replaces};
            })
            .filter(function(v) { return v.replaces.length; });
    }

    /**
     * getSentenceReplacements
     * @param  {string} format [the format of the fault tolerance string]
     * @return array
     */
    function getSentenceReplacements(format) {
        var arr = parseFaultTolerance(format);
        /**
         * Core algorithm to generate all possible words for replacing the correct sentence
         */
        function f(o, p) {
            var t1 = [];
            for(var i = 0; i < o.replaces.length; i++) {
                var o1 = {};
                o1[o.word] = o.replaces[i];
                t1.push(o1);
            }
            var t2 = [];
            for(var m = 0; m < p.length; m++) {
                for(var n = 0; n < t1.length; n++) {
                    var o2 = {};
                    for(var a1 in p[m]) {
                        o2[a1] = p[m][a1];
                    }
                    for(var a2 in t1[n]) {
                        o2[a2] = t1[n][a2];
                    }
                    t2.push(o2);
                }
            }
            for(var j = 0; j < p.length; j++) {
                t1.push(p[j]);
            }
            return t1.concat(t2);
        }
        var p = [];
        for(var i = arr.length - 1; i >= 0; i--) {
            p = f(arr[i], p);
        }
        // in:  show:sure,saw|hello:hey
        // out: [{show: sure}, {show: saw}, {hello: hey}, {show: sure, hello: hey}, {show: saw, hello: hey}] 
        return p;
    }

    /**
     * getSimilarSentences
     * @param  {string} sentence [user's sentence]
     * @param  {string} format   [the format of the fault tolerance string]
     * @return array
     */
    function getSimilarSentences(sentence, format) {
        return getSentenceReplacements(format).map(function(replaceObj) {
            var str = htmldecode(sentence);
            for(var attr in replaceObj) {
                str = str.replace(attr, replaceObj[attr]);
            }
            return str;
        });
    }

    /**
     * getSentenceSituation
     * @param  {string} key    [Correct sentence]
     * @param  {string} answer [User's sentence]
     * @param  {string} format [Fault tolerance]
     * @return array
     */
    function getSentenceSituation(key, answer, format) {
        var bestMatch = getBestMatch(key, answer);
        // for matching
        var arrKey = splitSentence2Words(key);
        // for showing
        var arrNoLower = splitSentence2Words(key, true);
        // update best match
        var similarSentences = getSimilarSentences(key, format);
        similarSentences.forEach(function(s) {
            var newBestMatch = getBestMatch(s, answer);
            if (newBestMatch.length > bestMatch.length) {
                bestMatch = newBestMatch;
                arrKey = splitSentence2Words(s);
            }
        });
        var situation = [];
        var start = 0;
        for (var i = 0; i < arrKey.length; i++) {
            var corrct = 0;
            var rightWord = arrKey[i];
            if (rightWord == bestMatch[start]) {
                corrct = 1;
                start++;
            }
            var word = arrNoLower[i];
            situation.push({ word: word, correct: corrct });
        }
        // [{word: 'Show', correct: 1}, {word: 'hello', correct: 0}]
        return situation;
    }

    window.stringSimilarityEx = {
        getBestMatch: getBestMatch,
        parseFaultTolerance: parseFaultTolerance,
        getSentenceReplacements: getSentenceReplacements,
        getSimilarSentences: getSimilarSentences,
        getSentenceSituation: getSentenceSituation,
    };
})(window);