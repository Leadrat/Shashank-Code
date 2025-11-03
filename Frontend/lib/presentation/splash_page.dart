import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../presentation/auth/login_page.dart';
import '../presentation/home/home_page.dart';

class SplashPage extends StatefulWidget {
  static const route = '/';
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await Future.delayed(const Duration(milliseconds: 800));
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt');
    if (!mounted) return;
    if (token != null && token.isNotEmpty) {
      Navigator.of(context).pushReplacementNamed(HomePage.route);
    } else {
      Navigator.of(context).pushReplacementNamed(LoginPage.route);
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}
