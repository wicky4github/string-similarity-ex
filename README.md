string-similarity-ex
=================

A more powerful script for comparing two strings, based on [string-similarity](https://github.com/aceakash/string-similarity), which can allow you to get the situation of the accuracy of every single word.

## Table of Contents

* [Usage](#usage)
* [API](#api)
    * [getBestMatch(mainString, targetString)](#getbestmatchmainstring-targetstring)
        * [Arguments](#aruguments)
        * [Returns](#returns)
        * [Examples](#examples)
    * [parseFaultTolerance(formatString)](#parsefaulttoleranceformatstring)
        * [Arguments](#aruguments)
        * [Returns](#returns)
        * [Examples](#examples)
    * [getSentenceReplacements(formatString)](#getsentencereplacementsformatstring)
        * [Arguments](#aruguments)
        * [Returns](#returns)
        * [Examples](#examples)
    * [getSimilarSentences(mainString, targetString)](#getsimilarsentencesmainstring-targetstring)
        * [Arguments](#aruguments)
        * [Returns](#returns)
        * [Examples](#examples)
    * [getSentenceSituation(mainString, targetString, formatString)](#getsentencesituationmainstring-targetstring-formatstring)
        * [Arguments](#aruguments)
        * [Returns](#returns)
        * [Examples](#examples)
* [Acknowledgements](#acknowledgements)    

## Usage
Import js:

```
    <script src="string-similarity-ex.js"></script>
```

In your code:

```
    var key = 'Hello, world!';
    var answer = 'Hello, word';
    // main usage
    var situation = stringSimilarityEx.getSentenceSituation(key, answer);
    console.log(situation);
```

## API

### getBestMatch(mainString, targetString)

Returns an array, which includes all words that are the same as those of the correct sentence.

##### Arguments

1. mainString (string): correct sentence
2. targetString (string): user's sentence

Order must not be reversed.

#### Returns

(array): every item is a word with punctuation.

#### Examples

```
    var key = 'Hello, world!';
    var answer = 'Hello, word';
    var match = stringSimilarityEx.getBestMatch(key, answer);
    console.log(match); 
    // ['hello, ']
```

### parseFaultTolerance(formatString)

Returns an array, in which every item is an object with two properties - "word" and "replaces". 

##### Arguments

1. formatString (string): the format of the fault tolerance string

Refer to [getSentenceSituation](#getsentencesituationmainstring-targetstring-formatstring) to get definition.

#### Returns

(array): every item is an object like "`{word: 'soul', replaces: ['sole', 'so']}`".

#### Examples

```
    var parse = stringSimilarityEx.parseFaultTolerance('soul:sole,so');
    console.log(parse);
    // [{"word":"soul","replaces":["sole","so"]}]
```

### getSentenceReplacements(formatString)

Returns an array including all possibility of replacing words. 

##### Arguments

1. formatString (string): the format of the fault tolerance string

Refer to [getSentenceSituation](#getsentencesituationmainstring-targetstring-formatstring) to get definition.

#### Returns

(array): every item is an object for replacing words in the sentence.

#### Examples

```
    var replacements = stringSimilarityEx.getSentenceReplacements('soul:sole,so');
    console.log(replacements);
    // [{"soul":"sole"},{"soul":"so"}]
```

### getSimilarSentences(mainString, formatString)

Returns an array including all similar sentences based on the format main string.

##### Arguments

1. mainString (string): correct sentence
2. formatString (string): the format of the fault tolerance string

Refer to [getSentenceSituation](#getsentencesituationmainstring-targetstring-formatstring) to get definition.

#### Returns

(array): every items is string.

#### Examples

```
    var similarities = stringSimilarityEx.getSimilarSentences('Hello, world!', 'world:word');
    console.log(similarities);
    // ["Hello, word!"]
```

### getSentenceSituation(mainString, targetString, formatString)

Main function of "stringSimilarityEx", allow you to get the situation of the accuracy of every single word.

##### Arguments

1. mainString (string): correct sentence
2. targetString (string): user's sentence
3. formatString (string|undefined): the format of the fault tolerance string

Definition of the format string: search1:replace1|search2:replace2,replace3
- example 1: soul:sole
- example 2: soul:sole,so
- example 3: soul:sole,so|well:will
- example 4: soul:sole,so|well:will|too:two,to

#### Returns

(array): every items is an object with two properties - "word" and "correct". Property "correct" equals 0 indicates the word is not correct. It can be obtained that property "correct" equals 1 indicates the word is correct.

#### Examples

```
    var key = 'Hello, world!';
    var answer = 'Hello, word';
    var format = 'world:word';
    // without tolerance: [{"word":"Hello,","correct":1},{"word":"world!","correct":0}]
    var situation1 = stringSimilarityEx.getSentenceSituation(key, answer);
    console.log(situation1);
    // with tolerance: [{"word":"Hello,","correct":1},{"word":"world!","correct":1}]
    var situation2 = stringSimilarityEx.getSentenceSituation(key, answer, format);
    console.log(situation2);
```

## Acknowledgements

Thank Winson for his idea of how to get the best match between two strings and correcting my grammar mistakes. 