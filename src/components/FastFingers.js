import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { words } from '../constants/Words';
import { NEW, CORRECT, WRONG, CURRENT } from '../constants/wordStatus';
import { Button } from '@material-ui/core';

const FastFingers = () => {
    const [activeWords, setActiveWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(0);
    const [inputWord, setInputWord] = useState("");
    const [wordsCompleted, setWordsCompleted] = useState(0);
    const [correctWords, setCorrectWords] = useState(0);

    const getNewWords = () => {
        const newWords = []
        for (let i = 0; i < 12; i++) {
            const randomWord = words[Math.floor(Math.random()*words.length)];
            newWords.push({
                word: randomWord,
                status: NEW
            });
        }
        setActiveWords(newWords);
    };

    const validateCurrentWord = () => {
        const newActiveWords = [...activeWords];
        if(activeWords[currentWord].word === inputWord.trim()) newActiveWords[currentWord].status = CORRECT;
        else newActiveWords[currentWord].status = WRONG;

        setActiveWords(newActiveWords);
    };

    const nextWord = () => {
        validateCurrentWord();
        if(currentWord === activeWords.length-1) {
            setCurrentWord(0);
            getNewWords();
        } else {
            setCurrentWord(currentWord + 1);
        }
    };

    const printRow = (words) => {
        return words.map((current, index) => {
            const {word, status} = current;
            return <span key={index} className={`word ${status}`}>{word}</span>
        });
    }

    const compareInput = () => {
        return activeWords[currentWord].word.includes(inputWord.trim());
    };

    useEffect(() => {
        setCurrentWord(currentWord);
    }, [activeWords, currentWord]);

    return(
        <Grid container alignContent="center" spacing={3}>
            { activeWords.length === 0 && getNewWords() }
            <Grid item lg={12} className="rowBox"> { activeWords && printRow(activeWords)} </Grid>
            <Grid item lg={12}>
                <TextField 
                    autoFocus
                    className="input"
                    error={!!inputWord && !compareInput()}
                    value={inputWord}
                    onChange={(event) => {
                        setInputWord(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        if(event.key === " ") {
                            nextWord();
                            setInputWord("");
                        }
                    }}
                />
                <span className="timer">
                    timer
                </span>
                <Button>
                    Start
                </Button>
            </Grid>
        </Grid>
    );
}

export default FastFingers;
