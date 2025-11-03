import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../auth/login_page.dart';

class ProfilePage extends StatefulWidget {
  static const route = '/profile';
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  String _userName = '';
  String _email = '';
  String _role = '';
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userName = prefs.getString('userName') ?? 'Unknown';
      _email = prefs.getString('userEmail') ?? 'Unknown';
      _role = prefs.getString('role') ?? 'User';
      _loading = false;
    });
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt');
    await prefs.remove('userName');
    await prefs.remove('userEmail');
    await prefs.remove('role');
    if (mounted) {
      Navigator.of(context).pushNamedAndRemoveUntil(
        LoginPage.route,
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile', style: GoogleFonts.poppins()),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 40),
                  CircleAvatar(
                    radius: 60,
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    child: Text(
                      _userName.isNotEmpty ? _userName[0].toUpperCase() : 'U',
                      style: GoogleFonts.poppins(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    _userName,
                    style: GoogleFonts.poppins(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _email,
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Chip(
                    label: Text(
                      _role,
                      style: GoogleFonts.poppins(
                        color: _role == 'Admin' ? Colors.white : Colors.black,
                      ),
                    ),
                    backgroundColor: _role == 'Admin' ? Colors.red : Colors.grey[300],
                  ),
                  const SizedBox(height: 40),
                  Expanded(
                    child: ListView(
                      children: [
                        _buildProfileItem(
                          icon: Icons.person,
                          title: 'Username',
                          value: _userName,
                        ),
                        _buildProfileItem(
                          icon: Icons.email,
                          title: 'Email',
                          value: _email,
                        ),
                        _buildProfileItem(
                          icon: Icons.admin_panel_settings,
                          title: 'Role',
                          value: _role,
                        ),
                        const ListTile(
                          leading: Icon(Icons.history),
                          title: Text('Game History'),
                          subtitle: Text('View your match history'),
                          trailing: Icon(Icons.chevron_right),
                          onTap: null, // TODO: Implement game history
                        ),
                        const ListTile(
                          leading: Icon(Icons.settings),
                          title: Text('Settings'),
                          subtitle: Text('App preferences'),
                          trailing: Icon(Icons.chevron_right),
                          onTap: null, // TODO: Implement settings
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildProfileItem({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      subtitle: Text(value),
    );
  }
}
