import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_client.dart';

class LeaderboardPage extends StatefulWidget {
  static const route = '/leaderboard';
  const LeaderboardPage({super.key});

  @override
  State<LeaderboardPage> createState() => _LeaderboardPageState();
}

class _LeaderboardPageState extends State<LeaderboardPage> {
  final ApiClient _api = ApiClient();
  bool _loading = true;
  List<Map<String, dynamic>> _scores = [];
  String? _error;
  Timer? _poller;

  @override
  void initState() {
    super.initState();
    _loadScores();
    _poller = Timer.periodic(const Duration(seconds: 5), (_) {
      _loadScores();
    });
  }

  @override
  void dispose() {
    _poller?.cancel();
    super.dispose();
  }

  Future<void> _loadScores() async {
    try {
      final res = await _api.get('/api/scores');
      print('Scores response status: ${res.statusCode}');
      print('Scores response body: ${res.body}');
      
      if (res.statusCode == 200) {
        // Parse real data from backend
        final List<dynamic> data = List.from(
          res.body.isNotEmpty ? List.from(jsonDecode(res.body)) : []
        );
        
        // Transform data to match our expected format
        final List<Map<String, dynamic>> transformedData = data.map((item) {
          return {
            'userName': item['UserName'] ?? item['userName'] ?? 'Unknown',
            'wins': item['Wins'] ?? item['wins'] ?? 0,
            'losses': item['Losses'] ?? item['losses'] ?? 0,
            'draws': item['Draws'] ?? item['draws'] ?? 0,
          };
        }).toList();
        
        setState(() {
          _scores = transformedData;
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to load scores (Status: ${res.statusCode})';
          _loading = false;
        });
      }
    } catch (e) {
      print('Error loading scores: $e');
      setState(() {
        _error = 'Error loading scores: $e';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Leaderboard', style: GoogleFonts.poppins()),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadScores,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_error!, style: const TextStyle(color: Colors.red)),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadScores,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _scores.isEmpty
                  ? const Center(child: Text('No scores available'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _scores.length,
                      itemBuilder: (context, index) {
                        final score = _scores[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            leading: CircleAvatar(
                              child: Text('${index + 1}'),
                            ),
                            title: Text(
                              score['userName'] ?? 'Unknown',
                              style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                            ),
                            subtitle: Text(
                              'W: ${score['wins'] ?? 0} | L: ${score['losses'] ?? 0} | D: ${score['draws'] ?? 0}',
                              style: GoogleFonts.poppins(),
                            ),
                            trailing: Text(
                              '${(score['wins'] ?? 0) * 3 + (score['draws'] ?? 0) * 1} pts',
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
    );
  }
}
