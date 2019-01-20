string-similarity-ex
=================

A more powerful script for comparing two strings, based on [string-similarity](https://github.com/aceakash/string-similarity), which can make you get the situation of the accuracy to every single word.

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

Returns an array, which includes all words that is the same as the correct sentence.

##### Arguments

1. mainString (string): correct sentence
2. targetString (string): user's sentence

Order can not be reversed.

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

Returns an array, which every item is an object with two properties - "word" and "replaces". 

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

Returns an array including all possibility of replacing word. 

##### Arguments

1. formatString (string): the format of the fault tolerance string

Refer to [getSentenceSituation](#getsentencesituationmainstring-targetstring-formatstring) to get definition.

#### Returns

(array): every item is an object for replacing sentence.

#### Examples

```
    var replacements = stringSimilarityEx.getSentenceReplacements('soul:sole,so');
    console.log(replacements);
    // [{"soul":"sole"},{"soul":"so"}]
```

### getSimilarSentences(mainString, formatString)

Returns an array including all similar sentences of main string based on the format string.

##### Arguments

1. mainString (string): correct sentence
2. formatString (string): the format of the fault tolerance string

Refer to [getSentenceSituation](#getsentencesituationmainstring-targetstring-formatstring) to get definition.

#### Returns

(array): 

#### Examples

```
    var parse = stringSimilarityEx.parseFaultTolerance('soul:sole,so');
    console.log(parse);
    // [{"word":"soul","replaces":["sole","so"]}]
```

### getSentenceSituation(mainString, targetString, formatString)

Returns an array, which every item is an object with two properties - "word" and "replaces". 

##### Arguments

1. mainString (string): correct sentence
2. targetString (string): user's sentence
3. formatString (string): the format of the fault tolerance string

Definition of format string: search1:replace1|search2:replace2,replace3
- example 1: soul:sole
- example 2: soul:sole,so
- example 3: soul:sole,so|well:will
- example 4: soul:sole,so|well:will|too:two,to

#### Returns

(array): 

#### Examples

```
    var parse = stringSimilarityEx.parseFaultTolerance('soul:sole,so');
    console.log(parse);
    // [{"word":"soul","replaces":["sole","so"]}]
```

## Acknowledgements

Thank Winson for his idea of how to get the best match between two strings and correcting my grammar mistakes. 