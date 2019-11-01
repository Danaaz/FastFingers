import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { fromS } from 'hh-mm-ss';

import refresh from '../image/refresh.png'
import { words } from '../constants/Words';
import { NEW, CORRECT, WRONG, CURRENT } from '../constants/wordStatus';
import { Button } from '@material-ui/core';
import { timeout } from 'q';

const FastFingers = () => {
    const [activeWords, setActiveWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(0);
    const [inputWord, setInputWord] = useState("");
    const [disableInput, setDisableInput] = useState(false);
    const [wordsCompleted, setWordsCompleted] = useState(0);
    const [correctWords, setCorrectWords] = useState(0);
    const [timer, setTimer] = useState(60);
    const [gameOver, setGameOver] = useState(true);
    let interval;

    const tikTok = () => {
        setTimer(timer => timer - 1);
    }

    const restartTimer = () => {
        setTimer(60);
    }

    const restart = () => {
        setGameOver(true);
        setDisableInput(false);
        restartTimer();
        getNewWords();
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
        setCurrentWord(0);
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

    // ComponentDidMount - First time component is renderd
    useEffect(() => {
        console.log("ComponentDidMount");
        
        restart();
    }, []);

    // When current word is changed or new words are generated
    useEffect(() => {
        setCurrentWord(currentWord);
    }, [activeWords, currentWord]);

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
            <Grid item lg={12} className="rowBox"> { activeWords && printRow(activeWords)} </Grid>
            <Grid item lg={12}>
                <TextField
                    autoFocus
                    disabled={disableInput}
                    className="input"
                    error={!!inputWord && !compareInput()}
                    value={inputWord}
                    onChange={(event) => {
                        if ( gameOver ) startGame();
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
