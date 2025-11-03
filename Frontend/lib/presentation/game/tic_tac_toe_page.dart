import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api_client.dart';

class TicTacToePage extends StatefulWidget {
  static const route = '/tic-tac-toe';
  final bool vsAI;
  const TicTacToePage({super.key, this.vsAI = false});

  @override
  State<TicTacToePage> createState() => _TicTacToePageState();
}

class _TicTacToePageState extends State<TicTacToePage> {
  List<String> _board = List.filled(9, '');
  bool _isXTurn = true;
  bool _gameOver = false;
  String _winner = '';
  bool _isPlayingWithAI = false;
  final ApiClient _api = ApiClient();

  @override
  void initState() {
    super.initState();
    _isPlayingWithAI = widget.vsAI;
  }

  void _makeMove(int index) {
    if (_gameOver || _board[index].isNotEmpty) return;

    setState(() {
      _board[index] = _isXTurn ? 'X' : 'O';
      _isXTurn = !_isXTurn;
    });

    _checkWinner();

    // AI move if playing with AI and game is not over
    if (_isPlayingWithAI && !_gameOver && _isXTurn == false) {
      _makeAIMove();
    }
  }

  void _makeAIMove() {
    Future.delayed(const Duration(milliseconds: 500), () {
      if (!_gameOver) {
        final availableMoves = List.generate(9, (i) => i)
            .where((i) => _board[i].isEmpty)
            .toList();
        
        if (availableMoves.isNotEmpty) {
          final aiMove = availableMoves[(DateTime.now().millisecondsSinceEpoch) % availableMoves.length];
          _makeMove(aiMove);
        }
      }
    });
  }

  void _checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (final pattern in winPatterns) {
      final a = pattern[0];
      final b = pattern[1];
      final c = pattern[2];
      
      if (_board[a].isNotEmpty && 
          _board[a] == _board[b] && 
          _board[b] == _board[c]) {
        setState(() {
          _gameOver = true;
          _winner = _board[a];
        });
        _saveGameResult();
        return;
      }
    }

    // Check for draw
    if (!_board.contains('')) {
      setState(() {
        _gameOver = true;
        _winner = 'Draw';
      });
      _saveGameResult();
    }
  }

  Future<void> _saveGameResult() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jwt = prefs.getString('jwt');
      if (jwt == null || jwt.isEmpty) return; // only save if authenticated

      final result = _winner == 'X' ? 'Win' : _winner == 'O' ? 'Loss' : 'Draw';
      final res = await _api.post('/api/scores', body: {'result': result});
      print('Submit score status: ${res.statusCode}');
    } catch (e) {
      print('Error saving game result: $e');
    }
  }

  void _resetGame() {
    setState(() {
      _board = List.filled(9, '');
      _isXTurn = true;
      _gameOver = false;
      _winner = '';
    });
  }

  void _toggleGameMode() {
    setState(() {
      _isPlayingWithAI = !_isPlayingWithAI;
    });
    _resetGame();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Tic Tac Toe ${_isPlayingWithAI ? "(vs AI)" : "(2 Players)"}',
          style: GoogleFonts.poppins(),
        ),
        actions: [
          IconButton(
            icon: Icon(_isPlayingWithAI ? Icons.group : Icons.smart_toy),
            onPressed: _toggleGameMode,
            tooltip: _isPlayingWithAI ? 'Switch to 2 Players' : 'Switch to AI',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            if (_gameOver)
              Container(
                padding: const EdgeInsets.all(16),
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  color: _winner == 'Draw' 
                      ? Colors.orange.shade100 
                      : _winner == 'X' 
                          ? Colors.green.shade100 
                          : Colors.red.shade100,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  _winner == 'Draw' 
                      ? "It's a Draw!" 
                      : _winner == 'X' 
                          ? 'Player X Wins!' 
                          : _isPlayingWithAI ? 'AI Wins!' : 'Player O Wins!',
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: _winner == 'Draw' 
                        ? Colors.orange.shade800 
                        : _winner == 'X' 
                            ? Colors.green.shade800 
                            : Colors.red.shade800,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            
            if (!_gameOver)
              Container(
                padding: const EdgeInsets.all(16),
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'Current Turn: ${_isXTurn ? 'Player X' : _isPlayingWithAI ? 'AI' : 'Player O'}',
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                  ),
                ),
              ),
            
            Expanded(
              child: AspectRatio(
                aspectRatio: 1.0,
                child: GridView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: 9,
                  itemBuilder: (context, index) {
                    return GestureDetector(
                      onTap: () => _makeMove(index),
                      child: Container(
                        decoration: BoxDecoration(
                          color: _board[index].isEmpty 
                              ? Colors.grey.shade100 
                              : _board[index] == 'X' 
                                  ? Colors.blue.shade100 
                                  : Colors.red.shade100,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.grey.shade300,
                            width: 2,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            _board[index],
                            style: GoogleFonts.poppins(
                              fontSize: 48,
                              fontWeight: FontWeight.bold,
                              color: _board[index] == 'X' 
                                  ? Colors.blue.shade700 
                                  : Colors.red.shade700,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _resetGame,
                    icon: const Icon(Icons.refresh),
                    label: const Text('New Game'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('Back'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
