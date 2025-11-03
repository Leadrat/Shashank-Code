import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api_client.dart';
import '../auth/login_page.dart';

class AdminDashboardPage extends StatefulWidget {
  static const route = '/admin';
  const AdminDashboardPage({super.key});

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  final _api = ApiClient();
  bool _loading = true;
  String? _error;
  int _users = 0;
  int _matches = 0;
  String _topPlayer = '—';
  Timer? _poller;

  @override
  void initState() {
    super.initState();
    _loadSummary();
    _poller = Timer.periodic(const Duration(seconds: 7), (_) => _loadSummary());
  }

  @override
  void dispose() {
    _poller?.cancel();
    super.dispose();
  }

  Future<void> _loadSummary() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _api.get('/api/admin/summary');
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        setState(() {
          _users = (data['totalUsers'] ?? 0) as int;
          _matches = (data['totalMatches'] ?? 0) as int;
          _topPlayer = (data['topPlayer'] as String?) ?? '—';
          _loading = false;
        });
      } else if (res.statusCode == 401 || res.statusCode == 403) {
        setState(() {
          _error = 'Unauthorized. Login as Admin to view dashboard.';
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to load summary (status ${res.statusCode})';
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error: $e';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).maybePop(),
          tooltip: 'Back',
        ),
        title: const Text('Admin Dashboard'),
        actions: [
          IconButton(onPressed: _loadSummary, icon: const Icon(Icons.refresh)),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Sign out',
            onPressed: () async {
              final prefs = await SharedPreferences.getInstance();
              await prefs.remove('jwt');
              await prefs.remove('userEmail');
              await prefs.remove('userName');
              await prefs.remove('role');
              if (context.mounted) {
                Navigator.of(context).pushNamedAndRemoveUntil(LoginPage.route, (route) => false);
              }
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(child: Text(_error!, style: const TextStyle(color: Colors.red)))
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          _StatCard(title: 'Users', value: '$_users'),
                          _StatCard(title: 'Matches', value: '$_matches'),
                          _StatCard(title: 'Top Player', value: _topPlayer.isEmpty ? '—' : _topPlayer),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Expanded(
                        child: Card(
                          child: Center(
                            child: Text(
                              'Charts and tables coming next',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  const _StatCard({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 220,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(title, style: const TextStyle(color: Colors.black54)),
            const SizedBox(height: 6),
            Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
          ]),
        ),
      ),
    );
  }
}
