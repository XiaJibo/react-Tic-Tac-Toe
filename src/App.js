import {useState} from 'react';

function Square({value, onSquareClick, isHighlight}) {
  return (
      <button className={`square ${isHighlight ? 'highlight' : ''}`} onClick={onSquareClick}>
        {value}
      </button>
  );
}

function Board({xIsNext, squares, onPlay, readonly}) {
  function handleClick(i) {
    if (readonly) {
      return;
    }
    const [winner] = calculateWinner(squares);
    if (winner || squares[i]) {
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

  const [winner, highlightMove] = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    // 是否平局
    const hasNext = squares.some(item => !item)
    if (hasNext) {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    } else {
      status = 'No Winner: Tie';
    }
  }
  return (
      <>
        {!readonly && <div className="status">{status}</div>}
        {/* 2.重写 Board 为使用两个循环来制作正方形，而不是硬编码它们。*/}
        {Array(3).fill(null).map((_, i) => {
          return (<div key={i} className="board-row">
            {Array(3).fill(null).map((_, j) => {
              const currentIndex = i * 3 + j
              // 4.当有人获胜时，突出显示导致获胜的三个方块（如果没有人获胜，则显示有关结果是平局的消息）
              return <Square isHighlight={highlightMove.includes(currentIndex)} key={currentIndex}
                             value={squares[currentIndex]} onSquareClick={() => handleClick(currentIndex)}/>
            })}
          </div>)
        })}
      </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAsc, setIsAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 添加一个切换按钮，让您按升序或降序对移动进行排序。
  function sortMove() {
    setIsAsc(!isAsc)
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
        // 1.仅针对当前移动，显示“您正在移动 #...”而不是按钮
        <li key={move}>
          {(
              // 5.在移动历史记录列表中以格式（行、列）显示每个移动的位置。
              <div className="move-step">
                {move === currentMove ? (<span>{description}</span>) : (
                    <button style={{height: '50px'}} onClick={() => jumpTo(move)}>{description}</button>)}
                <div><Board squares={squares} readonly/></div>
              </div>
          )}
        </li>
    );
  });
  !isAsc && (moves = moves.reverse())

  return (
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          {/* 3.添加一个切换按钮，让您按升序或降序对移动进行排序。*/}
          <button onClick={sortMove}>{isAsc ? 'asc' : 'desc'}</button>
          <ol>{moves}</ol>
        </div>
      </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}
