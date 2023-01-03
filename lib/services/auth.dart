import 'dart:io';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_storage/firebase_storage.dart';

class AuthService {
  FirebaseFunctions functions = FirebaseFunctions.instance;
  final userStream = FirebaseAuth.instance.authStateChanges();
  final user = FirebaseAuth.instance.currentUser;

  Future<bool> signInWithEmailAndPassword(String email, String password) async {
    try {
      await FirebaseAuth.instance
          .signInWithEmailAndPassword(email: email, password: password);
      return true;
    } on FirebaseAuthException catch (e) {
      throw e;
    }
  }

  Future<bool> createUserProfile(
    String uid,
    String firstName,
    String lastName,
    String city,
    String address,
    String email,
    String phoneNumber,
    File profilePicture,
  ) async {
    try {
      // // upload the profile picture to storage and get the download URL
      String profilePictureUrl =
          await uploadProfilePicture(profilePicture, uid);

      final HttpsCallable createUserProfile =
          functions.httpsCallable('createUserProfile');
      await createUserProfile({
        'uid': uid,
        'firstName': firstName,
        'lastName': lastName,
        'city': city,
        'address': address,
        'email': email,
        'phoneNumber': phoneNumber,
        'profilePictureUrl': profilePictureUrl
      });
      return true;
    } on FirebaseException catch (e) {
      throw e;
    }
  }

  Future<String> uploadProfilePicture(File profilePicture, String uid) async {
    try {
      // Create a reference to the storage bucket
      final storage = FirebaseStorage.instance;
      // Create a reference to the file in the storage bucket
      final ref = storage.ref().child('user_profile_pictures/$uid');
      // Upload the file to the storage bucket
      final task = ref.putFile(profilePicture);
      // Wait for the upload to complete
      await task.whenComplete(() => null);
      // Get the download URL for the file
      final profilePictureUrl = await ref.getDownloadURL();

      return profilePictureUrl;
    } on FirebaseException catch (e) {
      throw e;
    }
  }

  Future<bool> checkIfUserExists() async {
    try {
      final uid = FirebaseAuth.instance.currentUser?.uid;
      final HttpsCallable checkIfUserExists =
          functions.httpsCallable('checkIfUserExists');
      var exists = await checkIfUserExists({'uid': uid});
      return exists.data;
    } on FirebaseException catch (e) {
      throw e;
    }
  }

  Future<void> signOut() async {
    await FirebaseAuth.instance.signOut();
  }

  // Future<void> setCustomClaims(
  //     {required String email, required String role}) async {
  //   try {
  //     final HttpsCallable setCustomClaimsToUser =
  //         functions.httpsCallable('setCustomClaimsToUser');
  //     await setCustomClaimsToUser({'role': role, 'email': email});
  //   } on FirebaseException catch (e) {
  //     throw e;
  //   }
  // }

  // Future<bool> isAdmin() async {
  //   try {
  //     final idTokenResult =
  //         await FirebaseAuth.instance.currentUser?.getIdTokenResult();
  //     final claims = idTokenResult?.claims;
  //     print(idTokenResult);

  //     if (claims?['role'] == 'admin') {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } on FirebaseException catch (e) {
  //     throw e;
  //   }
  // }

}
