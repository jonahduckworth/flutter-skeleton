import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'package:skeleton/providers/admin_provider.dart';
import 'package:skeleton/screens/login/login.dart';
import 'package:skeleton/screens/new_user/new_user.dart';
import 'package:skeleton/screens/profile/profile.dart';
import 'package:skeleton/services/auth.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<Map> dataFuture;

  @override
  void initState() {
    super.initState();
    dataFuture = checkUser();
  }

  Future<Map> checkUser() async {
    // bool isAdmin = await AuthService().isAdmin();
    // print('isAdmin: $isAdmin');
    bool exists = await AuthService().checkIfUserExists();
    print('exists: $exists');

    return {
      // 'admin': isAdmin,
      'exists': exists,
    };
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: dataFuture,
        builder: (context, AsyncSnapshot snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasData) {
              Map data = snapshot.data;
              // context.read<AdminProvider>().updateAdmin(data['admin']);
              bool exists = data['exists'];

              return StreamBuilder(
                stream: AuthService().userStream,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(
                      child: CircularProgressIndicator(),
                    );
                  } else if (snapshot.hasError) {
                    return const Center(
                      child: Text("error"),
                    );
                  } else if (snapshot.hasData) {
                    if (exists) {
                      return const ProfileScreen();
                    } else {
                      return const NewUserScreen();
                    }
                  } else {
                    return const LoginScreen();
                  }
                },
              );
            } else {
              return const LoginScreen();
            }
          } else {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
        });
  }
}
