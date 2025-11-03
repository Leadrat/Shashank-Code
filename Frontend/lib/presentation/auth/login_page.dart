import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../features/auth/auth_repository.dart';
import '../../services/api_client.dart';
import '../home/home_page.dart';
import '../admin/admin_dashboard_page.dart';
import 'register_page.dart';

class LoginPage extends StatefulWidget {
  static const route = '/login';
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _email = TextEditingController(text: 'admin@game.local');
  final _password = TextEditingController(text: 'Admin@123');
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    
    final email = _email.text.trim();
    final password = _password.text;
    
    if (email.isEmpty || password.isEmpty) {
      setState(() {
        _loading = false;
        _error = 'Please enter email and password';
      });
      return;
    }
    
    try {
      final repo = AuthRepository(ApiClient());
      final ok = await repo.login(email, password);
      if (!mounted) return;
      setState(() => _loading = false);
      if (!ok) {
        setState(() => _error = 'Invalid credentials or server error');
        return;
      }
      final prefs = await SharedPreferences.getInstance();
      final role = prefs.getString('role') ?? 'User';
      if (!mounted) return;
      if (role == 'Admin') {
        Navigator.of(context).pushReplacementNamed(AdminDashboardPage.route);
      } else {
        Navigator.of(context).pushReplacementNamed(HomePage.route);
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = 'Login failed: ${e.toString()}';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Welcome back', style: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Text('Sign in to continue', style: GoogleFonts.poppins(color: Colors.black54)),
                const SizedBox(height: 24),
                TextField(controller: _email, decoration: const InputDecoration(labelText: 'Email')),
                const SizedBox(height: 12),
                TextField(controller: _password, decoration: const InputDecoration(labelText: 'Password'), obscureText: true),
                const SizedBox(height: 12),
                if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
                const SizedBox(height: 12),
                FilledButton(
                  onPressed: _loading ? null : _login,
                  child: _loading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Login'),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => Navigator.of(context).pushNamed(RegisterPage.route),
                  child: const Text("Don't have an account? Sign Up"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
