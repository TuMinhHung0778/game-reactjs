import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState(0); // số vòng tròn cần hiển thị
  const [circles, setCircles] = useState([]); // danh sách các vòng tròn
  const [currentNumber, setCurrentNumber] = useState(1); // số hiện tại người dùng cần click
  const [gameOver, setGameOver] = useState(false); // trạng thái kết thúc trò chơi
  const [cleared, setCleared] = useState(false); // trạng thái hoàn tất trò chơi
  const [time, setTime] = useState(0); // thời gian chơi
  const [intervalId, setIntervalId] = useState(null); // ID interval để dừng khi cần
  const [isPlaying, setIsPlaying] = useState(false); // trạng thái đang chơi hay không
  const [canChangePoints, setCanChangePoints] = useState(true); // kiểm soát việc thay đổi số points
  const [hoveredCircle, setHoveredCircle] = useState(null); // trạng thái của vòng tròn đang hover
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi

  // Đếm thời gian chơi khi bắt đầu nhấn "Play"
  useEffect(() => {
    if (isPlaying && !gameOver && !cleared) {
      const id = setInterval(() => {
        setTime(prev => prev + 0.1);
      }, 100);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [isPlaying, gameOver, cleared]);

  const resetGame = () => {
    setCircles(generateCircles(points)); // tạo vòng tròn với số lượng điểm mới
    setCurrentNumber(1); // số thứ tự đầu tiên
    setGameOver(false);
    setCleared(false);
    setTime(0); // reset thời gian
    setHoveredCircle(null); // reset hover state
    setErrorMessage(''); // Xóa thông báo lỗi khi restart
  };

  const startGame = () => {
    setIsPlaying(true); // chuyển sang trạng thái đang chơi
    setCanChangePoints(false); // không cho phép thay đổi số "Points" khi trò chơi đang diễn ra
    resetGame(); // bắt đầu trò chơi mới
  };

  const generateCircles = (n) => {
    const newCircles = [];
    for (let i = 1; i <= n; i++) {
      const x = Math.random() * 460; // tọa độ x ngẫu nhiên (giảm để không bị tràn ra ngoài 500px)
      const y = Math.random() * 460; // tọa độ y ngẫu nhiên (giảm để không bị tràn ra ngoài 500px)
      newCircles.push({ id: i, x, y });
    }
    return newCircles;
  };

  const handleCircleClick = (id) => {
    if (id === currentNumber) {
      // Nếu người chơi nhấp vào vòng tròn theo đúng thứ tự
      if (id === points) {
        setCleared(true); // Hoàn thành trò chơi khi click vào vòng tròn cuối cùng
        clearInterval(intervalId);
      }
      setCircles(prevCircles => prevCircles.filter(circle => circle.id !== id)); // Loại bỏ vòng tròn khỏi mảng
      setCurrentNumber(currentNumber + 1); // Tăng số thứ tự lên
    } else {
      // Nhấp sai, trò chơi kết thúc
      setGameOver(true);
      clearInterval(intervalId);
    }
  };

  const handlePlayOrRestart = () => {
    // Kiểm tra nếu số điểm không hợp lệ
    if (points === 0) {
      setErrorMessage('Vui lòng nhập điểm số');
      return;
    } else if (points < 0 || !Number.isInteger(points)) {
      setErrorMessage('Nhập số nguyên dương');
      return;
    }

    // Nếu đang chơi và bấm nút thì sẽ là "Restart"
    if (isPlaying) {
      resetGame();
    } else {
      // Nếu chưa chơi và bấm nút thì sẽ là "Play"
      startGame();
    }
  };

  const handlePointsChange = (e) => {
    const newPoints = parseFloat(e.target.value);
    if (!isPlaying || !canChangePoints) {
      setPoints(newPoints);
    }
  };

  const handleMouseEnter = (id) => {
    setHoveredCircle(id); // khi rê chuột vào, lưu ID của vòng tròn đang hover
  };

  const handleMouseLeave = () => {
    setHoveredCircle(null); // khi rời chuột khỏi vòng tròn, xóa trạng thái hover
  };

  return (
    <div className="App">
      <h1>LET'S PLAY</h1>
      <div className="controls">
        <label>
          Points: <input type="number" min="1" onChange={handlePointsChange} value={points} />
        </label>
        <div>Time: {time.toFixed(1)}s</div>
        <button onClick={handlePlayOrRestart}>
          {isPlaying ? 'Restart' : 'Play'}
        </button>
      </div>

      {/* Hiển thị thông báo lỗi */}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <div className="game-area">
        {circles.map(circle => (
          <div
            key={circle.id}
            className={`circle ${currentNumber > circle.id ? 'cleared' : ''} ${hoveredCircle === circle.id ? 'hovered' : ''}`}
            style={{ top: circle.y, left: circle.x }}
            onClick={() => handleCircleClick(circle.id)}
            onMouseEnter={() => handleMouseEnter(circle.id)} // khi chuột vào vòng tròn
            onMouseLeave={handleMouseLeave} // khi chuột rời khỏi vòng tròn
          >
            {circle.id}
          </div>
        ))}
      </div>

      {gameOver && <h2>GAME OVER</h2>}
      {cleared && <h2>ALL CLEARED</h2>}
    </div>
  );
}

export default App;
