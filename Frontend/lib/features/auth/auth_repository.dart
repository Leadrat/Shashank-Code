import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api_client.dart';

class AuthRepository {
  final ApiClient api;
  AuthRepository(this.api);

  Future<bool> register(String username, String email, String password) async {
    try {
      final res = await api.post('/api/auth/register', body: {
        'userName': username,
        'email': email,
        'password': password,
      });
      print('Register response status: ${res.statusCode}');
      print('Register response body: ${res.body}');
      
      if (res.statusCode == 200) {
        return true;
      }
      return false;
    } catch (e) {
      print('Register error: $e');
      return false;
    }
  }

  Future<bool> login(String email, String password) async {
    try {
      final res = await api.post('/api/auth/login', body: {
        'email': email,
        'password': password,
      });
      print('Login response status: ${res.statusCode}');
      print('Login response body: ${res.body}');
      
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        final token = data['token'] as String?;
        if (token != null) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('jwt', token);
          await prefs.setString('userEmail', data['email'] ?? '');
          await prefs.setString('userName', data['userName'] ?? '');
          await prefs.setString('role', data['role'] ?? 'User');
          return true;
        }
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt');
  }
}
