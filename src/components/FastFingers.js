import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { fromS } from 'hh-mm-ss';

import refresh from '../image/refresh.png'
import { words } from '../constants/Words';
import { NEW, CORRECT, WRONG, HIGHLIGHT } from '../constants/wordStatus';
import { Button } from '@material-ui/core';

const TIME = 60;

const FastFingers = () => {
    const [prevWords, setPrevWords] = useState([]);
    const [currentWords, setCurrentWords] = useState([]);
    const [nextWords, setNextWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [inputWord, setInputWord] = useState("");
    const [disableInput, setDisableInput] = useState(false);
    const [gameOver, setGameOver] = useState(true);
    const [timer, setTimer] = useState(TIME);
    const [wordsCompleted, setWordsCompleted] = useState(0);
    const [correctWords, setCorrectWords] = useState(0);

    const tikTok = () => {
        setTimer(timer => timer - 1);
    }

    const restartTimer = () => {
        setTimer(TIME);
    }

    const restart = () => {
        setGameOver(true);
        setDisableInput(false);
        restartTimer();
        setPrevWords([]);
        setCurrentWords(getNewWords());
        setNextWords(getNewWords());
        setCurrentWordIndex(0);
        setInputWord("");
    }

    const startGame = () => {
        setGameOver(false);
    }

    const endGame = () => {
        setGameOver(true);
        setDisableInput(true);
    }

    const timeOut = () => {
        return timer <= 0;
    }

    const swapRows = () => {
        setPrevWords(currentWords);
        setCurrentWords(nextWords);
        setNextWords(getNewWords());
    }

    const getNewWords = () => {
        const newWords = []
        for (let i = 0; i < 10; i++) {
            const randomWord = words[Math.floor(Math.random()*words.length)];
            newWords.push({
                word: randomWord,
                status: NEW
            });
        }
        return newWords;
    }

    const validateCurrentWord = () => {
        const newCurrentWords = [...currentWords];

        currentWords[currentWordIndex].word === inputWord.trim()
            ? newCurrentWords[currentWordIndex].status = CORRECT
            : newCurrentWords[currentWordIndex].status = WRONG;

        setCurrentWords(newCurrentWords);
    };

    const nextWord = () => {
        validateCurrentWord();
        if(currentWordIndex === currentWords.length-1) {
            setCurrentWordIndex(0);
            swapRows();
        } else {
            setCurrentWordIndex(currentWordIndex + 1);
        }
    };

    const highlightCurrentWord = () => {
        const newCurrentWords = [...currentWords];
        if (newCurrentWords.length) {
            newCurrentWords[currentWordIndex].status = HIGHLIGHT;
            setCurrentWords(newCurrentWords);
        }
    }

    const printRow = (words) => {
        return words.map((current, index) => {
            const {word, status} = current;
            return <span key={index} className={`word ${status}`}>{word}</span>;
        });
    }

    const compareInput = () => {
        const curWord = currentWords[currentWordIndex].word;
        return curWord.substring(0, inputWord.length) === inputWord;
    };

    // ComponentDidMount - First time component is renderd
    useEffect(() => {
        restart();
    }, []);

    // When current word is changed or new words are generated
    useEffect(() => {
        setCurrentWordIndex(currentWordIndex);
    }, [currentWords, currentWordIndex]);

    useEffect(() => {
        highlightCurrentWord();
    }, [currentWordIndex, nextWords]);

    // Timer starts
    useEffect(() => {
        let interval = null;
        if ( gameOver ) clearInterval(interval);
        else if ( timeOut() ) endGame();
        else {
            interval = setInterval(() => {
                tikTok();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, gameOver]);

    return(
        <Grid container alignContent="center" spacing={3}>
            <Grid item lg={12} className="rowBox">
                <Grid className="prevRow"> { printRow(prevWords) } </Grid>
                <Grid className="currentRow"> { printRow(currentWords) } </Grid>
                <Grid className="nextRow"> { printRow(nextWords) } </Grid>
            </Grid>
            <Grid item lg={12}>
                <TextField
                    autoFocus
                    disabled={disableInput}
                    className="input"
                    error={!!inputWord && !compareInput()}
                    value={inputWord}
                    onChange={(event) => {
                        let input = event.target.value.trim();
                        if ( gameOver && input ) startGame();
                        setInputWord(input);
                    }}
                    onKeyPress={(event) => {
                        if(event.key === " " && inputWord.trim().length) {
                            nextWord();
                            setInputWord("");
                        }
                    }}
                />
                <span className="timer">
                    { fromS(timer) }
                </span>
                <Button onClick={ restart }>
                    <img src={refresh} alt="restart" className="refresh-button"/>
                </Button>
            </Grid>
        </Grid>
    );
}

export default FastFingers;
