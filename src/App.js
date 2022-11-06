import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Figure from "./components/Figure";
import WrongLetters from "./components/WrongLetters";
import Word from "./components/Word";
import Popup from "./components/Popup";
import Notification from "./components/Notification";
import { showNotification as show } from "./helpers/helpers";

import axios from "axios";

function App() {
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const fetchWords = async () => {
    try {
      const config = {
        headers: {
          "X-Api-Key": process.env.REACT_APP_API_KEY,
        },
      };
      const res = await axios.get(
        `https://api.api-ninjas.com/v1/randomword`,
        config
      );
      const randomWords = res.data.word;
      console.log(typeof randomWords);
      setWords(randomWords);
      setSelectedWord(randomWords);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  // side-effect when component mount
  useEffect(() => {
    fetchWords();
    // return () => {};
  }, []);

  console.log(words);
  console.log(selectedWord);

  useEffect(() => {
    const handleKeydown = (event) => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();
        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [correctLetters, wrongLetters, playable, selectedWord]);

  // reset game mode
  function playAgain() {
    setPlayable(true);

    // Empty Arrays
    setCorrectLetters([]);
    setWrongLetters([]);

    // API call to get a random word
    fetchWords();

    // Get New Word
    setSelectedWord(words);
  }

  return (
    <>
      <Header />
      {selectedWord ? (
        <>
          <div className="game-container">
            <Figure wrongLetters={wrongLetters} />
            <WrongLetters wrongLetters={wrongLetters} />
            <Word selectedWord={selectedWord} correctLetters={correctLetters} />
          </div>
          <Popup
            correctLetters={correctLetters}
            wrongLetters={wrongLetters}
            selectedWord={selectedWord}
            setPlayable={setPlayable}
            playAgain={playAgain}
          />
          <Notification showNotification={showNotification} />
        </>
      ) : (
        <div className="">loading...</div>
      )}
    </>
  );
}

export default App;
