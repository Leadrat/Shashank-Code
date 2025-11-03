import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'presentation/splash_page.dart';
import 'presentation/auth/login_page.dart';
import 'presentation/auth/register_page.dart';
import 'presentation/home/home_page.dart';
import 'presentation/game/game_page.dart';
import 'presentation/game/tic_tac_toe_page.dart';
import 'presentation/leaderboard/leaderboard_page.dart';
import 'presentation/profile/profile_page.dart';
import 'presentation/admin/admin_dashboard_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Game',
      theme: AppTheme.light,
      routes: {
        SplashPage.route: (_) => const SplashPage(),
        LoginPage.route: (_) => const LoginPage(),
        RegisterPage.route: (_) => const RegisterPage(),
        HomePage.route: (_) => const HomePage(),
        GamePage.route: (_) => const GamePage(),
        TicTacToePage.route: (_) => const TicTacToePage(),
        LeaderboardPage.route: (_) => const LeaderboardPage(),
        ProfilePage.route: (_) => const ProfilePage(),
        AdminDashboardPage.route: (_) => const AdminDashboardPage(),
      },
      initialRoute: SplashPage.route,
    );
  }
}
