import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:skeleton/services/auth.dart';
import 'package:skeleton/home.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with TickerProviderStateMixin {
  final _authService = AuthService();
  final _formKey = GlobalKey<FormState>();
  late String _email = '';
  late String _password = '';
  bool _isLoading = false;
  late String _errorMessage = '';
  late AnimationController _loginButtonAnimationController;
  late Animation<Offset> _loginButtonSlideAnimation;

  @override
  void initState() {
    super.initState();
    _loginButtonAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _loginButtonSlideAnimation = Tween<Offset>(
      begin: const Offset(0, 1),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _loginButtonAnimationController,
        curve: Curves.easeIn,
      ),
    );

    // Check if the TextFormFields are already initialized with non-empty strings
    if (_email.isNotEmpty && _password.isNotEmpty) {
      _loginButtonAnimationController.forward();
    }
  }

  @override
  void dispose() {
    _loginButtonAnimationController.dispose();
    super.dispose();
  }

  void _signInWithEmailAndPassword() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorMessage = '';
      });
      try {
        bool signedIn =
            await _authService.signInWithEmailAndPassword(_email, _password);
        if (signedIn) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const HomeScreen(),
            ),
          );
        }
      } on FirebaseAuthException catch (e) {
        if (e.code == 'invalid-email') {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Center(
              heightFactor: 1,
              child: Text('Invalid email'),
            ),
          ));
        } else if (e.code == 'wrong-password') {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Center(child: Text('Incorrect password')),
          ));
        } else {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Center(child: Text('Error signing in')),
          ));
        }
      }
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            const Image(image: AssetImage('lib/assets/skeleton_logo.jpeg')),
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(
                      hintText: 'Email',
                    ),
                    validator: (value) =>
                        value!.isEmpty ? 'Please enter an email' : null,
                    onChanged: (value) {
                      _email = value;
                      if (_email.isNotEmpty && _password.isNotEmpty) {
                        _loginButtonAnimationController.forward();
                      } else {
                        _loginButtonAnimationController.reverse();
                      }
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(
                      hintText: 'Password',
                    ),
                    validator: (value) =>
                        value!.isEmpty ? 'Please enter a password' : null,
                    obscureText: true,
                    onChanged: (value) {
                      _password = value;
                      if (_email.isNotEmpty && _password.isNotEmpty) {
                        _loginButtonAnimationController.forward();
                      } else {
                        _loginButtonAnimationController.reverse();
                      }
                    },
                  ),
                ],
              ),
            ),
            if (_errorMessage != '')
              Text(
                _errorMessage,
              ),
            _isLoading
                ? const Center(child: CircularProgressIndicator())
                : FadeTransition(
                    opacity: _loginButtonAnimationController,
                    child: SlideTransition(
                      position: _loginButtonSlideAnimation,
                      child: ElevatedButton(
                        style: TextButton.styleFrom(
                          backgroundColor: Colors.black,
                          textStyle: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        onPressed: _signInWithEmailAndPassword,
                        child: const Text('Sign In'),
                      ),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
