import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../core/config.dart';

class ApiClient {
  final http.Client _client;
  ApiClient({http.Client? client}) : _client = client ?? http.Client();

  Future<http.Response> post(String path, {Object? body}) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt');
    final uri = Uri.parse('${AppConfig.apiBaseUrl}$path');
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (token != null) headers['Authorization'] = 'Bearer $token';
    return _client.post(uri, headers: headers, body: jsonEncode(body));
  }

  Future<http.Response> get(String path) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt');
    final uri = Uri.parse('${AppConfig.apiBaseUrl}$path');
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (token != null) headers['Authorization'] = 'Bearer $token';
    return _client.get(uri, headers: headers);
  }
}
