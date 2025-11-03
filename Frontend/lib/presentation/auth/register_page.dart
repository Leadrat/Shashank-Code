import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../features/auth/auth_repository.dart';
import '../../services/api_client.dart';
import 'login_page.dart';

class RegisterPage extends StatefulWidget {
  static const route = '/register';
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _username = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirmPassword = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _username.dispose();
    _email.dispose();
    _password.dispose();
    _confirmPassword.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    
    final username = _username.text.trim();
    final email = _email.text.trim();
    final password = _password.text;
    final confirmPassword = _confirmPassword.text;
    
    if (username.isEmpty || email.isEmpty || password.isEmpty) {
      setState(() {
        _loading = false;
        _error = 'Please fill all fields';
      });
      return;
    }
    
    if (password != confirmPassword) {
      setState(() {
        _loading = false;
        _error = 'Passwords do not match';
      });
      return;
    }
    
    if (password.length < 6) {
      setState(() {
        _loading = false;
        _error = 'Password must be at least 6 characters';
      });
      return;
    }
    
    try {
      final repo = AuthRepository(ApiClient());
      final ok = await repo.register(username, email, password);
      if (!mounted) return;
      setState(() => _loading = false);
      if (!ok) {
        setState(() => _error = 'Registration failed. Email may already be used.');
        return;
      }
      Navigator.of(context).pushReplacementNamed(LoginPage.route);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = 'Registration failed: ${e.toString()}';
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
                Text('Create Account', style: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Text('Sign up to get started', style: GoogleFonts.poppins(color: Colors.black54)),
                const SizedBox(height: 24),
                TextField(controller: _username, decoration: const InputDecoration(labelText: 'Username')),
                const SizedBox(height: 12),
                TextField(controller: _email, decoration: const InputDecoration(labelText: 'Email')),
                const SizedBox(height: 12),
                TextField(controller: _password, decoration: const InputDecoration(labelText: 'Password'), obscureText: true),
                const SizedBox(height: 12),
                TextField(controller: _confirmPassword, decoration: const InputDecoration(labelText: 'Confirm Password'), obscureText: true),
                const SizedBox(height: 12),
                if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
                const SizedBox(height: 12),
                FilledButton(
                  onPressed: _loading ? null : _register,
                  child: _loading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Sign Up'),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => Navigator.of(context).pushReplacementNamed(LoginPage.route),
                  child: const Text('Already have an account? Sign In'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
