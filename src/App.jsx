import { useState, useEffect, useRef } from 'react';
import kitty from "./Assets/kitty.png";
import mouse from "./Assets/mouse.png";
import SettingsMenu from './SettingsMenu.jsx';
import musicTrack1 from './Assets/music/Lost_woods .mp3'
import musicTrack3 from './Assets/music/Death_By_Glamour.mp3'
import musicTrack2 from './Assets/music/Life_Will_Change.mp3'
import musicTrack4 from './Assets/music/Super-Mario_ World.mp3'

// Decide qué mostrar: una imagen o nada
function Square({ value, onSquareClick }) {
  let displayValue = null;
  if (value === 'X') {
    displayValue = <img src={kitty} alt="Gato" />;
  } else if (value === 'O') {
    displayValue = <img src={mouse} alt="Raton" />;
  }

  return (
    <button className="square" onClick={onSquareClick}>
      {displayValue}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, gridSize }) {

  function handleClick(i) {
    if (calculateWinner(squares, gridSize) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }



  return (
    <>

      <div
        className="game-board"
        style={{ '--grid-size': gridSize }}
      >
        {squares.map((value, index) => (
          <Square
            key={index}
            value={value}
            onSquareClick={() => handleClick(index)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
   const musicOptions = [
    { name: "Lost Woods", src: musicTrack1 },
    { name: "Life Will Change", src: musicTrack2 },
    { name: "Death By Glamour", src: musicTrack3 },
     { name: "Super Mario World", src: musicTrack4 },
    { name: "Sin Música", src: "none" }
  ];
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [gridSize, setGridSize] = useState(3);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(musicOptions[0].src);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
 

  useEffect(() => {
    setHistory([Array(gridSize * gridSize).fill(null)]);
    setCurrentMove(0);
  }, [gridSize]);

  // Este "effect" se ejecuta cuando 'currentTrack' cambia
  useEffect(() => {
    if (audioRef.current) {
      if (currentTrack === "none") {
        audioRef.current.pause();
      } else {
        audioRef.current.src = currentTrack;
        const playAudio = async () => {
          try {
            audioRef.current.load();
            await audioRef.current.play();
          }
            catch (e) {
            // 5. Si el navegador bloquea el autoplay, lo veremos aquí
            console.log("El navegador bloqueó la reproducción: ", e);
          }
          };
          playAudio();
      }
    }
  }, [currentTrack]);

   // Este "effect" se ejecuta cuando 'volume' cambia
    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }, [volume]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Movimiento #' + move;
    } else {
      description = 'Reiniciar juego';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const winner = calculateWinner(currentSquares, gridSize);
  let status;
  if (winner) {
    status = 'Ganador: ' + (winner === 'X' ? '🐱' : '🐭');
  } else {
    status = 'Siguiente: ' + (xIsNext ? '🐱' : '🐭');
  }



  return (
    <div className="main-layout">
      <audio ref={audioRef} loop />
      <div className="game-info">
        <button
          className="settings-toggle-button"
          onClick={() => setIsSettingsVisible(true)}
        >
          Configuración
        </button>

        <ol>{moves}</ol>
      </div>
      <div id="arcade-cabinet">
        <div id="marquee">
          <h1>GATO Y RATON</h1>
        </div>

        <div id="screen-bezel">
          <div id="game-screen">
            <div id="game-area">

              <div className="game">
                <div className="game-board-container"> { }
                  <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                    gridSize={gridSize}
                  />
                </div>
              </div>
            </div>
            <div id="screen-reflection"></div>
          </div>
        </div>

        <div id="control-panel">
          <div className="joystick"></div>
          <div className="buttons">
            <div className="arcade-button red"></div>
          </div>
          <div id="start-button-container">
            <button
              id="start-button"
              onClick={() => alert("Hecho por: Iván José Rodríguez Maldonado - 73016")}
            >
              Start</button>
          </div>
        </div>
      </div>

      <div className="status-panel">
        <h2>ESTADO</h2>
        <div className="status-message">{status}</div>
      </div>

      {isSettingsVisible && (
        <SettingsMenu
          currentSize={gridSize}
          currentTrack={currentTrack}
          currentVolume={volume}
          musicOptions={musicOptions}
          onClose={() => setIsSettingsVisible(false)}
          onApplySettings={(settings) => {
            setGridSize(settings.newSize);
            setCurrentTrack(settings.newTrack);
            setVolume(settings.newVolume);
          }}
        />
      )}

    </div>
  );
}

function calculateWinner(squares, size) {
  const lines = [];

  // 1. Generar líneas horizontales
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(i * size + j);
    }
    lines.push(row);
  }

  // 2. Generar líneas verticales
  for (let i = 0; i < size; i++) {
    const col = [];
    for (let j = 0; j < size; j++) {
      col.push(j * size + i);
    }
    lines.push(col);
  }

  // 3. Generar diagonales
  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < size; i++) {
    diag1.push(i * size + i);
    diag2.push(i * size + (size - 1 - i));
  }
  lines.push(diag1);
  lines.push(diag2);

  // 4. Comprobar ganador (lógica dinámica)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const firstSquare = squares[line[0]];

    if (firstSquare) {
      let allSame = true;
      for (let j = 1; j < line.length; j++) {
        if (squares[line[j]] !== firstSquare) {
          allSame = false;
          break;
        }
      }
      if (allSame) {
        return firstSquare; // ¡Ganador!
      }
    }
  }

  return null;
} 
