import 'package:flutter/material.dart';
import 'package:skeleton/services/auth.dart';
import 'package:provider/provider.dart';
import 'package:skeleton/providers/nav_drawer_provider.dart';
import 'package:skeleton/screens/profile/profile.dart';

class NavigationDrawer extends StatefulWidget {
  const NavigationDrawer({Key? key}) : super(key: key);

  @override
  State<NavigationDrawer> createState() => _NavigationDrawer();
}

class _NavigationDrawer extends State<NavigationDrawer> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;
    final appBarHeight = AppBar().preferredSize.height;

    return Drawer(
      width: 160,
      child: Column(
        children: <Widget>[
          Container(
            height: 115,
            color: Colors.black,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(38, 66, 38, 16),
              child: Text(
                'Skeleton',
                style: textTheme.headline6!.copyWith(color: Colors.white),
              ),
            ),
          ),
          const Divider(
            height: 1,
            thickness: 1,
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: <Widget>[
                ListTile(
                  leading: const Icon(Icons.person),
                  title: const Text('Profile'),
                  selected:
                      context.watch<NavDrawerProvider>().selectedIndex == 0,
                  onTap: () {
                    context.read<NavDrawerProvider>().updateIndex(0);
                    var route = MaterialPageRoute(
                      builder: (BuildContext context) => const ProfileScreen(),
                    );
                    Navigator.of(context)
                        .pushAndRemoveUntil(route, (route) => false);
                  },
                ),
              ],
            ),
          ),
          ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () async {
                await AuthService().signOut();
                Navigator.of(context)
                    .pushNamedAndRemoveUntil('/', (route) => false);
              }),
        ],
      ),
    );
  }
}
