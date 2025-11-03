import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../admin/admin_dashboard_page.dart';
import '../game/game_page.dart';
import '../leaderboard/leaderboard_page.dart';
import '../profile/profile_page.dart';
import '../auth/login_page.dart';

class HomePage extends StatelessWidget {
  static const route = '/home';
  const HomePage({super.key});

  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt');
    Navigator.of(context).pushReplacementNamed(LoginPage.route);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flutter Game')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.count(
          crossAxisCount: MediaQuery.of(context).size.width < 600 ? 2 : 4,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          children: const [
            _HomeCard(title: 'Single Player', icon: Icons.smart_toy, route: GamePage.route),
            _HomeCard(title: 'Two Players', icon: Icons.group, route: GamePage.route),
            _HomeCard(title: 'Leaderboard', icon: Icons.emoji_events, route: LeaderboardPage.route),
            _HomeCard(title: 'Profile', icon: Icons.person, route: ProfilePage.route),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _logout(context),
        label: const Text('Logout'),
        icon: const Icon(Icons.logout),
      ),
      drawer: Drawer(
        child: ListView(
          children: [
            const DrawerHeader(child: Text('Menu')),
            ListTile(
              leading: const Icon(Icons.admin_panel_settings),
              title: const Text('Admin Dashboard'),
              onTap: () => Navigator.of(context).pushNamed(AdminDashboardPage.route),
            ),
          ],
        ),
      ),
    );
  }
}

class _HomeCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final String route;
  const _HomeCard({required this.title, required this.icon, required this.route});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => Navigator.of(context).pushNamed(route),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [Icon(icon, size: 36), const SizedBox(height: 8), Text(title)],
          ),
        ),
      ),
    );
  }
}
