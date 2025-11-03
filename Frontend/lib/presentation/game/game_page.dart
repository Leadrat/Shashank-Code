import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'tic_tac_toe_page.dart';

class GamePage extends StatelessWidget {
  static const route = '/game';
  const GamePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Game', style: GoogleFonts.poppins()),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Select Game Mode',
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _GameModeCard(
                    title: 'Single Player',
                    icon: Icons.smart_toy,
                    description: 'Play against AI',
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const TicTacToePage(vsAI: true)),
                    ),
                  ),
                  _GameModeCard(
                    title: 'Two Players',
                    icon: Icons.group,
                    description: 'Play locally with a friend',
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const TicTacToePage(vsAI: false)),
                    ),
                  ),
                  _GameModeCard(
                    title: 'Tournament',
                    icon: Icons.emoji_events,
                    description: 'Compete in tournaments',
                    onTap: () => _showComingSoon(context, 'Tournament'),
                  ),
                  _GameModeCard(
                    title: 'Practice',
                    icon: Icons.school,
                    description: 'Improve your skills',
                    onTap: () => _showComingSoon(context, 'Practice'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showComingSoon(BuildContext context, String mode) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(mode),
        content: const Text('This game mode is coming soon!'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}

class _GameModeCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final String description;
  final VoidCallback onTap;

  const _GameModeCard({
    required this.title,
    required this.icon,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 48,
                color: Theme.of(context).colorScheme.primary,
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                description,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
