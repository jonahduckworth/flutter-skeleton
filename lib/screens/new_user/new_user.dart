import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:skeleton/services/auth.dart';
import 'package:skeleton/screens/profile/profile.dart';
import 'package:skeleton/home.dart';

class NewUserScreen extends StatefulWidget {
  const NewUserScreen({Key? key}) : super(key: key);

  @override
  State<NewUserScreen> createState() => _NewUserScreenState();
}

class _NewUserScreenState extends State<NewUserScreen> {
  final _formKey = GlobalKey<FormState>();
  late String _firstName = '';
  late String _lastName = '';
  late String _city = '';
  late String _address = '';
  late String _phoneNumber = '';
  late File _profilePicture = File('');

  void _chooseProfilePicture() async {
    // Create an instance of the ImagePicker
    final imagePicker = ImagePicker();
    final imageFile = await imagePicker.pickImage(source: ImageSource.gallery);
    if (imageFile != null) {
      setState(() {
        _profilePicture = File(imageFile.path);
      });
    }
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      final authService = AuthService();
      final uid = authService.user!.uid;
      final email = authService.user!.email;

      // Save the new user information to the database
      var created = await authService.createUserProfile(
        uid,
        _firstName,
        _lastName,
        _city,
        _address,
        email!,
        _phoneNumber,
        _profilePicture,
      );
      print('New user created successfully');

      if (created) {
        // Set custom claims to the new user
        // authService.setCustomClaims(email: email, role: 'admin');

        // Navigate to the home screen
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => const ProfileScreen(),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(40),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const SizedBox(
                height: 50,
              ),
              GestureDetector(
                onTap: () {
                  _chooseProfilePicture();
                },
                child: CircleAvatar(
                  radius: 150,
                  backgroundColor: const Color.fromARGB(255, 177, 177, 177),
                  child: ClipOval(
                    child: SizedBox(
                      width: 300,
                      height: 300,
                      child: (_profilePicture != File('') &&
                              _profilePicture.path != '')
                          ? Image.file(
                              _profilePicture,
                              fit: BoxFit.cover,
                            )
                          : const Image(
                              image: AssetImage(
                                  'lib/assets/default_profile_pic.jpeg'),
                              fit: BoxFit.fill,
                            ),
                    ),
                  ),
                ),
              ),
              const SizedBox(
                height: 50,
              ),
              TextFormField(
                textAlign: TextAlign.center,
                decoration: const InputDecoration(
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.orange),
                  ),
                  hintText: 'First name',
                ),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter your first name' : null,
                onChanged: (value) => _firstName = value,
              ),
              const SizedBox(height: 10),
              TextFormField(
                textAlign: TextAlign.center,
                decoration: const InputDecoration(
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.orange),
                  ),
                  hintText: 'Last name',
                ),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter your last name' : null,
                onChanged: (value) => _lastName = value,
              ),
              const SizedBox(height: 10),
              TextFormField(
                textAlign: TextAlign.center,
                decoration: const InputDecoration(
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.orange),
                  ),
                  hintText: 'City',
                ),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter your city' : null,
                onChanged: (value) => _city = value,
              ),
              const SizedBox(height: 10),
              TextFormField(
                textAlign: TextAlign.center,
                decoration: const InputDecoration(
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.orange),
                  ),
                  hintText: 'Address',
                ),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter your address' : null,
                onChanged: (value) => _address = value,
              ),
              const SizedBox(height: 10),
              TextFormField(
                textAlign: TextAlign.center,
                decoration: const InputDecoration(
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.orange),
                  ),
                  hintText: 'Phone Number',
                ),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter your phone number' : null,
                onChanged: (value) => _phoneNumber = value,
              ),
              const SizedBox(
                height: 50,
              ),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    _submitForm();
                    // var route = MaterialPageRoute(
                    //   builder: (BuildContext context) => const ProfileScreen(),
                    // );
                    // Navigator.of(context)
                    //     .pushAndRemoveUntil(route, (route) => false);
                  }
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
                child: const Text('Create Account'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
